from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from mock_data import courses
from model.base_model import *
from utils import advanced_filter

app = FastAPI(title="University Course Aggregator API")

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Routes
# -----------------------------
@app.get("/courses", response_model=CourseListResponse)
def get_courses(
    title: Optional[str] = Query(None, description="Search by course title"),
    university: Optional[str] = Query(None, description="Filter by university"),
    location: Optional[str] = Query(None, description="Filter by location"),
    duration: Optional[str] = Query(None, description="Filter by duration"),
    fees: Optional[str] = Query(None, description="Filter by fees"),
    skip: int = 0,
    limit: int = 100,
):
    """Get courses with advanced filters and pagination."""
    results = advanced_filter(title, university, location, duration, fees)
    total = len(results)
    results = results[skip : skip + limit]
    return CourseListResponse(total=total, skip=skip, limit=limit, courses=results)

@app.get("/courses/{course_id}", response_model=CourseResponse)
def get_course(course_id: int):
    course = next((c for c in courses if c.id == course_id), None)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseResponse(course=course)

from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")