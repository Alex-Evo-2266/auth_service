from turtle import color
from typing import List
from auth_service.models import Image, ImageBackground, InterfaceColor, User
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.colors import ColorForm
from auth_service.schemas.user_config import Background, UserConfig

async def convert_backgrount(backgrounds: List[ImageBackground])->List[Background]:
	arr:List[Background] = list()
	for item in backgrounds:
		image = await Image.objects.get_or_none(id=item.image.id)
		if not image:
			continue
		arr.append(Background(url=image.url, type=item.type, title=image.title))
	return arr

async def get_color(user:User):
	lcolors = ColorForm(title="light", color1="#aebfda", color2="#efefef", active="#1E90FF")
	ncolors = ColorForm(title="night", color1="#303030", color2="#505050", active="#1E90FF")
	if user.color != -1:
		colors = await InterfaceColor.objects.get_or_none(id=user.color)
		if colors and colors.user == user:
			lcolors = ColorForm(title=colors.title, color1=colors.color1, color2=colors.color2, active=colors.active)
	if user.nightColor != -1:
		colors = await InterfaceColor.objects.get_or_none(id=user.nightColor)
		if colors and colors.user == user:
			ncolors = ColorForm(title=colors.title, color1=colors.color1, color2=colors.color2, active=colors.active)
	return (lcolors, ncolors)



async def get_user_config(user_id: int)->FunctionRespons:
	user = await User.objects.get_or_none(id = user_id)
	if not user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
	backgrounds = await ImageBackground.objects.all(user=user)
	colors = await get_color(user)
	data = UserConfig(backgrounds=await convert_backgrount(backgrounds), colors=colors[0], night_colors=colors[1])
	return FunctionRespons(status=TypeRespons.OK, data=data)
