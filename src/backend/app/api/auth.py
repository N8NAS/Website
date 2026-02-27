from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas import UserCreate

router = APIRouter()

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Cek apakah email sudah terdaftar di MySQL
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    
    # 2. Buat objek User baru (Untuk saat ini password kita simpan plain-text dulu)
    new_user = User(
        email=user.email,
        hashed_password=user.password 
    )
    
    # 3. Simpan permanen ke MySQL
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 4. Kembalikan respons sukses ke Frontend
    return {
        "message": "Registrasi berhasil!", 
        "user_id": new_user.id,
        "email": new_user.email
    }