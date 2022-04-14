from auth_service.depends.auth import token_dep
from auth_service.logic.image import add_image, delete_image, get_bacground, get_images, linc_bakground
from auth_service.logic.user import addUser, deleteUser, editUser, getUser, getUsers
from auth_service.logic.user_config import get_user_config
from auth_service.models import Image
from auth_service.schemas.base import TokenData, TypeRespons
from auth_service.schemas.image import TypeBackground
from auth_service.schemas.user_config import UserConfig
from auth_service.settings import IMAGE_DIR

from fastapi import APIRouter, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter(
	prefix="/api/config",
	tags=["user_config"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=UserConfig)
async def get(auth_data: TokenData = Depends(token_dep)):
	res = await get_user_config(auth_data.user_id)
	if res.status == TypeRespons.OK:
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})