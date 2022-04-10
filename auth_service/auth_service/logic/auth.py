import logging
import bcrypt
from auth_service.schemas.base import FunctionRespons, TypeRespons
import jwt

from jwt import ExpiredSignatureError

from datetime import datetime, timedelta

from auth_service.models import User
from auth_service.schemas.auth import Login, ResponseLogin, Tokens
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
            encoded_jwt = await create_tokens(u.id)
            result = ResponseLogin(token=encoded_jwt.access, userId=u.id, userLevel=u.level)
            logger.info(f"login user: {u.name}, id: {u.id}")
            return FunctionRespons(status = TypeRespons.OK, data={"refresh":encoded_jwt.refresh, "response": result})
        return FunctionRespons(status = TypeRespons.ERROR, detail='invalid data')
    except Exception as e:
        logger.error(f"user does not exist. detail: {e}")
        return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def create_tokens(user_id:int)->Tokens:
    access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_toket_expire = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    return Tokens(
        access = await create_token(
            data = {'user_id':user_id,},
            expires_delta = access_toket_expire,
            type = "access",
            secret = settings.SECRET_JWT_KEY
        ),
        refresh = await create_token(
            data = {'user_id':user_id,},
            expires_delta = refresh_toket_expire,
            type = "refresh",
            secret = settings.SECRET_REFRESH_JWT_KEY
        ),
    )


async def create_token(data: dict, expires_delta: timedelta = timedelta(minutes=15), type: str = "access", secret: str = settings.SECRET_JWT_KEY):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({'exp': expire, 'sub': type})
    encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
    return encoded_jwt

async def auth(Authorization):
    try:
        head = Authorization
        jwtdata = head
        jwtdata = head.split(" ")[1]
        data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
        if not('exp' in data and 'user_id' in data and data['sub'] == "access"):
            logger.worning(f"no data in jwt")
            return {'type':'error'}
        if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
            logger.debug(f"outdated jwt")
            return {'type':'outdated_jwt'}
        user = await User.objects.get(id=data['user_id'])
        logger.info(f"the user is logged in. id:{data['user_id']}")
        return {'type':'ok', 'user_id':data['user_id'], 'user_level':user.level}
    except ExpiredSignatureError as e:
        return {'type':'outdated_jwt', 'detail':e}
    except Exception as e:
        return {'type':'error', 'detail':e}

async def refresh_token(token: str):
    try:
        data = jwt.decode(token,settings.SECRET_REFRESH_JWT_KEY,algorithms=[settings.ALGORITHM])
        if not('exp' in data and 'user_id' in data and data['sub'] == "refresh"):
            logger.worning(f"no data in jwt")
            return {'type':'error'}
        if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
            logger.debug(f"outdated jwt")
            return {'type':'outdated_jwt'}
        u = await User.objects.get_or_none(id=data["user_id"])
        encoded_jwt = await create_tokens(u.id)
        result = {"token":encoded_jwt.access, "userId":u.id,"userLavel":u.level}
        logger.info(f"login user: {u.UserName}, id: {u.id}")
        return {"status":"ok","data":{"refresh":encoded_jwt.refresh, "response": result}}
    except Exception as e:
        return {'type':'error', 'detail':e}
