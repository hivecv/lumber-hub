from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import LogMessage
from modules import schemas
from routes import app, user


def create_device_log(db: Session, device_id: int, log: schemas.LogMessage):
    db_item = LogMessage(**log.dict(), device_id=device_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_device_logs(db: Session, device_id: int):
    return db.query(LogMessage).filter(LogMessage.device_id == device_id).all()


@app.post("/users/me/devices/{device_uuid}/logs/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def add_device_logs(device_uuid: str, message: schemas.LogMessage, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            create_device_log(db, device_id=device.id, log=message)
            return

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )


@app.get("/users/me/devices/{device_uuid}/logs/", response_model=list[schemas.LogMessage], responses={404: {"model": schemas.ErrorMessage}})
async def fetch_device_logs(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return get_device_logs(db, device_id=device.id)

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
