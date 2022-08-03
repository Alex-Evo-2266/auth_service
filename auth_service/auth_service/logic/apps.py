import logging
import random
from datetime import datetime, timedelta
from typing import List

import bcrypt
import jwt
from auth_service.models import AuthCode, BearerToken, Client, User
from auth_service.schemas.apps import AppData, CreateApps, AppFullData
from auth_service.schemas.auth import ResponseCode, TypeGrant, TypeResponse
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service import settings
from auth_service.settings import LENGTH_ID_APP, LENGTH_PASS_APP

from auth_service.utils.without_keys import without_keys
from auth_service.schemas.auth import Login, ResponseLogin, Token, TokenType, TypeResponse, TypeGrant, AuthResponse, TokenResponse
from auth_service.logic.auth import create_tokens

logger = logging.getLogger(__name__)

def strGenerator(chars:str, count:int)->FunctionRespons:
    password =''
    for i in range(count):
        password += random.choice(chars)
    return FunctionRespons(status=TypeRespons.OK, data=password)

async def add_apps(data:CreateApps, user_id: int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="error")
	datapass = strGenerator('+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', LENGTH_PASS_APP).data
	dataid = ""
	while (True):
		dataid = strGenerator('abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', LENGTH_ID_APP).data
		clients = await Client.objects.get_or_none(client_id=dataid)
		if not clients:
			break
	client = await Client.objects.create(client_id=dataid, title=data.title, user=user, grant_type=TypeGrant.CODE, response_type=TypeResponse.CODE, scopes="", default_scopes="", redirect_uris="", default_redirect_uri=data.default_redirect_uri, client_secret=datapass)
	clientbuff = client.dict()
	clientbuff = without_keys(clientbuff, {"user"})
	return FunctionRespons(status=TypeRespons.OK, data=AppFullData(**clientbuff))

async def edit_apps(data: AppData, client_id: str, user_id: int):
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="error")
	client = await Client.objects.get_or_none(user=user, client_id=client_id)
	if not client:
		return FunctionRespons(status=TypeRespons.ERROR, detail="app not found")
	if data.title:
		client.title = data.title
	if data.default_redirect_uri:
		client.default_redirect_uri = data.default_redirect_uri
	if data.redirect_uris:
		client.redirect_uris = data.redirect_uris
	if data.default_scopes:
		client.default_scopes = data.default_scopes
	if data.scopes:
		client.scopes = data.scopes
	if data.response_type:
		client.response_type = data.response_type
	if data.grant_type:
		client.grant_type = data.grant_type
	await client.update(_columns=["title", "default_redirect_uri", "redirect_uris", "default_scopes", "scopes", "response_type", "grant_type"])
	return FunctionRespons(status=TypeRespons.OK, data="ok")

async def give_apps(user_id: int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="error")
	clients = await Client.objects.all(user=user)
	arr:List[AppData] = []
	for item in clients:
		arr.append(AppFullData(
			title=item.title,
			client_id=item.client_id,
			client_secret=item.client_secret,
			grant_type=item.grant_type,
			response_type=item.response_type,
			scopes=item.scopes,
			default_scopes=item.default_scopes,
			redirect_uris=item.redirect_uris,
			default_redirect_uri=item.default_redirect_uri
			))
	return FunctionRespons(status=TypeRespons.OK, data=arr)

async def del_apps(client_id:str, user_id: int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
	client = await Client.objects.get_or_none(user=user, client_id=client_id)
	if not client:
		return FunctionRespons(status=TypeRespons.ERROR, detail="app not found")
	await client.delete()
	return FunctionRespons(status=TypeRespons.OK, data="ok")

async def auth_code(client_id:str, redirect_uri:str, scope:List[str], user_id:int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
	client = await Client.objects.get_or_none(client_id=client_id)
	if not client:
		return FunctionRespons(status=TypeRespons.ERROR, detail="app not found")
	now = datetime.now()
	expires_at = datetime.utcnow() + timedelta(minutes=15)
	codes = True
	code = ""
	while (codes):
		code = strGenerator('abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 100).data
		codes = await AuthCode.objects.get_or_none(code=code)
		print(codes)
	await AuthCode.objects.create(client=client, user=user, scopes=";".join(scope), redirect_uri=redirect_uri, expires_at=expires_at, code=code, challenge_method="", challenge="")
	return FunctionRespons(status=TypeRespons.OK, data=code)


async def get_token(code: str, client_id: str, client_secret:str)->FunctionRespons:
	client = await Client.objects.get_or_none(client_id=client_id)
	if not client:
		return FunctionRespons(status=TypeRespons.ERROR, detail="app not found")
	if client.client_secret != client_secret:
		return FunctionRespons(status=TypeRespons.ERROR, detail="invalid secret")
	code_obj = await AuthCode.objects.get_or_none(code=code, client=client)
	if code_obj.expires_at < datetime.utcnow():
		await code_obj.delete()
		return FunctionRespons(status=TypeRespons.ERROR, detail="authorization code is outdated.")
	tokens = await create_tokens(code_obj.user.id)
	arr = code_obj.scopes.split(";")
	await BearerToken.objects.create(user=code_obj.user, client=client, scopes=code_obj.scopes, access_token=tokens.access, refresh_token=tokens.refresh, expires_at=tokens.expires_at)
	await code_obj.delete()
	data = TokenResponse(access_token=tokens.access, expires_at=tokens.expires_at, token_type=TokenType.BEARER_TOKEN, refresh_token=tokens.refresh, scope=arr)
	return FunctionRespons(status=TypeRespons.OK, data=data)


