from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class TVShow(Base):
    __tablename__ = "tv_shows"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(Text)
    release_year = Column(Integer)
    rating = Column(String(50))
    thumbnail_url = Column(String(500))
    genre = Column(String(100), default="Uncategorized") 
    episodes = relationship("Episode", back_populates="tv_show", cascade="all, delete-orphan")


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True, index=True)
    
    tv_show_id = Column(Integer, ForeignKey("tv_shows.id"))
    
    episode_number = Column(Integer)
    title = Column(String(255))
    thumbnail_url = Column(String(500))
    video_url = Column(String(500))

    tv_show = relationship("TVShow", back_populates="episodes")
