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

class UserDeleteSchema(BaseModel):
    id: int

class UserNameSchema(BaseModel):
    name: str

class UserEditLevelSchema(BaseModel):
    id: int
    level: int

class UserEditPasswordSchema(BaseModel):
    Old: str
    New: str

class ImageBackgroundSchema(BaseModel):
    id: int
    type: str
    title: str
    image: str

class MenuElementsSchema(BaseModel):
    id: Optional[int]
    title:str
    iconClass:str
    url:str

class UserConfigSchema(BaseModel):
    Style: str
    auteStyle: bool
    staticBackground: bool
    images: Optional[List[ImageBackgroundSchema]]
    page: str
    MenuElements: Optional[List[MenuElementsSchema]]

class EditUserConfigSchema(BaseModel):
    style: str
    auteStyle: bool
    staticBackground: bool

class Message(BaseModel):
    message: str
