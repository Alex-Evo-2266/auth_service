from turtle import title
from typing import List
from pydantic import BaseModel

from auth_service.schemas.image import TypeBackground

class Background(BaseModel):
	url: str
	type: TypeBackground
	title: str

class UserConfig(BaseModel):
	backgrounds: List[Background]