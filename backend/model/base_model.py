from pydantic import BaseModel
from typing import List

# -----------------------------
# Models
# -----------------------------
class Course(BaseModel):
    id: int
    title: str
    university: str
    duration: str
    location: str
    fees: str
    requirements: List[str]
    description: str
    schedule: str
    instructor: str
    credits: int

class CourseResponse(BaseModel):
    course: Course

class CourseListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    courses: List[Course]

