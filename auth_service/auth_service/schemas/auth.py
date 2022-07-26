from pydantic import BaseModel
from enum import Enum

class TypeGrant(str, Enum):
    CODE = "authorization_code"

class TypeResponse(str, Enum):
    CODE = "code"

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
