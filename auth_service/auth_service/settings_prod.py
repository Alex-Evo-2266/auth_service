import os

MYSQL_USER = os.environ.get("AUTH_SERVICE_BD_USER")
MYSQL_PASSWORD = os.environ.get("AUTH_SERVICE_BD_PASSWORD")
MYSQL_DATABASE = os.environ.get("AUTH_SERVICE_BD_NAME")
MYSQL_HOST = os.environ.get("AUTH_SERVICE_BD_HOST")
MYSQL_PORT = os.environ.get("AUTH_SERVICE_BD_PORT")

DEBUG = False

register_user_str = os.environ.get("REGISTER_USER")

REGISTER_USER = register_user_str.lower() in ['true', '1', 'y', 'yes']

print(REGISTER_USER)

ORIGINS = ["localhost",'127.0.0.1', "178.207.154.253"]