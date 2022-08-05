import datetime
from pydantic import BaseModel
from typing import List
from enum import Enum

class UserLevel(int, Enum):
	ADMIN = 3,
	MID = 2,
	USER = 1,
	NONE = 0

class TypeGrant(str, Enum):
	CODE = "authorization_code"

class TypeResponse(str, Enum):
	CODE = "code"

class TokenType(str, Enum):
	BEARER_TOKEN = "bearertoken"

class AuthResponse(BaseModel):
	code: str
	state: str

class Login(BaseModel):
	name: str
	password: str

class ResponseLogin(BaseModel):
	token: str
	expires_at: datetime.datetime
	userId: int
	userLevel: int

class Tokens(BaseModel):
	expires_at: datetime.datetime
	access: str
	refresh: str

class RefrashToken(BaseModel):
	refresh_token: str

class Token(BaseModel):
	token: str
	expires_at: datetime.datetime

class ResponseCode(BaseModel):
	client_id: str
	scopes: List[str]
	redirect_uri: str
	code: str
	expires_at: datetime.datetime

class TokenResponse(BaseModel):
	access_token: str
	expires_at: datetime.datetime
	token_type: TokenType = TokenType.BEARER_TOKEN
	refresh_token: str
	scope: List[str]

class SessionSchema(BaseModel):
	id :int
	client_name: str
	entry_time: datetime.datetime = datetime.datetime.now()
	host: str
	platform: str