import os

async def initdir():
    if not os.path.exists(MEDIA_ROOT):
        os.mkdir(MEDIA_ROOT)
    if not os.path.exists(IMAGE_DIR):
        os.mkdir(IMAGE_DIR)
    if not os.path.exists(CONFIG_FILES_DIR):
        os.mkdir(CONFIG_FILES_DIR)
    if not os.path.exists(SERVER_CONFIG):
        file = open(SERVER_CONFIG, "w+")
        file.close()