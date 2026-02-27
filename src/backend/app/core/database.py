from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Membaca file .env
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Membuat mesin koneksi
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Membuat sesi komunikasi dengan database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model yang akan diwarisi oleh semua file di folder 'models'
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()