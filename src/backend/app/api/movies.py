import os
import json
import urllib.parse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.movies import Movie
from pydantic import BaseModel


router = APIRouter()

@router.get("/")
def get_all_movies(genre: str = None, db: Session = Depends(get_db)):
    query = db.query(Movie)
    if genre and genre != "All":
        query = query.filter(Movie.genre.ilike(f"%{genre}%"))
    return query.all()

@router.delete("/clean-dummy")
def clean_dummy_movies(db: Session = Depends(get_db)):
    dummy_titles = ["Inception", "Interstellar", "The Dark Knight"]
    deleted_count = db.query(Movie).filter(Movie.title.in_(dummy_titles)).delete(synchronize_session=False)
    db.commit()
    return {"message": f"Berhasil menghapus {deleted_count} film dummy lama dari database MySQL!"}

@router.post("/sync-json")
def sync_movies_from_json(db: Session = Depends(get_db)):
    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/movies/movies.json"))
    if not os.path.exists(json_path):
        return {"error": f"File tidak ditemukan di path: {json_path}"}
    
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    
    with open(json_path, "r", encoding="utf-8") as f:
        movies_data = json.load(f)
        
    count = 0
    for item in movies_data:
        video_url = item.get("video_url")
        if not video_url and "video_filename" in item:
            if item["video_filename"].startswith(("http://", "https://")):
                video_url = item["video_filename"]
            else:
                encoded_name = urllib.parse.quote(item["video_filename"])
                video_url = f"{base_url}/data/movies/{encoded_name}"
            
        thumbnail_url = item.get("thumbnail_url")
        if not thumbnail_url and "thumbnail_filename" in item:
            if item["thumbnail_filename"].startswith(("http://", "https://")):
                thumbnail_url = item["thumbnail_filename"]
            else:
                encoded_thumb = urllib.parse.quote(item["thumbnail_filename"])
                thumbnail_url = f"{base_url}/data/thumbnails/{encoded_thumb}"
            
        existing = db.query(Movie).filter(Movie.title == item["title"]).first()
        if existing:
            existing.description = item.get("description", existing.description)
            existing.release_year = item.get("release_year", existing.release_year)
            existing.rating = item.get("rating", existing.rating)
            existing.genre = item.get("genre", existing.genre)
            if video_url:
                existing.video_url = video_url
            if thumbnail_url:
                existing.thumbnail_url = thumbnail_url
        else:
            new_movie = Movie(
                title=item["title"],
                description=item.get("description", ""),
                release_year=item.get("release_year", 2023),
                rating=item.get("rating", "PG-13"),
                genre=item.get("genre", "Uncategorized"),
                thumbnail_url=thumbnail_url or "",
                video_url=video_url or ""
            )
            db.add(new_movie)
        count += 1
        
    db.commit()
    return {"message": f"Berhasil sinkronisasi {count} film dari movies.json ke MySQL!"}


class MovieCreate(BaseModel):
    title: str
    description: str = ""
    release_year: int = 2024
    rating: str = "PG-13"
    genre: str = "Uncategorized"
    video_filename: str
    thumbnail_filename: str

@router.post("/add")
def add_movie(item: MovieCreate, db: Session = Depends(get_db)):
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    
    if item.video_filename.startswith(("http://", "https://")):
        video_url = item.video_filename
    else:
        encoded_video = urllib.parse.quote(item.video_filename)
        video_url = f"{base_url}/data/movies/{encoded_video}"
        
    if item.thumbnail_filename.startswith(("http://", "https://")):
        thumbnail_url = item.thumbnail_filename
    else:
        encoded_thumb = urllib.parse.quote(item.thumbnail_filename)
        thumbnail_url = f"{base_url}/data/thumbnails/{encoded_thumb}"
    
    new_movie = Movie(
        title=item.title,
        description=item.description,
        release_year=item.release_year,
        rating=item.rating,
        genre=item.genre,
        video_url=video_url,
        thumbnail_url=thumbnail_url
    )
    
    db.add(new_movie)
    db.commit()
    
    return {"message": f"Film '{new_movie.title}' berhasil ditambahkan ke Database!"}

@router.delete("/{movie_id}")
def delete_movie(movie_id: int, db: Session = Depends(get_db)):
    movie = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        return {"error": "Film tidak ditemukan!"}
    
    db.delete(movie)
    db.commit()
    return {"message": f"Film '{movie.title}' berhasil dihapus!"}
