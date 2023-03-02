from datetime import datetime
from typing import Union

from fastapi import FastAPI, Depends
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, ExpiredSignatureError

import database
import crud
import schemas
from auth import create_access_token, decode_token

app = FastAPI()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    credentials_exception = JSONResponse(
        status_code=401,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not validate credentials"))
    )
    try:
        email = decode_token(token)
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except (JWTError, ExpiredSignatureError):
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    # if current_user.disabled:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


@app.post("/token/", response_model=schemas.Token, responses={401: {"model": schemas.ErrorMessage}})
async def login_for_access_token(data: schemas.TokenForm, db=Depends(get_db)):
    user = crud.authenticate_user(db, data.email, data.password)
    if not user:
        return JSONResponse(status_code=401, content=jsonable_encoder(schemas.ErrorMessage(reason="Incorrect username or password")))

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=schemas.User, responses={400: {"model": schemas.ValidationMessage}})
def create_user(user: schemas.UserCreate, db=Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="email", error="Email already registered!")))
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=list[schemas.User], responses={400: {"model": schemas.ValidationMessage}})
def read_users(skip: int = 0, limit: int = 100, db=Depends(get_db)):
    if limit < 1:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="limit", error="Limit must be greater than 0!")))
    if skip < 0:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="skip", error="Skip must be a positive integer!")))
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/devices/", response_model=list[schemas.Device], responses={400: {"model": schemas.ValidationMessage}})
def read_devices(skip: int = 0, limit: int = 100, db=Depends(get_db)):
    if limit < 1:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="limit", error="Limit must be greater than 0!")))
    if skip < 0:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="skip", error="Skip must be a positive integer!")))
    devices = crud.get_devices(db, skip=skip, limit=limit)
    return devices


@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user


@app.get("/users/me/devices/")
async def read_own_devices(current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    return crud.get_user_devices(db, user_id=current_user.id)


@app.post("/users/me/devices/", response_model=schemas.Device)
def create_device_for_user(device: schemas.DeviceCreate, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    db_device = crud.get_device_by_uuid(db, uuid=device.device_uuid)
    if db_device:
        return crud.update_user_device(db, user_id=current_user.id, device=device)
    else:
        return crud.create_user_device(db=db, device=device, user_id=current_user.id)


@app.get("/users/me/devices/{device_id}/", response_model=schemas.Device, responses={404: {"model": schemas.ErrorMessage}})
async def get_user_device(device_id: int, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    if device_id not in list(map(lambda item: item.id, current_user.devices)):
        return JSONResponse(
            status_code=404,
            content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
        )
    device = crud.get_user_device(db, user_id=current_user.id, device_id=device_id)
    return device

@app.put("/users/me/devices/{device_id}/", response_model=schemas.Device, responses={404: {"model": schemas.ErrorMessage}})
async def update_user_device(device_id: int, device: schemas.Device, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    if device_id not in list(map(lambda item: item.id, current_user.devices)):
        return JSONResponse(
            status_code=404,
            content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
        )
    device = crud.update_user_device(db, user_id=current_user.id, device=device)
    return device


@app.delete("/users/me/devices/{device_id}/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def update_user_device(device_id: int, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    if device_id not in list(map(lambda item: item.id, current_user.devices)):
        return JSONResponse(
            status_code=404,
            content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
        )
    crud.delete_user_device(db, user_id=current_user.id, device_id=device_id)


@app.patch("/users/me/devices/{device_uuid}/heartbeat/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def user_device_heartbeat(device_uuid: str, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            crud.update_user_device_heartbeat(db, user_id=current_user.id, device_id=device.id)
            return

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )


@app.post("/users/me/devices/{device_uuid}/logs/", status_code=204, responses={404: {"model": schemas.ErrorMessage}})
async def user_device_logs(device_uuid: str, message: schemas.LogMessage, current_user: schemas.User = Depends(get_current_active_user), db=Depends(get_db)):
    for device in current_user.devices:
        if device.device_uuid == device_uuid:
            crud.create_device_log(db, device_id=device.id, log=message)
            return

    return JSONResponse(
        status_code=404,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not find specified device"))
    )
