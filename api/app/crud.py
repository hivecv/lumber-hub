from sqlalchemy.orm import Session

import models
import schemas
from auth import verify_password, get_password_hash


def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_devices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Device).offset(skip).limit(limit).all()


def get_user_devices(db: Session, user_id: int):
    return db.query(models.Device).filter(models.Device.owner_id == user_id).all()


def create_user_device(db: Session, device: schemas.DeviceCreate, user_id: int):
    db_item = models.Device(**device.dict(), owner_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
