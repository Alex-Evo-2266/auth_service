
from typing import List
from pydantic import BaseModel
from pydantic.color import Color

class ColorForm(BaseModel):
	title: str
	color1: Color
	color2: Color
	active: Color

class ColorOut(BaseModel):
	id: int
	title: str
	color1: Color
	color2: Color
	active: Color