from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base
import app.models.user
import app.models.movies
import app.models.tv_shows

class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), index=True, nullable=True)
    tv_show_id = Column(Integer, ForeignKey("tv_shows.id"), index=True, nullable=True)
    episode_id = Column(Integer, ForeignKey("episodes.id"), index=True, nullable=True)

    progress_seconds = Column(Integer, default=0)
    total_seconds = Column(Integer, default=0)

    last_watched_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="history")
    movie = relationship("Movie", back_populates="watched_by")
    tv_show = relationship("TVShow")
    episode = relationship("Episode")