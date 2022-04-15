from typing import List
from auth_service.models import Image, ImageBackground, User
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.user_config import Background, UserConfig

async def convertBackgrount(backgrounds: List[ImageBackground])->List[Background]:
	arr:List[Background] = list()
	for item in backgrounds:
		image = await Image.objects.get_or_none(id=item.image.id)
		if not image:
			continue
		arr.append(Background(url=image.url, type=item.type, title=image.title))
	return arr

async def get_user_config(user_id: int)->FunctionRespons:
	user = await User.objects.get_or_none(id = user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
	backgrounds = await ImageBackground.objects.all(user=user)
	data = UserConfig(backgrounds=await convertBackgrount(backgrounds))
	return FunctionRespons(status=TypeRespons.OK, data=data)
