from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

SECRET_KEY = "52e8d5f45cd48873d7f52af628ec1bd10277f873b755306f69cab31c7bce1721"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token):
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    email: str = payload.get("sub")
    return email
