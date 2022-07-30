import datetime
from pydantic import BaseModel
from enum import Enum

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
    userId: int
    userLevel: int

class Tokens(BaseModel):
    access: str
    refresh: str

class Token(BaseModel):
    token: str

class ResponseCode(BaseModel):
    client_id: str
    scopes: str
    redirect_uri: str
    code: str
    expires_at: datetime.datetime

class TokenResponse(BaseModel):
    access_token: str
    expires_in: int
    token_type: TokenType = TokenType.BEARER_TOKEN
    refresh_token: str
    scope: str