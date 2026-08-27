import os
import json
import urllib.parse
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.tv_shows import TVShow, Episode
from pydantic import BaseModel

router = APIRouter()

@router.get("/")
def get_all_tv_shows(genre: str = None, db: Session = Depends(get_db)):
    query = db.query(TVShow)
    if genre and genre != "All":
        query = query.filter(TVShow.genre.ilike(f"%{genre}%"))
        
    shows = query.all()
    result = []
    for show in shows:
        episodes_list = []
        sorted_episodes = sorted(show.episodes, key=lambda e: e.episode_number or 0)
        for ep in sorted_episodes:
            episodes_list.append({
                "id": ep.id,
                "episode_number": ep.episode_number,
                "title": ep.title,
                "thumbnail_url": ep.thumbnail_url,
                "video_url": ep.video_url
            })
        result.append({
            "id": show.id,
            "title": show.title,
            "description": show.description,
            "release_year": show.release_year,
            "rating": show.rating,
            "thumbnail_url": show.thumbnail_url,
            "episodes": episodes_list
        })
    return result

@router.post("/sync-json")
def sync_tv_shows_from_json(db: Session = Depends(get_db)):
    json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/tv shows/tv-shows.json"))
    if not os.path.exists(json_path):
        return {"error": f"File tidak ditemukan di path: {json_path}"}
    
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    
    with open(json_path, "r", encoding="utf-8") as f:
        shows_data = json.load(f)
        
    count = 0
    for item in shows_data:
        thumbnail_url = item.get("thumbnail_url")
        if not thumbnail_url and "thumbnail_filename" in item:
            if item["thumbnail_filename"].startswith(("http://", "https://")):
                thumbnail_url = item["thumbnail_filename"]
            else:
                encoded_thumb = urllib.parse.quote(item["thumbnail_filename"])
                thumbnail_url = f"{base_url}/data/thumbnails/{encoded_thumb}"
            
        existing = db.query(TVShow).filter(TVShow.title == item["title"]).first()
        if not existing:
            existing = TVShow(
                title=item["title"],
                description=item.get("description", ""),
                release_year=item.get("release_year", 2020),
                rating=item.get("rating", "PG"),
                genre=item.get("genre", "Uncategorized"),
                thumbnail_url=thumbnail_url or ""
            )
            db.add(existing)
            db.flush()
        else:
            existing.description = item.get("description", existing.description)
            existing.release_year = item.get("release_year", existing.release_year)
            existing.rating = item.get("rating", existing.rating)
            existing.genre = item.get("genre", existing.genre)
            if thumbnail_url:
                existing.thumbnail_url = thumbnail_url
                
        if "episodes" in item:
            for ep_data in item["episodes"]:
                ep_num = ep_data.get("episode_number", 1)
                ep_title = ep_data.get("title", f"Episode {ep_num}")
                
                video_url = ep_data.get("video_url")
                if not video_url and "video_filename" in ep_data:
                    if ep_data["video_filename"].startswith(("http://", "https://")):
                        video_url = ep_data["video_filename"]
                    else:
                        encoded_video = urllib.parse.quote(ep_data["video_filename"])
                        video_url = f"{base_url}/data/tv%20shows/{encoded_video}"
                    
                ep_thumb = ep_data.get("thumbnail_url")
                if not ep_thumb and "thumbnail_filename" in ep_data:
                    if ep_data["thumbnail_filename"].startswith(("http://", "https://")):
                        ep_thumb = ep_data["thumbnail_filename"]
                    else:
                        encoded_ep_thumb = urllib.parse.quote(ep_data["thumbnail_filename"])
                        ep_thumb = f"{base_url}/data/thumbnails/{encoded_ep_thumb}"
                
                existing_ep = db.query(Episode).filter(
                    Episode.tv_show_id == existing.id,
                    Episode.episode_number == ep_num
                ).first()
                
                if existing_ep:
                    existing_ep.title = ep_title
                    if video_url:
                        existing_ep.video_url = video_url
                    if ep_thumb:
                        existing_ep.thumbnail_url = ep_thumb
                else:
                    new_ep = Episode(
                        tv_show_id=existing.id,
                        episode_number=ep_num,
                        title=ep_title,
                        video_url=video_url or "",
                        thumbnail_url=ep_thumb or thumbnail_url or ""
                    )
                    db.add(new_ep)
        count += 1
        
    db.commit()
    return {"message": f"Berhasil sinkronisasi {count} TV series dari tv-shows.json ke MySQL!"}


class TVShowCreate(BaseModel):
    title: str
    description: str = ""
    release_year: int = 2024
    rating: str = "TV-14"
    genre: str = "Uncategorized"
    thumbnail_filename: str

class EpisodeCreate(BaseModel):
    tv_show_id: int
    title: str
    episode_number: int
    video_filename: str
    thumbnail_filename: str

@router.post("/add-show")
def add_tv_show(item: TVShowCreate, db: Session = Depends(get_db)):
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    if item.thumbnail_filename.startswith(("http://", "https://")):
        thumbnail_url = item.thumbnail_filename
    else:
        encoded_thumb = urllib.parse.quote(item.thumbnail_filename)
        thumbnail_url = f"{base_url}/data/thumbnails/{encoded_thumb}"
    
    new_show = TVShow(
        title=item.title,
        description=item.description,
        release_year=item.release_year,
        rating=item.rating,
        genre=item.genre,
        thumbnail_url=thumbnail_url
    )
    
    db.add(new_show)
    db.commit()
    db.refresh(new_show)
    return {"message": f"Serial TV '{new_show.title}' berhasil dibuat!", "id": new_show.id}

@router.post("/add-episode")
def add_episode(item: EpisodeCreate, db: Session = Depends(get_db)):
    base_url = os.getenv("BACKEND_URL", "http://127.0.0.1:8000")
    
    if item.video_filename.startswith(("http://", "https://")):
        video_url = item.video_filename
    else:
        encoded_video = urllib.parse.quote(item.video_filename)
        video_url = f"{base_url}/data/tv shows/{encoded_video}"
        
    if item.thumbnail_filename.startswith(("http://", "https://")):
        thumbnail_url = item.thumbnail_filename
    else:
        encoded_thumb = urllib.parse.quote(item.thumbnail_filename)
        thumbnail_url = f"{base_url}/data/thumbnails/{encoded_thumb}"
    
    new_ep = Episode(
        tv_show_id=item.tv_show_id,
        title=item.title,
        episode_number=item.episode_number,
        video_url=video_url,
        thumbnail_url=thumbnail_url
    )
    
    db.add(new_ep)
    db.commit()
    return {"message": f"Episode {new_ep.episode_number} berhasil ditambahkan!"}

@router.delete("/{tv_show_id}")
def delete_tv_show(tv_show_id: int, db: Session = Depends(get_db)):
    show = db.query(TVShow).filter(TVShow.id == tv_show_id).first()
    if not show:
        return {"error": "Serial TV tidak ditemukan!"}
    
    db.delete(show)
    db.commit()
    return {"message": f"Serial TV '{show.title}' beserta seluruh episodenya berhasil dihapus!"}
