from pydantic import BaseModel
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
        orm_mode = True

class DepartmentBase(BaseModel):
    name: str
    slug: Optional[str] = None

class DepartmentOut(DepartmentBase):
    id: int
    university_id: int
    class Config:
        orm_mode = True

class CourseBase(BaseModel):
    title: str
    duration: Optional[str] = None
    mode: Optional[str] = None
    location: Optional[str] = None
    fees: Optional[str] = None
    link: Optional[str] = None
    summary: Optional[str] = None

class CourseOut(CourseBase):
    id: int
    department_id: int
    last_updated: Optional[datetime]
    class Config:
        orm_mode = True

class CourseListOut(BaseModel):
    total: int
    skip: int
    limit: int
    courses: List[CourseOut]
