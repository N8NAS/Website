from pydantic import BaseModel, EmailStr

# Schema ini memastikan frontend wajib mengirim email yang valid dan password
class UserCreate(BaseModel):
    email: EmailStr
    password: str
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class MovieResponse(BaseModel):
    id: int
    title: str
    description: str
    release_year: int
    rating: str
    thumbnail_url: str
    video_url: str

    class Config:
        from_attributes = True  # Mengubah objek SQLAlchemy menjadi JSON