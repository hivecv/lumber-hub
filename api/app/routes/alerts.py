from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import DeviceAlert
from modules import schemas
from routes import app, user


def create_device_alert(db: Session, device_id: int, alert: schemas.DeviceAlertBase):
    db_item = DeviceAlert(**alert.dict(), device_id=device_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_device_alerts(db: Session, device_id: int):
    return db.query(DeviceAlert).filter(DeviceAlert.device_id == device_id).all()


@app.post("/devices/{device_uuid}/alerts/", response_model=schemas.DeviceAlertResponse, responses={404: {"model": schemas.ErrorMessage}})
async def add_device_alert(device_uuid: str, alert: schemas.DeviceAlertBase, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            db_alert = create_device_alert(db, device_id=device.id, alert=alert)
            return db_alert

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device!"))
    )


@app.get("/devices/{device_uuid}/alerts/", response_model=list[schemas.DeviceAlertResponse], responses={404: {"model": schemas.ErrorMessage}})
async def fetch_device_alerts(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            return get_device_alerts(db, device_id=device.id)

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
