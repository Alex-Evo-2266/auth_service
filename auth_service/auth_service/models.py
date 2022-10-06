import ormar
from auth_service.dbormar import BaseMeta
import datetime
from typing import Type, TypeVar, List, Optional, Any

from auth_service.schemas.image import TypeBackground
from .schemas.auth import TypeResponse, TypeGrant, UserLevel
from pydantic.color import Color

# class Role(ormar.Model):
# 	class Meta(BaseMeta):
# 		constraints = [ormar.UniqueColumns("title")]

# 	id: int = ormar.Integer(primary_key=True)
# 	title: str = ormar.String(max_length=50)


class User(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("name")]


	id: int = ormar.Integer(primary_key=True)
	name: str = ormar.String(max_length=200, nullable=False)
	surname: str = ormar.String(max_length=200, nullable=True)
	password: str = ormar.String(max_length=200, nullable=False)
	email: str = ormar.String(max_length=200, nullable=False)
	level: UserLevel = ormar.Integer(default=1)
	profile_image: int = ormar.Integer(default=-1)
	color: int = ormar.Integer(default=-1)
	nightColor: int = ormar.Integer(default=-1)
	specialColor: int = ormar.Integer(default=-1)
	specialTopic: bool = ormar.Boolean(default=False)
	# role: Optional[Role] = ormar.ForeignKey(Role, related_name="role")

	def __str__(self):
		return self.name

class Client(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("client_id")]

	id: int = ormar.Integer(primary_key=True)
	title: str = ormar.String(max_length=100)
	client_id: str = ormar.String(max_length=100)
	user: Optional[User] = ormar.ForeignKey(User, related_name="client")
	grant_type: TypeGrant = ormar.String(max_length=18)
	response_type: TypeResponse = ormar.String(max_length=4)
	scopes: str = ormar.Text()
	default_scopes: str = ormar.Text()
	redirect_uris: str = ormar.Text()
	default_redirect_uri: str = ormar.Text()
	client_secret: str = ormar.String(max_length=100)


class BearerToken(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("access_token", "refresh_token")]

	id: int = ormar.Integer(primary_key=True)
	client: Optional[Client] = ormar.ForeignKey(Client, related_name="ber_toker", nullable=True)
	user: Optional[User] = ormar.ForeignKey(User, related_name="ber_toker")
	scopes: str = ormar.Text()
	access_token: str = ormar.Text(max_length=500)
	refresh_token: str = ormar.Text(max_length=500)
	expires_at: datetime.datetime = ormar.DateTime()
	host: str = ormar.String(max_length=100, default="")
	platform: str = ormar.String(max_length=100, default="")
	entry_time: datetime.datetime = ormar.DateTime()

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

class Image(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True)
	title: str = ormar.String(max_length=200)
	url: str = ormar.String(max_length=200)
	user: User = ormar.ForeignKey(User, related_name="images")

class ImageBackground(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True)
	type: TypeBackground = ormar.String(max_length=10, default="base")
	image: Image = ormar.ForeignKey(Image, related_name="background")
	user: User = ormar.ForeignKey(User, related_name="background")

class InterfaceColor(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True)
	user: User = ormar.ForeignKey(User, related_name="colors")
	title: str = ormar.String(max_length=100)
	color1: str = ormar.String(max_length=50)
	color2: str = ormar.String(max_length=50)
	active: str = ormar.String(max_length=50)
