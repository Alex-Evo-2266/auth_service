from fastapi import APIRouter, Depends, HTTPException, Response, Cookie, Query, Header
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from auth_service.depends.auth import token_dep
from auth_service.logic.apps import auth_code, get_token
from auth_service.schemas.base import TokenData, TypeRespons

from auth_service.logic.auth import auth, refresh_token as rtoken, login as Authorization, logout, get_sessions, delete_sessions
from auth_service.schemas.auth import Login, LogoutTokenSchema, SessionSchema, RefrashToken, ResponseLogin, Token, TokenType, Tokens, TypeResponse, TypeGrant, AuthResponse, TokenResponse


router = APIRouter(
	prefix="/api/auth",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
	)

@router.post("/login", response_model=ResponseLogin)
async def login(host:Optional[str] = Header(None), sec_ch_ua_platform: Union[str, None] = Header(default=None), response:Response = Response("ok", 200), data: Login = Login(name="",password="")):
	try:
		res = await Authorization(data, sec_ch_ua_platform, host)
		if(res.status == "ok"):
			response.set_cookie(key="auth_service", value=res.data["refresh"], httponly=True)
			return res.data["response"]
		return JSONResponse(status_code=403, content={"message": res.detail})
	except Exception as e:
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/logout")
async def give_token(auth_data: TokenData = Depends(token_dep), auth_service: Optional[str] = Cookie(None)):
	res = await logout(auth_data.user_id, auth_service)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.post("/logout")
async def give_token(token: LogoutTokenSchema, auth_data: TokenData = Depends(token_dep)):
	res = await logout(auth_data.user_id, token.refresh_token)
	if res.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/refresh", response_model=Token)
async def ref(auth_service: Optional[str] = Cookie(None)):
	res = await rtoken(auth_service)
	if(res.status == "ok"):
		p:Token = res.data["response"]
		p.expires_at = p.expires_at.strftime("%Y-%m-%dT%H:%M:%S")
		response = JSONResponse(status_code=200, content=p.dict())
		response.set_cookie(key="auth_service", value=res.data["refresh"], httponly=True)
		return response
	return JSONResponse(status_code=403, content={"message": res.detail})

@router.post("/refresh", response_model=Tokens)
async def ref(data: RefrashToken):
	res = await rtoken(data.refresh_token)
	if(res.status == "ok"):
		tokens = Tokens(access=res.data["response"].token, expires_at=res.data["response"].expires_at, refresh=res.data["refresh"])
		return tokens
	return JSONResponse(status_code=403, content={"message": res.detail})

@router.get("/authorize", response_model=AuthResponse)
async def authorize(response_type:TypeResponse  = Query(TypeResponse.CODE), client_id:str = Query(...), redirect_uri:str = Query(...), scope:List[str] = Query(["user_style", "user_name", "user_email"]), state:str = Query(...), auth_data: TokenData = Depends(token_dep)):
	res = await auth_code(client_id, redirect_uri, scope, auth_data.user_id)
	code = res.data["code"]
	user = res.data["user_name"]
	if (res.status == TypeRespons.OK):
		return AuthResponse(code=code, state=state, user_name=user)
	return JSONResponse(status_code=400, content={"message": res.detail})

@router.get("/token", response_model=TokenResponse)
async def give_token(host:Optional[str] = Header(None), sec_ch_ua_platform: Union[str, None] = Header(default=None), grant_type:TypeGrant = Query(TypeGrant.CODE), code:str = Query(...), redirect_uri:str = Query(...), client_id:str = Query(...), client_secret:str = Query(...)):
	if (grant_type == TypeGrant.CODE):
		print(host, sec_ch_ua_platform)
		tokens = await get_token(code, client_id, client_secret, sec_ch_ua_platform, host)
		if tokens.status == TypeRespons.OK:
			return tokens.data
		return JSONResponse(status_code=400, content={"message": tokens.detail})	
	return JSONResponse(status_code=400, content={"message": "grant_type invalid"})

@router.get("/session", response_model=List[SessionSchema])
async def give_session(auth_data: TokenData = Depends(token_dep)):
	sessions = await get_sessions(auth_data.user_id)
	if sessions.status == TypeRespons.OK:
		return sessions.data
	return JSONResponse(status_code=400, content={"message": sessions.detail})	

@router.delete("/session/{id}")
async def give_session(id:int, auth_data: TokenData = Depends(token_dep)):
	sessions = await delete_sessions(id, auth_data.user_id)
	if sessions.status == TypeRespons.OK:
		return "ok"
	return JSONResponse(status_code=400, content={"message": sessions.detail})	