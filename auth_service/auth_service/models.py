import ormar
from SmartHome.dbormar import BaseMeta
from typing import Optional, List

# Create your models here.
class User(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    UserName: str = ormar.String(max_length=200, nullable=False)
    UserSurname: str = ormar.String(max_length=200, nullable=True)
    UserPassword: str = ormar.String(max_length=200, nullable=False)
    UserEmail: str = ormar.String(max_length=200, nullable=False)
    UserLevel: int = ormar.Integer(default=1)
    Style: str = ormar.String(max_length=200, default="light")
    auteStyle: bool = ormar.Boolean(default=True)
    staticBackground: bool = ormar.Boolean(default=False)
    # page: str = ormar.String(max_length=200, default="basePage")

    def __str__(self):
        return self.UserName

class ImageBackground(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    type: str = ormar.String(max_length=200, default="base")
    title: str = ormar.String(max_length=200)
    image: str = ormar.String(max_length=1000)
    user: Optional[User] = ormar.ForeignKey(User, related_name="background")