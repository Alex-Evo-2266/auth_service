from auth_service.models import User
from auth_service.settings import MEDIA_ROOT, IMAGE_DIR
import logging
import bcrypt
import os

logger = logging.getLogger(__name__)

async def initdir():
    if not os.path.exists(MEDIA_ROOT):
        os.mkdir(MEDIA_ROOT)
    if not os.path.exists(IMAGE_DIR):
        os.mkdir(IMAGE_DIR)

async def initAdmin():
    await initdir()
    users = await User.objects.all()
    if len(users) == 0:
        await addAdmin()

async def addAdmin():
    try:
        logger.debug(f"add admin")
        hashedPass = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt())
        newUser = await User.objects.create(name="admin", email="",password=hashedPass, level=3, profile_image=-1)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f"error add user: {e}")
        return {'status': 'error', 'detail': e}