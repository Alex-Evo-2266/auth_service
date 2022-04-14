from typing import List
from auth_service.models import Image, ImageBackground, User
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.user_config import Background, UserConfig

def convertBackgrount(backgrounds: List[ImageBackground])->List[Background]:
	arr:List[Background] = list()
	for item in backgrounds:
		arr.append(Background(url=item.image.image, type=item.type, title=item.image.title))
	return arr

async def get_user_config(user_id: int)->FunctionRespons:
	user = await User.objects.get_or_none(id = user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
	backgrounds = user.background
	data = UserConfig(backgrounds=convertBackgrount(backgrounds))
	return FunctionRespons(status=TypeRespons.OK, data=data)
