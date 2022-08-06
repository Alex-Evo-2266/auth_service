import logging
import bcrypt
from auth_service.schemas.base import FunctionRespons, TypeRespons
import jwt
import random

from typing import Optional, List
from datetime import datetime, timedelta
# from .images.fon import getBackgroundUser

# from SmartHome import settings
from auth_service.schemas.user import UserForm, UserSchema, UserEditSchema, UserEditPasswordSchema, UserNameSchema
from auth_service.models import Image, User
# from SmartHome.logic.homePage import lookForPage
from auth_service.logic.mail import send_email

logger = logging.getLogger(__name__)

async def addUser(data: UserForm)->FunctionRespons:
	try:
		logger.debug(f"add user input data: {data.dict()}")
		hashedPass = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
		cond:User | None = await User.objects.get_or_none(name=data.name)
		if(cond):
			return FunctionRespons(status=TypeRespons.ERROR, detail='such user already exists.')
		newUser = await User.objects.create(name=data.name, email=data.email,password=hashedPass)
		message = "login = " + data.name + "\npassword = " + data.password
		logger.info(f"add user. data: {data.dict()}")
		await send_email("Account smart home",data.email,message)
		return FunctionRespons(status = TypeRespons.OK)
	except Exception as e:
		logger.error(f"error add user: {e}")
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def getUser(id)->FunctionRespons:
	user = await User.objects.get_or_none(id=id)
	if not user:
		logger.error(f"none user")
		return FunctionRespons(status = TypeRespons.NOT_FOUND, detail="user not found")
	image = await Image.objects.get_or_none(id=user.profile_image)
	url = None
	if image:
		url = image.url
	return FunctionRespons(status=TypeRespons.OK, data=UserSchema(
		id=user.id,
		name=user.name,
		surname=user.surname,
		email=user.email,
		level=user.level,
		imageURL=url
	))

async def editUser(id: int,data: UserEditSchema)->FunctionRespons:
	user = await User.objects.get_or_none(id=id)
	if not user:
		logger.error(f"user does not exist. id:{id}")
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	user.name = data.name
	user.surname = data.surname
	user.email = data.email
	await user.update(_columns=["name", "surname", "email"])
	logger.debug(f'edit user {id}')
	return FunctionRespons(status = TypeRespons.OK)

async def deleteUser(id)->FunctionRespons:
	u = await User.objects.get_or_none(id=id)
	if not u:
		logger.error(f"none user")
		return FunctionRespons(status = TypeRespons.NOT_FOUND, detail="user not found")
	message = "Account deleted name = " + u.name
	await send_email("Account smart home",u.email,message)
	logger.info(f"user delete. id:{id}. user name:{u.name}")
	await u.delete()
	return FunctionRespons(status = TypeRespons.OK)

async def getUsers()->FunctionRespons:
	outUsers = list()
	users = await User.objects.all()
	if not users:
		logger.error(f"none users")
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	for item in users:
		image = await Image.objects.get_or_none(id=item.profile_image)
		url = None
		if image:
			url = image.url
		outUsers.append(UserSchema(
			id=item.id,
			name=item.name,
			surname=item.surname,
			email=item.email,
			level=item.level,
			imageURL=url
		))
	return FunctionRespons(status = TypeRespons.OK, data=outUsers)

def strGenerator(chars:str, count:int)->FunctionRespons:
    password =''
    for i in range(count):
        password += random.choice(chars)
    return FunctionRespons(status=TypeRespons.OK, data=password)

async def new_pass(data:UserEditPasswordSchema, user_id: int)->FunctionRespons:
	user = await User.objects.get_or_none(id=user_id)
	if not user:
		logger.error(f"user does not exist. id:{id}")
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	if bcrypt.checkpw(data.old_password.encode('utf-8'),user.password.encode('utf-8')):
		user.password = bcrypt.hashpw(data.new_password.encode('utf-8'), bcrypt.gensalt())
		await user.update(_columns=["password"])
	else:
		logger.info(f'password invalid')
		return FunctionRespons(status = TypeRespons.ERROR, detail="invalid password")
	await send_email("Account smart home",user.email,"password changed")
	logger.debug(f'password changed. user = {id}')
	return FunctionRespons(status = TypeRespons.OK)

async def new_gen_pass(data:UserNameSchema)->FunctionRespons:
	user = await User.objects.get_or_none(name=data.name)
	if not user:
		logger.error(f"user does not exist. name:{data.name}")
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	password = strGenerator('+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 10).data
	user.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
	await user.update(_columns=["password"])
	await send_email("Account smart home",user.email,"new password '" + password + "'")
	logger.debug(f'password changed')
	return FunctionRespons(status = TypeRespons.OK)