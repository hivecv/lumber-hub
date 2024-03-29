from sqlalchemy import Boolean, Column, ForeignKey, Integer, Float, String, JSON, ARRAY, DateTime, func, BigInteger
from sqlalchemy.orm import relationship
from db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    devices = relationship("Device", back_populates="owner")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    device_uuid = Column(String)
    last_active = Column(DateTime(timezone=True), default=func.now())
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="devices")
    logs = relationship("LogMessage", back_populates="device")
    config = relationship("DeviceConfig", back_populates="device")
    alerts = relationship("DeviceAlert", back_populates="device")


class LogMessage(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    name = Column(String, nullable=True)
    msg = Column(String, nullable=True)
    args = Column(ARRAY(String), nullable=True)
    levelname = Column(String, nullable=True)
    levelno = Column(Integer, nullable=True)
    pathname = Column(String, nullable=True)
    filename = Column(String, nullable=True)
    module = Column(String, nullable=True)
    exc_info = Column(String, nullable=True)
    exc_text = Column(String, nullable=True)
    stack_info = Column(String, nullable=True)
    lineno = Column(Integer, nullable=True)
    funcName = Column(String, nullable=True)
    created = Column(Float, nullable=True)
    msecs = Column(Float, nullable=True)
    relativeCreated = Column(Float, nullable=True)
    thread = Column(BigInteger, nullable=True)
    threadName = Column(String, nullable=True)
    processName = Column(String, nullable=True)
    process = Column(Integer, nullable=True)

    device = relationship("Device", back_populates="logs")


class DeviceConfig(Base):
    __tablename__ = "configs"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    config_schema = Column(JSON)
    config = Column(JSON, nullable=True)
    modified = Column(DateTime(timezone=True), default=func.now())

    device = relationship("Device", back_populates="config")


class DeviceAlert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    type = Column(String)
    msg = Column(String, nullable=True)
    created = Column(DateTime(timezone=True), default=func.now())

    device = relationship("Device", back_populates="alerts")
