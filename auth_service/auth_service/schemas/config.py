
from typing import List, Optional
from pydantic import BaseModel

class ConfigSchema(BaseModel):
	email_login: str = ""
	email_password: str = ""


class PatchConfigSchema(BaseModel):
	email_login: Optional[str]
	email_password: Optional[str]
