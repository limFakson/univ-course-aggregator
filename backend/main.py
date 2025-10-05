# main.py
from fastapi import FastAPI, Depends, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database.database import SessionLocal, engine
from database import models
from database.crud import get_or_create_university, get_or_create_department, get_course, get_courses
from scraper import refresh_biological_sciences
from database.schemas import UniversityOut, DepartmentOut, CourseOut, CourseListOut
from typing import Optional

# Create DB tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="University Course Aggregator - Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/universities", response_model=list[UniversityOut])
def list_universities(db: Session = Depends(get_db)):
    items = db.query(models.University).all()
    return items

@app.get("/api/departments", response_model=list[DepartmentOut])
def list_departments(university_id: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Department)
    if university_id:
        q = q.filter(models.Department.university_id == university_id)
    return q.all()

@app.get("/api/courses", response_model=CourseListOut)
def api_get_courses(
    title: Optional[str] = Query(None),
    university_id: Optional[int] = Query(None),
    department_id: Optional[int] = Query(None),
    location: Optional[str] = Query(None),
    duration: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    filters = {
        "title": title,
        "university_id": university_id,
        "department_id": department_id,
        "location": location,
        "duration": duration,
    }
    total, items = get_courses(db, skip=skip, limit=limit, **{k:v for k,v in filters.items() if v})
    return {"total": total, "skip": skip, "limit": limit, "courses": items}

@app.get("/api/courses/{course_id}", response_model=CourseOut)
def api_get_course(course_id: int, db: Session = Depends(get_db)):
    c = get_course(db, course_id)
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")
    return c

@app.post("/api/refresh/biological-sciences")
def refresh_biological_sciences_endpoint(background_tasks: BackgroundTasks, dept:str, slug:str, uni:str="University of Southampton"):
    """
    Trigger a refresh/scrape for the School of Biological Sciences.
    Returns quickly and runs the scraping in background.
    """
    # Run in background to avoid blocking long scraping
    background_tasks.add_task(refresh_biological_sciences, dept, slug, uni)
    return {"status": "started", "message": "Refresh started in background. Check API after a moment."}

# Serve frontend static (assumes built frontend copied to backend/static)
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")