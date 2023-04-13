from datetime import datetime

from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from db.database import get_db
from modules import crud, schemas
from routes import app, user


def update_user_device_heartbeat(db: Session, user_id: int, device_id: int):
    db_device = crud.get_user_device(db, user_id, device_id)
    db_device.last_active = datetime.utcnow()
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device


@app.patch("/devices/{device_uuid}/heartbeat/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def user_device_heartbeat(device_uuid: str, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            update_user_device_heartbeat(db, user_id=current_user.id, device_id=device.id)
            return

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
