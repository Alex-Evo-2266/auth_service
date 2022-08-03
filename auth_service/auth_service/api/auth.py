from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Query
from fastapi.responses import JSONResponse
from typing import Optional, List
from auth_service.depends.auth import token_dep
from auth_service.logic.apps import auth_code, get_token
from auth_service.schemas.base import TokenData, TypeRespons

from auth_service.logic.auth import refresh_token as rtoken, login as Authorization, logout
from auth_service.schemas.auth import Login, RefrashToken, ResponseLogin, Token, TokenType, Tokens, TypeResponse, TypeGrant, AuthResponse, TokenResponse


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

@router.get("/logout")
async def give_token(auth_data: TokenData = Depends(token_dep), refresh_toket: Optional[str] = Cookie(None)):
	res = await logout(auth_data.user_id, refresh_toket)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/refresh", response_model=Token)
async def ref(refresh_toket: Optional[str] = Cookie(None)):
	res = await rtoken(refresh_toket)
	if(res.status == "ok"):
		p:Token = res.data["response"]
		p.expires_at = p.expires_at.strftime("%Y-%m-%dT%H:%M:%S")
		response = JSONResponse(status_code=200, content=p.dict())
		response.set_cookie(key="refresh_toket", value=res.data["refresh"], httponly=True)
		return response
	return JSONResponse(status_code=403, content={"message": res.detail})

@router.post("/refresh", response_model=Tokens)
async def ref(data: RefrashToken):
	res = await rtoken(data.refresh_toket)
	if(res.status == "ok"):
		tokens = Tokens(access=res.data["response"].token, expires_at=res.data["response"].expires_at, refresh=res.data["refresh"])
		return tokens
	return JSONResponse(status_code=403, content={"message": res.detail})

@router.get("/authorize", response_model=AuthResponse)
async def authorize(response_type:TypeResponse  = Query(TypeResponse.CODE), client_id:str = Query(...), redirect_uri:str = Query(...), scope:List[str] = Query(["user_style", "user_name", "user_email"]), state:str = Query(...), auth_data: TokenData = Depends(token_dep)):
	res = await auth_code(client_id, redirect_uri, scope, auth_data.user_id)
	if (res.status == TypeRespons.OK):
		return AuthResponse(code=res.data, state=state)
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/token", response_model=TokenResponse)
async def give_token(grant_type:TypeGrant, code:str, redirect_uri:str, client_id:str, client_secret:str):
	if (grant_type == TypeGrant.CODE):
		tokens = await get_token(code, client_id, client_secret)
		if tokens.status == TypeRespons.OK:
			return tokens.data
	return JSONResponse(status_code=400, content={"message": "grant_type invalid"})
