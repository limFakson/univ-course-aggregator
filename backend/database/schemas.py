from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime

# -----------------------------
# Models
# -----------------------------

class UniversityBase(BaseModel):
    name: str
    country: Optional[str] = "UK"
    website: Optional[str] = None

class UniversityOut(UniversityBase):
    id: int
    class Config:
        from_attributes = True

class DepartmentBase(BaseModel):
    name: str
    slug: Optional[str] = None

class DepartmentOut(DepartmentBase):
    id: int
    university_id: int
    university: Optional[UniversityOut] = None
    class Config:
        from_attributes = True

class CourseBase(BaseModel):
    title: str
    duration: Optional[str] = None
    mode: Optional[str] = None
    location: Optional[str] = None
    fees: Optional[str] = "Not specified"
    link: Optional[str] = None
    summary: Optional[str] = None
    fees_detail: Optional[str] = None       
    requirements: Optional[list] = None 

    @field_validator("requirements", mode="before")
    def split_requirements(cls, v):
        if isinstance(v, str):
            return v.split(", ")
        return v or []
        
class CourseOut(CourseBase):
    id: int
    department_id: int
    department: Optional[DepartmentOut] = None
    last_updated: Optional[datetime]
    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    duration: Optional[str] = None
    mode: Optional[str] = None
    location: Optional[str] = None
    fees: Optional[str] = None
    fees_detail: Optional[str] = None
    requirements: Optional[str] = None
    link: Optional[str] = None
    department_id: int

    class Config:
        from_attributes = True
        
class CourseListOut(BaseModel):
    total: int
    courses: List[CourseOut]
