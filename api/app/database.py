import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://{}:{}@{}:5432/{}".format(
    os.getenv('POSTGRES_USER', 'lumber'), os.getenv('POSTGRES_PASSWORD', 'lumber'),
    "db" if os.getenv('PROD', False) in ("1", "true") else "0.0.0.0", os.getenv('POSTGRES_DB', 'lumber')
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
