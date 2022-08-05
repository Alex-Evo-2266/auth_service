from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.config import ConfigSchema
from auth_service.settings import config

async def give_config()->FunctionRespons:
	try:
		data = config.get()
		return FunctionRespons(status=TypeRespons.OK, data=data)
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def give_config()->FunctionRespons:
	try:
		data = config.get()
		return FunctionRespons(status=TypeRespons.OK, data=data)
	except Exception as e:
		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))
