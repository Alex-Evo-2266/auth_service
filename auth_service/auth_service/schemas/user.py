from pydantic import BaseModel
from typing import Optional, List

class UserForm(BaseModel):
    name: str
    password: str
    email: str

class UserSchema(BaseModel):
    id: int
    name: str
    surname: Optional[str]
    email: Optional[str]
    level: int
    imageURL: Optional[str]

class UserEditSchema(BaseModel):
    name: str
    surname: Optional[str]
    email: Optional[str]
    imageId: Optional[int]

class UserNameSchema(BaseModel):
    name: str

class UserEditLevelSchema(BaseModel):
    id: int
    level: int

class UserEditPasswordSchema(BaseModel):
    Old: str
    New: str
    