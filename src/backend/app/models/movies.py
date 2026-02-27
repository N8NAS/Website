from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    release_year = Column(Integer)
    rating = Column(String(10)) 
    thumbnail_url = Column(String(500))
    video_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)

    watched_by = relationship("WatchHistory", back_populates="movie")