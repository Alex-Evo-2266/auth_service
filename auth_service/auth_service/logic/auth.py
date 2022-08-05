import asyncio
import logging
import bcrypt
from auth_service.logic.old_token import OldTokens
from auth_service.schemas.base import FunctionRespons, TokenData, TypeRespons
import jwt
from typing import List, Optional

from jwt import ExpiredSignatureError

from datetime import datetime, timedelta

from auth_service.models import BearerToken, User
from auth_service.schemas.auth import Login, ResponseLogin, Token, Tokens, SessionSchema
from auth_service import settings

logger = logging.getLogger(__name__)

async def login(data: Login)->FunctionRespons:
	try:
		logger.debug(f"login input data: {data.dict()}")
		u = await User.objects.get_or_none(name=data.name)
		if not u:
			logger.error(f"user not found")
			return FunctionRespons(status = TypeRespons.ERROR, detail='user not found')
		if bcrypt.checkpw(data.password.encode('utf-8'),u.password.encode('utf-8')):
			encoded_jwt:Tokens = await create_tokens(u.id)
			result = ResponseLogin(token=encoded_jwt.access, userId=u.id, userLevel=u.level, expires_at=encoded_jwt.expires_at)
			logger.info(f"login user: {u.name}, id: {u.id}")
			await BearerToken.objects.create(user=u, scopes="all", access_token=encoded_jwt.access, refresh_token=encoded_jwt.refresh, expires_at=encoded_jwt.expires_at)
			return FunctionRespons(status = TypeRespons.OK, data={"refresh":encoded_jwt.refresh, "response": result})
		return FunctionRespons(status = TypeRespons.ERROR, detail='invalid data')
	except Exception as e:
		logger.error(f"user does not exist. detail: {e}")
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def logout(user_id:int, refrash:str)->FunctionRespons:
	user = await User.objects.get_or_none(id=user_id)
	if not user:
		logger.error(f"user not found")
		return FunctionRespons(status = TypeRespons.ERROR, detail='user not found')
	old_token = await BearerToken.objects.get_or_none(refresh_token=refrash, user=user)
	if not old_token:
		logger.error(f"token not found")
		return FunctionRespons(status = TypeRespons.ERROR, detail='token not found')
	await old_token.delete()
	return FunctionRespons(status = TypeRespons.OK, data='ok')

async def create_tokens(user_id:int)->Tokens:
	access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
	refresh_toket_expire = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
	access_toket_expires_at = expire = datetime.utcnow() + access_toket_expire
	refresh_toket_expires_at = expire = datetime.utcnow() + refresh_toket_expire
	return Tokens(
		access = await create_token(
			data = {'user_id':user_id,},
			expires_at = access_toket_expires_at,
			type = "access",
			secret = settings.SECRET_JWT_KEY
		),
		refresh = await create_token(
			data = {'user_id':user_id,},
			expires_at = refresh_toket_expires_at,
			type = "refresh",
			secret = settings.SECRET_REFRESH_JWT_KEY
		),
		expires_at = access_toket_expires_at
	)

async def create_token(data: dict, expires_at: datetime = datetime.utcnow() + timedelta(minutes=15), type: str = "access", secret: str = settings.SECRET_JWT_KEY):
	to_encode = data.copy()
	to_encode.update({'exp': expires_at, 'sub': type})
	encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
	return encoded_jwt

async def auth(Authorization)->FunctionRespons:
	try:
		head = Authorization
		jwtdata = head
		jwtdata = head.split(" ")[1]
		data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
		if not('exp' in data and 'user_id' in data and data['sub'] == "access"):
			logger.worning(f"no data in jwt")
			return FunctionRespons(status = TypeRespons.ERROR, detail="no data in jwt")
		if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
			logger.debug(f"outdated jwt")
			return FunctionRespons(status = TypeRespons.INVALID, detail="outdated_jwt")
		user = await User.objects.get(id=data['user_id'])
		logger.info(f"the user is logged in. id:{data['user_id']}")
		return FunctionRespons(status = TypeRespons.OK, data = TokenData(user_id = data['user_id'], user_level = user.level))
	except ExpiredSignatureError as e:
		return FunctionRespons(status = TypeRespons.INVALID, detail = f"outdated_jwt {e}")
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail = str(e))

async def refresh_token(token: str)->FunctionRespons:
	try:
		data = jwt.decode(token,settings.SECRET_REFRESH_JWT_KEY,algorithms=[settings.ALGORITHM])
		if not('exp' in data and 'user_id' in data and data['sub'] == "refresh"):
			logger.warning(f"no data in jwt")
			return FunctionRespons(status=TypeRespons.ERROR, detail="no data in jwt")
		if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
			logger.debug(f"outdated jwt")
			return FunctionRespons(status=TypeRespons.INVALID, detail="outdated jwt")
		u = await User.objects.get_or_none(id=data["user_id"])
		old_token = await BearerToken.objects.get_or_none(refresh_token=token)
		encoded_jwt = None
		if (not old_token):
			old_token2 = OldTokens.get_or_none(token)
			if not old_token2:
				return FunctionRespons(status=TypeRespons.INVALID, detail="not found token")
			encoded_jwt = Tokens(expires_at=old_token2.expires_at, access=old_token2.new_access, refresh=old_token2.new_refresh)
		else:
			encoded_jwt = await create_tokens(u.id)
			OldTokens.add(old_token.refresh_token, old_token.access_token, encoded_jwt.refresh, encoded_jwt.access, encoded_jwt.expires_at)
			loop = asyncio.get_running_loop()
			loop.create_task(OldTokens.delete_delay(old_token.refresh_token, 10))
			old_token.access_token = encoded_jwt.access
			old_token.refresh_token = encoded_jwt.refresh
			old_token.expires_at = encoded_jwt.expires_at
			await old_token.update(["access_token", "refresh_token", "expires_at"])
		result = Token(token=encoded_jwt.access, expires_at=encoded_jwt.expires_at)
		logger.info(f"login user: {u.name}, id: {u.id}")
		return FunctionRespons(status=TypeRespons.OK, data={"refresh":encoded_jwt.refresh, "response": result})
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

def	bearerTokenToSession(data:List[BearerToken])->Optional[List[SessionSchema]]:
	arr = []
	for item in data:
		client_name = "auth"
		if item.client:
			client_name = item.client.title
		host = ""
		platform = ""
		if item.host:
			host = item.host
		if item.platform:
			platform = item.platform
		arr.append(SessionSchema(id=item.id, client_name=client_name, host=host, platform=platform))
	return arr

async def get_sessions(user_id:int)->FunctionRespons:
	try:
		user = await User.objects.get_or_none(id=user_id)
		if not user:
			logger.error(f"user not found")
			return FunctionRespons(status = TypeRespons.ERROR, detail='user not found')
		sessions = await BearerToken.objects.all(user=user)
		session_array = bearerTokenToSession(sessions)
		return FunctionRespons(status=TypeRespons.OK, data=session_array)
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def delete_sessions(id:int, user_id:int):
	try:
		user = await User.objects.get_or_none(id=user_id)
		if not user:
			logger.error(f"user not found")
			return FunctionRespons(status = TypeRespons.ERROR, detail='user not found')
		session = await BearerToken.objects.get_or_none(id=id)
		if not session:
			logger.error(f"session not found")
			return FunctionRespons(status = TypeRespons.ERROR, detail='session not found')
		if session.user != user:
			logger.error(f"session invalid")
			return FunctionRespons(status = TypeRespons.ERROR, detail='session invalid')
		await session.delete()
		return FunctionRespons(status=TypeRespons.OK, data="ok")
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))