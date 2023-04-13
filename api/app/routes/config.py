from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import DeviceConfig
from modules import schemas
from routes import app, user


def create_device_config(db: Session, device_id: int, config: schemas.DeviceConfigBase):
    db_item = DeviceConfig(**config.dict(), device_id=device_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_device_configs(db: Session, device_id: int):
    return db.query(DeviceConfig).filter(DeviceConfig.device_id == device_id).all()


@app.post("/users/me/devices/{device_uuid}/configs/", response_model=schemas.DeviceConfigResponse, responses={404: {"model": schemas.ErrorMessage}})
async def add_device_config(device_uuid: str, config: schemas.DeviceConfigBase, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            db_config = create_device_config(db, device_id=device.id, config=config)
            return db_config

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device!"))
    )


@app.get("/users/me/devices/{device_uuid}/configs/", response_model=list[schemas.DeviceConfigResponse], responses={404: {"model": schemas.ErrorMessage}})
async def fetch_device_configs(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return get_device_configs(db, device_id=device.id)

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
