from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.movies import Movie
from app.models.tv_shows import TVShow

router = APIRouter()

@router.get("/")
def search_content(q: str = Query("", description="Kata kunci pencarian"), db: Session = Depends(get_db)):
    if not q or len(q.strip()) == 0:
        return []

    movies = db.query(Movie).filter(Movie.title.ilike(f"%{q}%")).all()
    tv_shows = db.query(TVShow).filter(TVShow.title.ilike(f"%{q}%")).all()

    results = []

    for m in movies:
        results.append({
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "release_year": m.release_year,
            "rating": m.rating,
            "thumbnail_url": m.thumbnail_url,
            "video_url": m.video_url,
            "type": "movie"
        })

    for t in tv_shows:
        results.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "release_year": t.release_year,
            "rating": t.rating,
            "thumbnail_url": t.thumbnail_url,
            "episodes": [
                {
                    "id": ep.id,
                    "episode_number": ep.episode_number,
                    "title": ep.title,
                    "thumbnail_url": ep.thumbnail_url,
                    "video_url": ep.video_url
                } for ep in t.episodes
            ],
            "type": "tvshow"
        })

    return results
