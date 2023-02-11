from typing import Union

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str


class TokenForm(BaseModel):
    email: str
    password: str


class DeviceBase(BaseModel):
    config_schema: str


class DeviceCreate(DeviceBase):
    pass


class Device(DeviceBase):
    id: int
    owner_id: int
    config: Union[str, None] = None

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    devices: list[Device] = []

    class Config:
        orm_mode = True


class ValidationMessage(BaseModel):
    field: str
    error: str


class AuthorizationMessage(BaseModel):
    reason: str
