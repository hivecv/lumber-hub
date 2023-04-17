from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import Device
from modules import schemas
from routes import app, user


def get_device_by_id(db: Session, device_id: int):
    return db.query(Device).filter(Device.id == device_id).first()


def get_device_by_uuid(db: Session, uuid: str):
    return db.query(Device).filter(Device.device_uuid == uuid).first()


def update_device(db: Session, device_id: int, device: schemas.Device):
    db_device = get_device_by_id(db, device_id)
    device_data = device.dict(exclude_unset=True)
    for key, value in device_data.items():
        setattr(db_device, key, value)
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device


def delete_user_device(db: Session, device_id: int):
    db_device = get_device_by_id(db, device_id)
    db.delete(db_device)
    db.commit()


def create_user_device(db: Session, device: schemas.DeviceCreate, user_id: int):
    db_item = Device(**device.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@app.get("/devices/", response_model=list[schemas.Device])
async def get_devices(current_user: schemas.User = Depends(user.get_current_active_user)):
    return current_user.devices


@app.get("/devices/{device_uuid}/", response_model=schemas.Device, responses={404: {"model": schemas.ErrorMessage}})
async def get_device(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return device

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )


@app.post("/devices/", response_model=schemas.Device, responses={403: {"model": schemas.ErrorMessage}})
async def create_device(device: schemas.DeviceCreate, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    db_device = get_device_by_uuid(db, uuid=device.device_uuid)
    if db_device:
        if db_device.id not in list(map(lambda item: item.id, current_user.devices)):
            return JSONResponse(
                status_code=403,
                content=jsonable_encoder(schemas.ErrorMessage(reason="Not allowed to modify specified device!"))
            )
        return update_device(db, device_id=db_device.id, device=device)
    else:
        return create_user_device(db=db, device=device, user_id=current_user.id)


@app.delete("/devices/{device_uuid}/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def delete_device(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return delete_user_device(db, device_id=device.id)

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )

