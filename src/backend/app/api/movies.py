from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.movies import Movie

router = APIRouter()

# 1. Endpoint untuk mengambil semua film
@router.get("/")
def get_all_movies(db: Session = Depends(get_db)):
    movies = db.query(Movie).all()
    return movies

# 2. Endpoint khusus untuk mengisi Dummy Data (Seeding)
@router.post("/seed")
def seed_movies(db: Session = Depends(get_db)):
    # Cek apakah tabel movie sudah ada isinya
    existing_movies = db.query(Movie).count()
    if existing_movies > 0:
        return {"message": "Data film sudah ada, tidak perlu seed lagi."}

    # Daftar film dummy
    dummy_movies = [
        Movie(
            title="Inception",
            description="Seorang pencuri yang memiliki kemampuan untuk memasuki mimpi orang lain.",
            release_year=2010,
            rating="PG-13",
            thumbnail_url="https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4" # Video dummy kelinci
        ),
        Movie(
            title="Interstellar",
            description="Sekelompok penjelajah menggunakan wormhole baru untuk melampaui batasan perjalanan ruang angkasa.",
            release_year=2014,
            rating="PG-13",
            thumbnail_url="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4"
        ),
        Movie(
            title="The Dark Knight",
            description="Batman harus menerima salah satu tes psikologis dan fisik terbesarnya untuk melawan Joker.",
            release_year=2008,
            rating="PG-13",
            thumbnail_url="https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            video_url="https://www.w3schools.com/html/mov_bbb.mp4"
        )
    ]

    # Masukkan ke database
    db.add_all(dummy_movies)
    db.commit()

    return {"message": "Berhasil menambahkan 3 film dummy ke database!"}