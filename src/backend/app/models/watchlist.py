from sqlalchemy import Column, Integer, ForeignKey, DateTime
from datetime import datetime
from sqlalchemy.orm import relationship
from app.core.database import Base

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    movie_id = Column(Integer, ForeignKey("movies.id"), index=True, nullable=True)
    tv_show_id = Column(Integer, ForeignKey("tv_shows.id"), index=True, nullable=True)
    
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist")
    movie = relationship("Movie")
    tv_show = relationship("TVShow")
