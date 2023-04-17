from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import DeviceConfig
from modules import schemas
from routes import app, user


def create_config(db: Session, device_id: int, config: schemas.DeviceConfigBase):
    db_item = DeviceConfig(**config.dict(), device_id=device_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_config(db: Session, config_id: int, config: schemas.DeviceConfigBase):
    db_item = db.query(DeviceConfig).filter(DeviceConfig.id == config_id).first()
    device_data = config.dict(exclude_unset=True)
    for key, value in device_data.items():
        setattr(db_item, key, value)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_configs(db: Session, device_id: int):
    return db.query(DeviceConfig).filter(DeviceConfig.device_id == device_id).all()


@app.post("/devices/{device_uuid}/configs/", response_model=schemas.DeviceConfigResponse, responses={404: {"model": schemas.ErrorMessage}})
async def add_device_config(device_uuid: str, config: schemas.DeviceConfigCreate, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            db_config = create_config(db, device_id=device.id, config=config)
            return db_config

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device!"))
    )


@app.put("/devices/{device_uuid}/configs/{config_id}/", response_model=schemas.DeviceConfigResponse, responses={404: {"model": schemas.ErrorMessage}})
async def update_device_config(device_uuid: str, config_id: int, config: schemas.DeviceConfigUpdate, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            for db_config in device.config:
                if db_config.id == config_id:
                    db_config = update_config(db, config_id=db_config.id, config=config)
                    return db_config

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device or config!"))
    )


@app.get("/devices/{device_uuid}/configs/", response_model=list[schemas.DeviceConfigResponse], responses={404: {"model": schemas.ErrorMessage}})
async def fetch_device_configs(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return get_configs(db, device_id=device.id)

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
