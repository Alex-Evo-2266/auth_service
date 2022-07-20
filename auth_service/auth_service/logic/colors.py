from turtle import title
from auth_service.models import InterfaceColor, User
from auth_service.schemas.base import FunctionRespons, TypeRespons
from auth_service.schemas.colors import ColorForm
from auth_service.schemas.user import TypeTheme

async def add_color(data:ColorForm, id_user:int)->FunctionRespons:
	user = await User.objects.get_or_none(id=id_user)
	if not user:
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	cond = await InterfaceColor.objects.get_or_none(user=user, title=data.title)
	if cond:
		return FunctionRespons(status = TypeRespons.INVALID, detail="such сolor palette already exists")
	await InterfaceColor.objects.create(title=data.title, user=user, color1=data.color1.as_hex(), color2=data.color2.as_hex(), active=data.active.as_hex())
	return FunctionRespons(status=TypeRespons.OK)

async def get_colors(id_user:int)->FunctionRespons:
	user = await User.objects.get_or_none(id=id_user)
	if not user:
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	colors = await InterfaceColor.objects.all(user=user)
	return FunctionRespons(status=TypeRespons.OK, data=colors)

async def delete_color(id_color:int, id_user:int)->FunctionRespons:
	user = await User.objects.get_or_none(id=id_user)
	if not user:
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	color = await InterfaceColor.objects.get_or_none(id=id_color)
	if not color:
		return FunctionRespons(status = TypeRespons.NOT_FOUND, detail="color not found")
	if color.user != user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="the color belongs to another user.")
	if user.color == color.id:
		user.color = -1
		await user.update(_columns=["color"])
	await color.delete()
	return FunctionRespons(status=TypeRespons.OK)

async def set_color(type:TypeTheme, id_color:int, id_user:int)->FunctionRespons:
	user = await User.objects.get_or_none(id=id_user)
	if not user:
		return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
	color = await InterfaceColor.objects.get_or_none(id=id_color)
	if not color:
		return FunctionRespons(status = TypeRespons.NOT_FOUND, detail="color not found")
	if color.user != user:
		return FunctionRespons(status=TypeRespons.ERROR, detail="the color belongs to another user.")
	if type == TypeTheme.LIGHT:
		user.color = color.id
		await user.update(_columns=["color"])
	elif type == TypeTheme.NIGHT:
		user.nightColor = color.id
		await user.update(_columns=["nightColor"])
	elif type == TypeTheme.SPECIAL:
		user.specialColor = color.id
		await user.update(_columns=["specialColor"])
	return FunctionRespons(status=TypeRespons.OK)
	
