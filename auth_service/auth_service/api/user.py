import json
from auth_service.depends.auth import token_dep
from auth_service.logic.colors import set_color
from auth_service.logic.image import set_profile_image
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers
from auth_service.logic.user_config import get_user_config
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.user import UserEditSchema, UserForm, UserSchema

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from auth_service.schemas.user_config import UserConfig

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.post("/create")
async def add(data: UserForm, auth_data:TokenData = Depends(token_dep)):
    if auth_data.user_level != 3:
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

@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: TokenData = Depends(token_dep)):
    res = await getUsers()
    if res.status == TypeRespons.ERROR:
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    if res.status == TypeRespons.NOT_FOUND:
        return JSONResponse(status_code=404, content={"message": res.detail})
    return res['data']

@router.get("/color/set/{colorId}")
async def all(colorId:int, auth_data: TokenData = Depends(token_dep)):
    res = await set_color(colorId, auth_data.user_id)
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