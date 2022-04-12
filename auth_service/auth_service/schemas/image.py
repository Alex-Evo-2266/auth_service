from enum import Enum
from pydantic import BaseModel

class TypeBackground(str, Enum):
	BASE = "BASE"
	MORNING = "MORNING"
	DAY = "DAY"
	EVENING = "EVENING"
	NIGHT = "NIGHT"