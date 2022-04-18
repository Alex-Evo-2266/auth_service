import logging
import os
from typing import List
from webbrowser import BackgroundBrowser
from auth_service.models import Image, ImageBackground, User
from auth_service.schemas.base import FunctionRespons, TypeRespons
from fastapi import UploadFile
import shutil
from auth_service.schemas.image import TypeBackground
from auth_service.settings import HOST, IMAGE_DIR, IMAGE_URL

logger = logging.getLogger(__name__)

async def add_image(file: UploadFile, user_id: int)->FunctionRespons:
	try:
		user = await User.objects.get_or_none(id=user_id)
		if not user:
			return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
		with open(IMAGE_DIR + os.sep + file.filename, 'wb') as buff:
			shutil.copyfileobj(file.file, buff)
		await Image.objects.create(title = file.filename, url=IMAGE_URL + os.sep + file.filename, user=user)
		logger.info(f"add new image. user: {user.id}, image name: {file.filename}")
		return FunctionRespons(status = TypeRespons.OK)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))
		

async def get_images(user_id: int)->FunctionRespons:
	try:
		user = await User.objects.get_or_none(id=user_id)
		if not user:
			return FunctionRespons(status = TypeRespons.ERROR, detail="user not found")
		images: List[Image] = await Image.objects.all(user=user)
		logger.debug(f"get image. user: {user_id}")
		return FunctionRespons(status = TypeRespons.OK, data = images)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def delete_image(user_id:int, image_id:int):
	try:
		user = await User.objects.get_or_none(id = user_id)
		image = await Image.objects.get_or_none(id = image_id)
		if not user:
			return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
		if not image:
			return FunctionRespons(status=TypeRespons.NOT_FOUND, detail="image not found")
		if image.user != user:
			return FunctionRespons(status=TypeRespons.ERROR, detail="the image belongs to another user.")
		background = await ImageBackground.objects.all(image=image)
		for item in background:
			await item.delete()
		if user.profile_image == image.id:
			user.profile_image = -1
			await user.update(_columns=["profile_image"])
		file_path = os.path.join(IMAGE_DIR, image.title)
		await image.delete()
		os.remove(file_path)
		return FunctionRespons(status=TypeRespons.OK)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def linc_bakground(user_id: int, image_id: int, type: TypeBackground)->FunctionRespons:
	try:
		user = await User.objects.get_or_none(id = user_id)
		image = await Image.objects.get_or_none(id = image_id)
		if not user:
			return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
		if not image:
			return FunctionRespons(status=TypeRespons.NOT_FOUND, detail="image not found")
		if image.user != user:
			return FunctionRespons(status=TypeRespons.ERROR, detail="the image belongs to another user.")
		otherBackground = await ImageBackground.objects.all(user=user, type=type)
		if otherBackground:
			for item in otherBackground:
				await item.delete()
		await ImageBackground.objects.create(user=user, image=image, type=type)
		logger.info(f"linc image background. user: {user_id}, image id: {image_id}")
		return FunctionRespons(status=TypeRespons.OK)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def get_bacground(user_id:int)->FunctionRespons:
	try:
		user = await User.objects.get_or_none(id = user_id)
		backgrounds = await ImageBackground.objects.all(user=user)
		return FunctionRespons(status=TypeRespons.OK, data=backgrounds)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))

async def set_profile_image(user_id:int, id_image:int)->FunctionRespons:
	try:
		if not await Image.objects.get_or_none(id = id_image):
			return FunctionRespons(status = TypeRespons.NOT_FOUND, detail="image not found")
		user = await User.objects.get_or_none(id = user_id)
		user.profile_image = id_image
		await user.update(_columns=["profile_image"])
		return FunctionRespons(status=TypeRespons.OK)
	except Exception as e:
		return FunctionRespons(status = TypeRespons.ERROR, detail=str(e))