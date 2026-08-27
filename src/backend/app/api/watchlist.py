from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.watchlist import Watchlist
from app.api.feed import format_movie, format_tv
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class WatchlistToggle(BaseModel):
    user_id: int
    movie_id: Optional[int] = None
    tv_show_id: Optional[int] = None

@router.post("/toggle")
def toggle_watchlist(item: WatchlistToggle, db: Session = Depends(get_db)):
    query = db.query(Watchlist).filter(Watchlist.user_id == item.user_id)
    
    if item.movie_id:
        query = query.filter(Watchlist.movie_id == item.movie_id)
    elif item.tv_show_id:
        query = query.filter(Watchlist.tv_show_id == item.tv_show_id)
        
    existing = query.first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed", "message": "Dihapus dari My List"}
    else:
        new_item = Watchlist(
            user_id=item.user_id,
            movie_id=item.movie_id,
            tv_show_id=item.tv_show_id
        )
        db.add(new_item)
        db.commit()
        return {"status": "added", "message": "Ditambahkan ke My List"}

@router.get("/{user_id}")
def get_user_watchlist(user_id: int, db: Session = Depends(get_db)):
    saved_items = db.query(Watchlist).filter(Watchlist.user_id == user_id).all()
    
    results = []
    for item in saved_items:
        if item.movie:
            results.append(format_movie(item.movie))
        elif item.tv_show:
            results.append(format_tv(item.tv_show))
            
    return results
