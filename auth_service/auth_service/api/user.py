import json
from auth_service.depends.auth import token_dep
from auth_service.logic.colors import set_color
from auth_service.logic.image import set_profile_image
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers, new_pass, new_gen_pass
from auth_service.logic.user_config import get_user_config, set_config
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.auth import UserLevel
from auth_service.schemas.user import TypeTheme, UserEditSchema, UserForm, UserSchema, UserEditPasswordSchema, UserNameSchema
from auth_service.logic.auth import auth

from fastapi import APIRouter, Depends, Header, HTTPException, Cookie
from fastapi.responses import JSONResponse
from typing import Optional, List

from auth_service.schemas.user_config import UserConfig, UserConfigPatch

from auth_service.settings import REGISTER_USER

router = APIRouter(
	prefix="/api/users",
	tags=["users"],
	responses={404: {"description": "Not found"}},
)

async def user_create_token_dep(authorization_token: Optional[str] = Header(None))->TokenData:
	if REGISTER_USER:
		return TokenData(user_id=-1, user_level=-1)
	if not authorization_token:
		raise HTTPException(status_code=403, detail="token not found")
	auth_data = await auth(authorization_token)
	if auth_data.status == TypeRespons.INVALID and auth_data.detail.split(' ')[0] == "outdated_jwt":
		raise HTTPException(status_code=401, detail="outdated jwt")
	if auth_data.status == TypeRespons.ERROR:
		raise HTTPException(status_code=403, detail="invalid jwt")
	return auth_data.data

@router.post("/create")
async def add(data: UserForm, auth_data:TokenData = Depends(user_create_token_dep)):
	if auth_data.user_level != UserLevel.ADMIN and not REGISTER_USER:
	   return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await addUser(data)
	if res.status == 'ok':
		return {"message":"ok"}
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/config", response_model=UserConfig)
async def get(auth_data: TokenData = Depends(token_dep)):
	res = await get_user_config(auth_data.user_id)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.OK:
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("", response_model=UserSchema)
async def get(auth_data: TokenData = Depends(token_dep)):
	res = await getUser(auth_data.user_id)
	if res.status == TypeRespons.ERROR:
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	return res.data

@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: TokenData = Depends(token_dep)):
	res = await getUsers()
	if res.status == TypeRespons.ERROR:
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	data: List[UserSchema] = res.data
	return data

@router.get("/{userId}", response_model=UserSchema)
async def get(userId: int, auth_data: TokenData = Depends(token_dep)):
	res = await getUser(userId)
	if res.status == TypeRespons.ERROR:
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	return res.data

@router.put("")
async def edit(data: UserEditSchema, auth_data: TokenData = Depends(token_dep)):
	res = await editUser(auth_data.user_id, data)
	if res.status == TypeRespons.ERROR:
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	return "ok"

@router.delete("/{userId}")
async def delete(userId: int, auth_data: TokenData = Depends(token_dep)):
	if auth_data.user_level != 3:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	if (auth_data.user_id == userId):
		return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
	res = await deleteUser(userId)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.get("/color/{type}/set/{colorId}")
async def all(type:TypeTheme, colorId:int, auth_data: TokenData = Depends(token_dep)):
	res = await set_color(type, colorId, auth_data.user_id)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.ERROR:
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.get("/profile/set/{imageId}")
async def setprofileimage(imageId: int, auth_data: TokenData = Depends(token_dep)):
	res = await set_profile_image(auth_data.user_id, imageId)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.patch("/config")
async def setconfig(data: UserConfigPatch, auth_data: TokenData = Depends(token_dep)):
	res = await set_config(data, auth_data.user_id)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.post("/newpass")
async def newpass(data: UserEditPasswordSchema, auth_data: TokenData = Depends(token_dep)):
	res = await new_pass(data, auth_data.user_id)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.post("/gen_new_pass")
async def newpass(data: UserNameSchema):
	res = await new_gen_pass(data)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})