import yaml
import os, sys

def writeYMLFile(path, data):
	with open(path, 'w') as f:
		yaml.dump(data, f, default_flow_style=False)

def readYMLFile(path):
	templates = dict()
	with open(path) as f:
		templates = yaml.safe_load(f)
	return templates

class Settings:

	def __init__(self, file:str, content:dict = dict()):
		self.__file = file
		writeYMLFile(self.__file, content)

	def set_config(self, content:dict):
		writeYMLFile(self.__file, content)

	def get_config(self)->dict:
		buf = readYMLFile(self.__file)
		return buf

	def patch_config(self, content:dict):
		buf = readYMLFile(self.__file)
		for key in content:
			if key in buf and content[key]:
				buf[key] = content[key]
		writeYMLFile(self.__file, buf)
