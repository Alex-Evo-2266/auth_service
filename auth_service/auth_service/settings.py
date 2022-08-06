import datetime
from pathlib import Path
import os, sys

from auth_service.utils.settings import Settings

try:
	from .settings_local import *
except Exception as e:
	from .settings_prod import *

DB_URL = "".join(["mysql+pymysql://",
	MYSQL_USER,":",
	MYSQL_PASSWORD,"@",
	MYSQL_HOST,":",MYSQL_PORT,"/",
	MYSQL_DATABASE])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 2
SECRET_JWT_KEY = "dxkhbg5hth56"
SECRET_AUTH_CODE_KEY = "dxkhbgdgfhjkljkh5hth56"
SECRET_REFRESH_JWT_KEY = "sz345657rytyk5yeytw433frthjyuvligukytrtyug5hth56"

BASE_DIR = Path(__file__).resolve().parent.parent

CONFIG_FILES_DIR = os.path.join(BASE_DIR, "files")
SERVER_CONFIG = os.path.join(CONFIG_FILES_DIR, "server-config.yml")

TIME_UPPDATA = 6
LENGTHPASS = 10

LENGTH_ID_APP = 32
LENGTH_PASS_APP = 10

MEDIA_URL = '/media/'
IMAGE_URL = os.path.join(MEDIA_URL, 'image')

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
IMAGE_DIR = os.path.join(MEDIA_ROOT, 'image')
HOST = "localhost:5000"

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

data = {
	"email_login":"",
	"email_password":""
}

# init dir

if not os.path.exists(MEDIA_ROOT):
	os.mkdir(MEDIA_ROOT)
if not os.path.exists(IMAGE_DIR):
	os.mkdir(IMAGE_DIR)
if not os.path.exists(CONFIG_FILES_DIR):
	os.mkdir(CONFIG_FILES_DIR)
if not os.path.exists(SERVER_CONFIG):
	file = open(SERVER_CONFIG, "w+")
	file.close()

config = Settings(SERVER_CONFIG, data)
