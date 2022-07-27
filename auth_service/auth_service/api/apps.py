from typing import List
from fastapi import APIRouter, Depends, UploadFile, File
from auth_service.logic.apps import add_apps, del_apps, give_apps
from fastapi.responses import JSONResponse
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.apps import AppResponse, CreateApps, CreateAppsRespons
from auth_service.models import Client, User
from auth_service.depends.auth import token_dep

router = APIRouter(
	prefix="/api/app",
	tags=["apps"],
	responses={404: {"description": "Not found"}},
)

@router.post("/create", response_model=CreateAppsRespons)
async def add(data: CreateApps, auth_data: TokenData = Depends(token_dep)):
	data_app = await add_apps(data, auth_data.user_id)
	if data_app.status == TypeRespons.OK:
		return data_app.data
	return JSONResponse (status_code=400, content={"message": data_app.detail})

@router.delete("/{client_id}")
async def delete(client_id: str, auth_data: TokenData = Depends(token_dep)):
	data_app = await del_apps(client_id, auth_data.user_id)
	if data_app.status == TypeRespons.OK:
		return data_app.data
	return JSONResponse (status_code=400, content={"message": data_app.detail})

@router.get("/", response_model=List[AppResponse])
async def give(auth_data: TokenData = Depends(token_dep)):
	ret = await give_apps(auth_data.user_id)
	return ret.data

@router.get("/new_pass/{client_id}")
async def new_pass(client_id: str, auth_data: TokenData = Depends(token_dep)):
	pass