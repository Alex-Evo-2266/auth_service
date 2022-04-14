from fastapi.staticfiles import StaticFiles
from fastapi import FastAPI

import logging

from auth_service.dbormar import metadata, database, engine
from auth_service.api.auth import router as router_auth
from auth_service.api.image import router as router_image
from auth_service.api.user import router as router_user
from auth_service.api.user_config import router as router_config
from auth_service.settings import MEDIA_ROOT, MEDIA_URL, DEBUG, ORIGINS

logger = logging.getLogger(__name__)

app = FastAPI()

if DEBUG:
    app.mount("/media", StaticFiles(directory=MEDIA_ROOT), name="media")
# else:
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=ORIGINS,
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

app.state.database = database

@app.on_event("startup")
async def startup() -> None:
    database_ = app.state.database
    if not database_.is_connected:
        await database_.connect()
    logger.info("starting")

@app.on_event("shutdown")
async def shutdown() -> None:
    database_ = app.state.database
    if database_.is_connected:
        await database_.disconnect()

app.include_router(router_auth)
app.include_router(router_image)
app.include_router(router_user)
app.include_router(router_config)
