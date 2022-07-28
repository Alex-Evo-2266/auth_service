from pydantic import BaseModel

from auth_service.schemas.auth import TypeGrant, TypeResponse

class CreateApps(BaseModel):
    title: str
    default_redirect_uri: str

class CreateAppsRespons(BaseModel):
	client_secret: str
	client_id: str

class AppResponse(BaseModel):
    client_id: str
    grant_type: TypeGrant
    response_type: TypeResponse
    scopes: str
    default_scopes: str
    redirect_uris: str
    default_redirect_uri: str