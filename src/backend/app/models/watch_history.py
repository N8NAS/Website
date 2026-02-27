from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base

class WatchHistory(Base):
    __tablename__ = "watch_history"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    movie_id = Column(Integer, ForeignKey("movies.id"), index=True, nullable=True)
    #tv_id = Column(Integer, ForeignKey("tv_shows.id"), index=True, nullable=True)

    watched_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="history")
    movie = relationship("Movie", back_populates="watched_by")