from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import database engine dan Base
from app.core.database import engine, Base
# Import file model agar terbaca oleh SQLAlchemy
from app.models import user, movies, watch_history
from app.api import auth, movies

# PERINTAH AJAIB: Menerjemahkan Python ke MySQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Sanflix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(movies.router, prefix="/api/movies", tags=["Movies"])
@app.get("/")
def read_root():
    return {"message": "Halo, Backend Sanflix sudah aktif dan terhubung ke Database!"}