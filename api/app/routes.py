from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
import database
import crud
import schemas

app = FastAPI()
# Dependency


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


@app.post("/users/{user_id}/devices/", response_model=schemas.Device)
def create_device_for_user(user_id: int, device: schemas.DeviceCreate, db=Depends(get_db)):
    return crud.create_user_device(db=db, device=device, user_id=user_id)


@app.get("/devices/", response_model=list[schemas.Device], responses={400: {"model": schemas.ValidationMessage}})
def read_devices(skip: int = 0, limit: int = 100, db=Depends(get_db)):
    if limit < 1:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="limit", error="Limit must be greater than 0!")))
    if skip < 0:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="skip", error="Skip must be a positive integer!")))
    devices = crud.get_devices(db, skip=skip, limit=limit)
    return devices
