from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.config import ConfigSchema, PatchConfigSchema
from auth_service.settings import config

async def give_config()->FunctionRespons:
	try:
		data = config.get_config()
		return FunctionRespons(status=TypeRespons.OK, data=data)
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def set_config(data: ConfigSchema)->FunctionRespons:
	try:
		config.set_config(data.dict())
		return FunctionRespons(status=TypeRespons.OK, data="ok")
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def patch_config(data: PatchConfigSchema)->FunctionRespons:
	try:
		config.patch_config(data.dict())
		return FunctionRespons(status=TypeRespons.OK, data="ok")
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))
