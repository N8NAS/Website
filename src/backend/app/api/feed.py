import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.movies import Movie
from app.models.tv_shows import TVShow
from app.models.watch_history import WatchHistory
router = APIRouter()

def format_movie(m):
    return{
        "id" : m.id, "title": m.title, "description": m.description,
        "release_year": m.release_year, "rating": m.rating,
        "thumbnail_url": m.thumbnail_url, "video_url": m.video_url, "type": "movie"
    }

def format_tv(t):
    return {
        "id": t.id, "title": t.title, "description": t.description,
        "release_year": t.release_year, "rating": t.rating,
        "thumbnail_url": t.thumbnail_url, "type": "tvshow",
        "episodes": [{"id": ep.id, "title": ep.title, "video_url": ep.video_url, "thumbnail_url": ep.thumbnail_url} for ep in t.episodes]
    }

@router.get("/new-releases")
def get_new_releases(db: Session = Depends(get_db)):
    movies = db.query(Movie).order_by(Movie.id.desc()).limit(15).all()
    tvs = db.query(TVShow).order_by(TVShow.id.desc()).limit(15).all()
    
    results = [format_movie(m) for m in movies] + [format_tv(t) for t in tvs]
    
    results.sort(key=lambda x: x["id"], reverse=True)
    
    return results[:15]

@router.get("/top-picks")
def get_top_picks(db: Session = Depends(get_db)):

    movies = db.query(Movie).all()
    tvs = db.query(TVShow).all()
    
    results = [format_movie(m) for m in movies] + [format_tv(t) for t in tvs]
    results.sort(key=lambda x: x["release_year"] or 0, reverse=True)
    
    return results[:15]

@router.get("/popular")
def get_popular(db: Session = Depends(get_db)):
    popular_movies = db.query(WatchHistory.movie_id, func.count(WatchHistory.id))\
        .filter(WatchHistory.movie_id != None).group_by(WatchHistory.movie_id)\
        .order_by(func.count(WatchHistory.id).desc()).all()
        
    popular_tvs = db.query(WatchHistory.tv_show_id, func.count(WatchHistory.id))\
        .filter(WatchHistory.tv_show_id != None).group_by(WatchHistory.tv_show_id)\
        .order_by(func.count(WatchHistory.id).desc()).all()
    results = []
    
    for m_id, count in popular_movies:
        movie = db.query(Movie).filter(Movie.id == m_id).first()
        if movie: results.append(format_movie(movie))
        
    for t_id, count in popular_tvs:
        tv = db.query(TVShow).filter(TVShow.id == t_id).first()
        if tv: results.append(format_tv(tv))

    if len(results) < 10:
        all_movies = db.query(Movie).limit(10).all()
        for m in all_movies:
            formatted = format_movie(m)
            if formatted not in results:
                results.append(formatted)
    return results[:15]