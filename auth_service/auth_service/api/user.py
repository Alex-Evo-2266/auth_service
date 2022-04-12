import json
from auth_service.depends.auth import token_dep
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers
from auth_service.schemas.base import TokenData
from auth_service.schemas.user import UserEditSchema, UserForm, UserSchema

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

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
    return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("", response_model=UserSchema)
async def get(auth_data: TokenData = Depends(token_dep)):
    res = await getUser(auth_data.user_id)
    if res.status == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res.data

@router.get("/{userId}", response_model=UserSchema)
async def get(userId: int, auth_data: TokenData = Depends(token_dep)):
    res = await getUser(userId)
    if res.status == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res.data

@router.put("")
async def edit(data: UserEditSchema, auth_data: TokenData = Depends(token_dep)):
    res = await editUser(auth_data.user_id, data)
    if res.status == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.delete("/{userId}")
async def delete(userId: int, auth_data: TokenData = Depends(token_dep)):
    if auth_data.user_level != 3:
        return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
    if (auth_data.user_id == userId):
        return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
    res = await deleteUser(userId)
    if res.status == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: TokenData = Depends(token_dep)):
    res = await getUsers()
    if res.status == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res['data']
