from auth_service.depends.auth import token_dep
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers
from auth_service.logic.colors import get_colors, add_color, delete_color
from auth_service.models import InterfaceColor
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.colors import ColorForm
from auth_service.settings import IMAGE_DIR

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(
	prefix="/api/color",
	tags=["color"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=List[InterfaceColor], response_model_exclude={"user"})
async def get_color(auth_data: TokenData = Depends(token_dep)):
	res = await get_colors(auth_data.user_id)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.OK:
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.post("/create")
async def get_color(data:ColorForm ,auth_data: TokenData = Depends(token_dep)):
	res = await add_color(data, auth_data.user_id)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.delete("/{id}")
async def get_color(id:int, auth_data: TokenData = Depends(token_dep)):
	res = await delete_color(id, auth_data.user_id)
	if res.status == TypeRespons.NOT_FOUND:
		return JSONResponse(status_code=404, content={"message": res.detail})
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})
