from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.core.database import get_db
from app.models.watch_history import WatchHistory
from app.models.movies import Movie
from app.models.tv_shows import TVShow, Episode
from app.models.user import User

router = APIRouter()

class ProgressRequest(BaseModel):
    movie_id: Optional[int] = None
    tv_show_id: Optional[int] = None
    episode_id: Optional[int] = None
    progress_seconds: int = 0
    total_seconds: int = 0
    user_id: Optional[int] = 1

@router.post("/progress")
def save_watch_progress(req: ProgressRequest, db: Session = Depends(get_db)):
    if not req.movie_id and not (req.tv_show_id and req.episode_id):
        return {"error": "Harus menyertakan movie_id atau (tv_show_id + episode_id)"}

    existing = None
    if req.movie_id:
        existing = db.query(WatchHistory).filter(
            WatchHistory.user_id == req.user_id,
            WatchHistory.movie_id == req.movie_id
        ).first()
    elif req.tv_show_id and req.episode_id:
        existing = db.query(WatchHistory).filter(
            WatchHistory.user_id == req.user_id,
            WatchHistory.tv_show_id == req.tv_show_id,
            WatchHistory.episode_id == req.episode_id
        ).first()

    if existing:
        existing.progress_seconds = req.progress_seconds
        existing.total_seconds = req.total_seconds
        existing.last_watched_at = datetime.utcnow()
    else:
        new_history = WatchHistory(
            user_id=req.user_id,
            movie_id=req.movie_id,
            tv_show_id=req.tv_show_id,
            episode_id=req.episode_id,
            progress_seconds=req.progress_seconds,
            total_seconds=req.total_seconds,
            last_watched_at=datetime.utcnow()
        )
        db.add(new_history)

    db.commit()
    return {"message": "Berhasil menyimpan progres nonton"}

@router.get("/continue-watching")
def get_continue_watching(user_id: int = 1, db: Session = Depends(get_db)):
    histories = db.query(WatchHistory).filter(WatchHistory.user_id == user_id).order_by(WatchHistory.last_watched_at.desc()).all()
    
    results = []
    for h in histories:
        if h.progress_seconds < 3 or h.total_seconds <= 0:
            continue
            
        percent = (h.progress_seconds / h.total_seconds) * 100
        if percent >= 95:
            continue

        if h.movie_id:
            movie = db.query(Movie).filter(Movie.id == h.movie_id).first()
            if movie:
                results.append({
                    "id": movie.id,
                    "movie_id": movie.id,
                    "title": movie.title,
                    "description": movie.description,
                    "release_year": movie.release_year,
                    "rating": movie.rating,
                    "thumbnail_url": movie.thumbnail_url,
                    "video_url": movie.video_url,
                    "progress_seconds": h.progress_seconds,
                    "total_seconds": h.total_seconds,
                    "progress_percent": round(percent, 1),
                    "is_continue_watching": True
                })
        elif h.tv_show_id and h.episode_id:
            show = db.query(TVShow).filter(TVShow.id == h.tv_show_id).first()
            ep = db.query(Episode).filter(Episode.id == h.episode_id).first()
            if show and ep:
                episodes_list = []
                sorted_episodes = sorted(show.episodes, key=lambda e: e.episode_number or 0)
                for e_item in sorted_episodes:
                    episodes_list.append({
                        "id": e_item.id,
                        "episode_number": e_item.episode_number,
                        "title": e_item.title,
                        "thumbnail_url": e_item.thumbnail_url,
                        "video_url": e_item.video_url
                    })
                
                results.append({
                    "id": show.id,
                    "tv_show_id": show.id,
                    "episode_id": ep.id,
                    "target_episode_index": (ep.episode_number - 1) if ep.episode_number else 0,
                    "title": f"{show.title} (Eps {ep.episode_number})",
                    "description": show.description,
                    "release_year": show.release_year,
                    "rating": show.rating,
                    "thumbnail_url": ep.thumbnail_url or show.thumbnail_url,
                    "episodes": episodes_list,
                    "progress_seconds": h.progress_seconds,
                    "total_seconds": h.total_seconds,
                    "progress_percent": round(percent, 1),
                    "is_continue_watching": True
                })

    return results
