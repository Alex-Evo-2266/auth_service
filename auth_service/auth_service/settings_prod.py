import os

MYSQL_USER = os.environ.get("AUTH_SERVICE_BD_USER")
MYSQL_PASSWORD = os.environ.get("AUTH_SERVICE_BD_PASSWORD")
MYSQL_DATABASE = os.environ.get("AUTH_SERVICE_BD_NAME")
MYSQL_HOST = os.environ.get("AUTH_SERVICE_BD_HOST")
MYSQL_PORT = os.environ.get("AUTH_SERVICE_BD_PORT")

DEBUG = False
