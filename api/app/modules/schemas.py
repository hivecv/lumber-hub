from datetime import datetime
from typing import List, Any, Optional
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


class DeviceConfigBase(BaseModel):
    modified: Optional[datetime]

    class Config:
        orm_mode = True


class DeviceConfigCreate(DeviceConfigBase):
    config_schema: dict


class DeviceConfigUpdate(DeviceConfigBase):
    config: dict


class DeviceConfigResponse(DeviceConfigBase):
    id: int
    config: Optional[dict]
    config_schema: dict


class DeviceAlertBase(BaseModel):
    device_id: int
    type: str
    msg: Optional[str]

    class Config:
        orm_mode = True


class DeviceAlertResponse(DeviceAlertBase):
    id: int
    created: datetime


class Device(DeviceBase):
    id: int
    owner_id: int
    last_active: datetime
    config: list[DeviceConfigResponse] = []

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
    name: Optional[str]
    msg: Optional[str]
    args: Optional[List[Any]]
    levelname: Optional[str]
    levelno: Optional[int]
    pathname: Optional[str]
    filename: Optional[str]
    module: Optional[str]
    exc_info: Optional[str]
    exc_text: Optional[str]
    stack_info: Optional[str]
    lineno: Optional[int]
    funcName: Optional[str]
    created: Optional[float]
    msecs: Optional[float]
    relativeCreated: Optional[float]
    thread: Optional[int]
    threadName: Optional[str]
    processName: Optional[str]
    process: Optional[int]

    class Config:
        orm_mode = True