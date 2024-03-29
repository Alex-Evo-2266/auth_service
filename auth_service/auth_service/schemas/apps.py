from typing import Optional
from pydantic import BaseModel

from auth_service.schemas.auth import TypeGrant, TypeResponse

class CreateApps(BaseModel):
    title: str
    default_redirect_uri: str

class CreateAppsRespons(BaseModel):
	client_secret: str
	client_id: str

class AppData(BaseModel):
    title: str
    client_id: str
    grant_type: TypeGrant
    response_type: TypeResponse
    scopes: str
    default_scopes: str
    redirect_uris: str
    default_redirect_uri: str

class AppEditData(BaseModel):
    title: Optional[str]
    grant_type: Optional[TypeGrant]
    response_type: Optional[TypeResponse]
    scopes: Optional[str]
    default_scopes: Optional[str]
    redirect_uris: Optional[str]
    default_redirect_uri: Optional[str]

class AppFullData(AppData):
	client_secret: str