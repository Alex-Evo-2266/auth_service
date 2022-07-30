from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional
from auth_service.depends.auth import token_dep
from auth_service.logic.apps import auth_code
from auth_service.schemas.base import TokenData, TypeRespons

from auth_service.logic.auth import refresh_token as rtoken, login as Authorization
from auth_service.schemas.auth import Login, ResponseLogin, Token, TokenType, TypeResponse, TypeGrant, AuthResponse, TokenResponse


router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
    )

@router.post("/login", response_model=ResponseLogin)
async def login(response: Response, data: Login):
    try:
        res = await Authorization(data)
        if(res.status == "ok"):
            response.set_cookie(key="refresh_toket", value=res.data["refresh"], httponly=True)
            return res.data["response"]
        return JSONResponse(status_code=403, content={"message": res.detail})
    except Exception as e:
        return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/refresh", response_model=Token)
async def ref(refresh_toket: Optional[str] = Cookie(None)):
    res = await rtoken(refresh_toket)
    if(res.status == "ok"):
        p = res.data["response"]
        response = JSONResponse(status_code=200, content=p)
        response.set_cookie(key="refresh_toket", value=res.data["refresh"], httponly=True)
        return response
    return JSONResponse(status_code=403, content={"message": res.detail})

@router.get("/authorize", response_model=AuthResponse)
async def authorize(response_type:TypeResponse, client_id:str, redirect_uri:str, scope:str, state:str, auth_data: TokenData = Depends(token_dep)):
    res = await auth_code(client_id, redirect_uri, scope, auth_data.user_id)
    if (res.status == TypeRespons.OK):
        return AuthResponse(code=res.data, state=state)
    return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/token", response_model=TokenResponse)
async def give_token(grant_type:TypeGrant, code:str, redirect_uri:str, client_id:str, client_secret:str):
    return TokenResponse(access_token="test_code", expires_in=7000, token_type=TokenType.BEARER_TOKEN)
