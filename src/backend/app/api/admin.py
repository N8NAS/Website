from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class SetRoleRequest(BaseModel):
    requester_id: int
    target_user_id: int
    new_role: str

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "role": getattr(u, 'role', 'user')} for u in users]

@router.post("/set-role")
def set_user_role(req: SetRoleRequest, db: Session = Depends(get_db)):
    requester = db.query(User).filter(User.id == req.requester_id).first()
    if not requester or getattr(requester, 'role', 'user') != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak! Hanya Admin Utama yang bisa mengubah role.")
    
    target_user = db.query(User).filter(User.id == req.target_user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan!")
    
    if getattr(target_user, 'role', 'user') == "admin":
        raise HTTPException(status_code=400, detail="Tidak bisa mengubah role Admin Utama!")

    if req.new_role not in ["user", "co-admin"]:
        raise HTTPException(status_code=400, detail="Role tidak valid!")

    target_user.role = req.new_role
    db.commit()

    return {"message": f"Role untuk {target_user.email} berhasil diubah menjadi {req.new_role}!"}
