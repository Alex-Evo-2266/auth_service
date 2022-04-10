import ormar
from auth_service.dbormar import BaseMeta
import datetime
from typing import Type, TypeVar, List, Optional, Any
from .schemas.auth import TypeResponse, TypeGrant

# Create your models here.
class User(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    name: str = ormar.String(max_length=200, nullable=False)
    surname: str = ormar.String(max_length=200, nullable=True)
    password: str = ormar.String(max_length=200, nullable=False)
    email: str = ormar.String(max_length=200, nullable=False)
    level: int = ormar.Integer(default=1)
    Style: str = ormar.String(max_length=200, default="light")
    auteStyle: bool = ormar.Boolean(default=True)
    staticBackground: bool = ormar.Boolean(default=False)
    # page: str = ormar.String(max_length=200, default="basePage")

    def __str__(self):
        return self.UserName

# class ImageBackground(ormar.Model):
#     class Meta(BaseMeta):
#         pass
#
#     id: int = ormar.Integer(primary_key=True)
#     type: str = ormar.String(max_length=200, default="base")
#     title: str = ormar.String(max_length=200)
#     image: str = ormar.String(max_length=1000)
#     user: Optional[User] = ormar.ForeignKey(User, related_name="background")

class Client(ormar.Model):
    class Meta(BaseMeta):
        constraints = [ormar.UniqueColumns("client_id")]

    id: int = ormar.Integer(primary_key=True)
    client_id: str = ormar.String(max_length=100)
    user: Optional[User] = ormar.ForeignKey(User, related_name="client")
    grant_type: TypeGrant = ormar.String(max_length=18)
    response_type: TypeResponse = ormar.String(max_length=4)
    scopes: str = ormar.Text()
    default_scopes: str = ormar.Text()
    redirect_uris: str = ormar.Text()
    default_redirect_uri: str = ormar.Text()


class BearerToken(ormar.Model):
    class Meta(BaseMeta):
        constraints = [ormar.UniqueColumns("access_token", "refresh_token")]

    id: int = ormar.Integer(primary_key=True)
    client: Optional[Client] = ormar.ForeignKey(Client, related_name="ber_toker")
    user: Optional[User] = ormar.ForeignKey(User, related_name="ber_toker")
    scopes: str = ormar.Text()
    access_token: str = ormar.String(max_length=100)
    refresh_token: str = ormar.String(max_length=100)
    expires_at: datetime.datetime = ormar.DateTime()

class AuthCode(ormar.Model):
    class Meta(BaseMeta):
        constraints = [ormar.UniqueColumns("code")]

    id: int = ormar.Integer(primary_key=True)
    client: Optional[Client] = ormar.ForeignKey(Client, related_name="auth_code")
    user: Optional[User] = ormar.ForeignKey(User, related_name="auth_code")
    scopes: str = ormar.Text()
    redirect_uri: str = ormar.Text()
    code: str = ormar.String(max_length=100)
    expires_at: datetime.datetime = ormar.DateTime()
    challenge: str = ormar.String(max_length=128)
    challenge_method: str = ormar.String(max_length=6)
