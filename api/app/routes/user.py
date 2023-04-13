from fastapi import Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from jose import JWTError, ExpiredSignatureError
from sqlalchemy.orm import Session

from db.database import get_db
from db.models import User
from modules import schemas, auth
from routes import app
from modules.auth import verify_password, get_password_hash


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


async def get_current_user(token: str = Depends(auth.oauth2_scheme), db=Depends(get_db)):
    credentials_exception = JSONResponse(
        status_code=401,
        content=jsonable_encoder(schemas.ErrorMessage(reason="Could not validate credentials"))
    )
    try:
        email = auth.decode_token(token)
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except (JWTError, ExpiredSignatureError):
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    # if current_user.disabled:
    #     raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/token/", response_model=schemas.Token, responses={401: {"model": schemas.ErrorMessage}})
async def login(data: schemas.TokenForm, db=Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)
    if not user:
        return JSONResponse(status_code=401, content=jsonable_encoder(schemas.ErrorMessage(reason="Incorrect username or password")))

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=schemas.User, responses={400: {"model": schemas.ValidationMessage}})
def new_user(user: schemas.UserCreate, db=Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        return JSONResponse(status_code=400, content=jsonable_encoder(schemas.ValidationMessage(field="email", error="Email already registered!")))
    return create_user(db=db, user=user)


@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user
