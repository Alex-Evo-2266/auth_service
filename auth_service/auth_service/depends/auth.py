from auth_service.schemas.base import TokenData, TypeRespons
from fastapi import Header, HTTPException, Cookie
from typing import Optional

from auth_service.logic.auth import auth

async def token_dep(authorization_token: Optional[str] = Header(None))->TokenData:
    if not authorization_token:
        raise HTTPException(status_code=403, detail="token not found")
    token = authorization_token.split(" ")[1]
    auth_data = await auth(token)
    if auth_data.status == TypeRespons.INVALID and auth_data.detail.split(' ')[0] == "outdated_jwt":
        raise HTTPException(status_code=401, detail="outdated jwt")
    if auth_data.status == TypeRespons.ERROR:
        raise HTTPException(status_code=403, detail="invalid jwt")
    return auth_data.data
