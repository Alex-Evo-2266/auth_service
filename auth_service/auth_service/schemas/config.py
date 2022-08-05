
from pydantic import BaseModel

class ConfigSchema(BaseModel):
	email_login: str = ""
	email_password: str = ""
