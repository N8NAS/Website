from pydantic import BaseModel, EmailStr

# Schema ini memastikan frontend wajib mengirim email yang valid dan password
class UserCreate(BaseModel):
    email: EmailStr
    password: str