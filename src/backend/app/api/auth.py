from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas import UserCreate, UserLogin

router = APIRouter()

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    
    new_user = User(
        email=user.email,
        hashed_password=user.password 
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Registrasi berhasil!", 
        "user_id": new_user.id,
        "email": new_user.email
    }

@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Email tidak terdaftar!")
        
    if user.hashed_password != user_credentials.password:
        raise HTTPException(status_code=401, detail="Email/Password salah!")
        
    return {
        "message": "Login berhasil!", 
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }