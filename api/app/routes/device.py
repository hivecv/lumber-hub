from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from db.database import get_db
from modules import crud, schemas
from routes import app, user


@app.get("/devices/", response_model=list[schemas.Device])
async def get_devices(current_user: schemas.User = Depends(user.get_current_active_user)):
    return current_user.devices


@app.get("/devices/{device_id}/", response_model=schemas.Device, responses={404: {"model": schemas.ErrorMessage}})
async def get_device(device_id: int, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.id == device_id:
            return device

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )


@app.post("/devices/", response_model=schemas.Device, responses={403: {"model": schemas.ErrorMessage}})
def create_device(device: schemas.DeviceCreate, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    db_device = crud.get_device_by_uuid(db, uuid=device.device_uuid)
    if db_device:
        if db_device.id not in list(map(lambda item: item.id, current_user.devices)):
            return JSONResponse(
                status_code=403,
                content=jsonable_encoder(schemas.ErrorMessage(reason="Not allowed to modify specified device!"))
            )
        return crud.update_user_device(db, user_id=current_user.id, device=device)
    else:
        return crud.create_user_device(db=db, device=device, user_id=current_user.id)


@app.delete("/devices/{device_id}/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def delete_device(device_id: int, current_user: schemas.User = Depends(user.get_current_active_user), db=Depends(get_db)):
    if device_id not in list(map(lambda item: item.id, current_user.devices)):
        return JSONResponse(
            status_code=404,
            content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
        )
    crud.delete_user_device(db, user_id=current_user.id, device_id=device_id)
