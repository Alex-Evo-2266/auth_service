import logging
import bcrypt
from auth_service.schemas.base import FunctionRespons, TypeRespons
import jwt
import random

from typing import Optional, List
from datetime import datetime, timedelta
# from .images.fon import getBackgroundUser

# from SmartHome import settings
from auth_service.schemas.user import UserForm, UserSchema, EditUserConfigSchema, MenuElementsSchema, UserEditSchema, UserConfigSchema
from auth_service.models import User
# from SmartHome.logic.homePage import lookForPage
# from SmartHome.logic.email import send_email

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
        # await send_email("Account smart home",data.email,message)
        return FunctionRespons(status = TypeRespons.OK)
    except Exception as e:
        logger.error(f"error add user: {e}")
        return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def getUser(id)->FunctionRespons:
    user = await User.objects.get_or_none(id=id)
    if not user:
        logger.error(f"none user")
        return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
    return FunctionRespons(status=TypeRespons.OK, data=UserSchema(
        id=user.id,
        name=user.name,
        surname=user.surname,
        email=user.email,
        level=user.level,
        imageURL=None
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
        return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
    message = "Account deleted name = " + u.UserName
    # await send_email("Account smart home",u.UserEmail,message)
    logger.info(f"user delete. id:{id}. user name:{u.UserName}")
    await u.delete()
    return FunctionRespons(status = TypeRespons.OK)

async def getUsers()->FunctionRespons:
    outUsers = list()
    users = await User.objects.all()
    if not users:
        logger.error(f"none users")
        return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
    for item in users:
        outUsers.append(UserSchema(
            id=item.id,
            name=item.UserName,
            surname=item.UserSurname,
            email=item.UserEmail,
            level=item.UserLevel,
            imageURL=None
        ))
    return FunctionRespons(status = TypeRespons.OK, data=outUsers)

