import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine, Base
from app.models import user, movies, watch_history, tv_shows
from app.api import auth, movies, tv_shows, history, search, feed, watchlist, admin

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sanflix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(movies.router, prefix="/api/movies", tags=["Movies"])
app.include_router(tv_shows.router, prefix="/api/tvshows", tags=["TV Shows"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(search.router, prefix="/api/search", tags=["Search"])
app.include_router(feed.router, prefix="/api/feed", tags=["Feed Algorithms"])
app.include_router(watchlist.router, prefix="/api/watchlist", tags=["watchlist"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


os.makedirs("media", exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data"))
if os.path.exists(DATA_DIR):
    app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

@app.get("/")
def read_root():
    return {"message": "Halo, Backend Sanflix sudah aktif dan terhubung ke Database!"}