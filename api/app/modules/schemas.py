from datetime import datetime
from typing import Union, List, Any

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class LoginForm(BaseModel):
    email: str
    password: str


class DeviceBase(BaseModel):
    device_uuid: str


class DeviceCreate(DeviceBase):
    pass


class Device(DeviceBase):
    id: int
    owner_id: int
    last_active: datetime

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


class ErrorMessage(BaseModel):
    reason: str


class LogMessageBase(BaseModel):
    name: Union[str, None]
    msg: Union[str, None]
    args: Union[List[Any], None]
    levelname: Union[str, None]
    levelno: Union[int, None]
    pathname: Union[str, None]
    filename: Union[str, None]
    module: Union[str, None]
    exc_info: Union[str, None]
    exc_text: Union[str, None]
    stack_info: Union[str, None]
    lineno: Union[int, None]
    funcName: Union[str, None]
    created: Union[float, None]
    msecs: Union[float, None]
    relativeCreated: Union[float, None]
    thread: Union[int, None]
    threadName: Union[str, None]
    processName: Union[str, None]
    process: Union[int, None]

    class Config:
        orm_mode = True


class DeviceConfigBase(BaseModel):
    config_schema: dict
    config: Union[dict, None]
    modified: datetime


class DeviceConfigResponse(DeviceConfigBase):
    id: int


class DeviceAlertBase(BaseModel):
    device_id: int
    type: str
    msg: Union[str, None]


class DeviceAlertResponse(DeviceAlertBase):
    id: int
    created: datetime
