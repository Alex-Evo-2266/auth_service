from auth_service.depends.auth import token_dep
from auth_service.logic.image import add_image, delete_image, get_bacground, get_images, linc_bakground
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers
from auth_service.models import Image
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.image import TypeBackground
from auth_service.settings import IMAGE_DIR

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(
	prefix="/api/images",
	tags=["images"],
	responses={404: {"description": "Not found"}},
)

@router.post("/create")
async def add(file: UploadFile = File(...), auth_data: TokenData = Depends(token_dep)):
	res = await add_image(file, auth_data.user_id)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("", response_model=List[Image], response_model_exclude={"user", "background"})
async def add(auth_data: TokenData = Depends(token_dep)):
	res = await get_images(auth_data.user_id)
	if res.status == TypeRespons.OK:
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.delete("/{imageId}")
async def add(imageId:int, auth_data: TokenData = Depends(token_dep)):
	res = await delete_image(auth_data.user_id, imageId)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/{imageId}/set/{type}")
async def add(imageId:int, type:TypeBackground, auth_data: TokenData = Depends(token_dep)):
	res = await linc_bakground(auth_data.user_id, imageId, type)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/backgrounds")
async def add(auth_data: TokenData = Depends(token_dep)):
	res = await get_bacground(auth_data.user_id)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})