from fastapi import APIRouter, Depends
from auth_service.depends.auth import token_dep
from auth_service.logic.config import give_config, set_config, patch_config
from auth_service.schemas.base import FunctionRespons, TokenData, TypeRespons
from auth_service.schemas.config import ConfigSchema, PatchConfigSchema
from auth_service.schemas.auth import UserLevel
from auth_service.settings import config
from fastapi.responses import JSONResponse

router = APIRouter(
	prefix="/api/config",
	tags=["config"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=ConfigSchema)
async def config(auth_data: TokenData = Depends(token_dep)):
	if auth_data.user_level != UserLevel.ADMIN.value:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await give_config()
	if(res.status == TypeRespons.OK):
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.put("")
async def config(data: ConfigSchema, auth_data: TokenData = Depends(token_dep)):
	if auth_data.user_level != UserLevel.ADMIN:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await set_config(data)
	if(res.status == TypeRespons.OK):
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.patch("")
async def config(data: PatchConfigSchema, auth_data: TokenData = Depends(token_dep)):
	if auth_data.user_level != UserLevel.ADMIN:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await patch_config(data)
	if(res.status == TypeRespons.OK):
		return res.data
	return JSONResponse(status_code=400, content={"message": res.detail})