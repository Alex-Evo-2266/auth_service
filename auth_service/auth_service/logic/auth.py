import logging
import bcrypt
import jwt

from auth_service.schemas.auth import Login
from auth_service.models import Login

logger = logging.getLogger(__name__)

async def login(data: Login):
    try:
        logger.debug(f"login input data: {data.dict()}")
        u = await User.objects.get_or_none(UserName=data.name)

    except Exception as e:
        raise
