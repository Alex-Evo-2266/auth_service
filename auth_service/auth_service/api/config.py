from fastapi import APIRouter, Depends
from auth_service.depends.auth import token_dep
from auth_service.logic.config import give_config
from auth_service.schemas.base import FunctionRespons, TokenData, TypeRespons
from auth_service.schemas.config import ConfigSchema
from auth_service.settings import config
from fastapi.responses import JSONResponse

router = APIRouter(
	prefix="/api/config",
	tags=["config"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=ConfigSchema)
async def config(auth_data: TokenData = Depends(token_dep)):
    res = await give_config()
    if(res.status == TypeRespons.OK):
        return res.data
    return JSONResponse(status_code=403, content={"message": res.detail})

@router.put("")
async def config(data: ConfigSchema,auth_data: TokenData = Depends(token_dep)):
    res = await give_config()
    if(res.status == TypeRespons.OK):
        return res.data
    return JSONResponse(status_code=403, content={"message": res.detail})