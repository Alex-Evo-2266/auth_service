import logging
import random
from typing import List

import bcrypt
from auth_service.models import Client, User
from auth_service.schemas.apps import AppResponse, CreateApps, CreateAppsRespons
from auth_service.schemas.auth import TypeGrant, TypeResponse
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.settings import LENGTHPASSAPP

logger = logging.getLogger(__name__)

def newGenPass()->FunctionRespons:
    chars = '+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    password =''
    for i in range(LENGTHPASSAPP):
        password += random.choice(chars)
    hashedPass = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
    logger.debug(f'gen new password.')
    return FunctionRespons(status=TypeRespons.OK, data=password)

def Genid()->FunctionRespons:
    chars = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
    password =''
    for i in range(32):
        password += random.choice(chars)
    hashedPass = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
    logger.debug(f'gen new password.')
    return FunctionRespons(status=TypeRespons.OK, data=password)

async def add_apps(data:CreateApps, user_id: int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="error")
	datapass = newGenPass().data
	dataid = Genid().data
	client = await Client.objects.create(client_id=dataid, title=data.title, user=user, grant_type=TypeGrant.CODE, response_type=TypeResponse.CODE, scopes="", default_scopes="", redirect_uris="", default_redirect_uri=data.default_redirect_uri, client_secret=datapass)
	return FunctionRespons(status=TypeRespons.OK, data=CreateAppsRespons(client_id=client.client_id, client_secret=client.client_secret))

async def give_apps(user_id: int)->FunctionRespons:
	user: User = await User.objects.get_or_none(id=user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="error")
	clients = await Client.objects.all(user=user)
	arr:List[AppResponse] = []
	for item in clients:
		arr.append(AppResponse(
			title=item.title,
			client_id=item.client_id,
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
	client.delete()
	return FunctionRespons(status=TypeRespons.OK, data="")