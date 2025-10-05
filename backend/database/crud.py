# crud.py
from sqlalchemy.orm import Session
from .models import University, Department, Course
from datetime import datetime

def get_or_create_university(db: Session, name: str, country: str = "UK", website: str = None):
    uni = db.query(University).filter(University.name.ilike(name)).first()
    if not uni:
        uni = University(name=name, country=country, website=website)
        db.add(uni)
        db.commit()
        db.refresh(uni)
    return uni

def get_or_create_department(db: Session, name: str, university_id: int, slug: str = None):
    dept = (
        db.query(Department)
        .filter(Department.name.ilike(name))
        .filter(Department.university_id == university_id)
        .first()
    )
    if not dept:
        dept = Department(name=name, university_id=university_id, slug=slug)
        db.add(dept)
        db.commit()
        db.refresh(dept)
    return dept

def upsert_course(db: Session, department_id: int, course_data: dict):
    # Use link if available to identify unique course; otherwise title+department
    link = course_data.get("link")
    query = db.query(Course)
    if link:
        existing = query.filter(Course.link == link).first()
    else:
        existing = query.filter(Course.title.ilike(course_data.get("title"))).filter(Course.department_id == department_id).first()

    if existing:
        # update fields
        existing.title = course_data.get("title") or existing.title
        existing.duration = course_data.get("duration") or existing.duration
        existing.mode = course_data.get("mode") or existing.mode
        existing.location = course_data.get("location") or existing.location
        existing.fees = course_data.get("fees") or existing.fees
        existing.summary = course_data.get("summary") or existing.summary
        existing.last_updated = datetime.utcnow()
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing, False
    else:
        new = Course(
            title=course_data.get("title"),
            duration=course_data.get("duration"),
            mode=course_data.get("mode"),
            location=course_data.get("location"),
            fees=course_data.get("fees"),
            link=course_data.get("link"),
            summary=course_data.get("summary"),
            department_id=department_id,
        )
        db.add(new)
        db.commit()
        db.refresh(new)
        return new, True

# Query helpers for endpoints
def get_courses(db: Session, skip: int = 0, limit: int = 10, **filters):
    query = db.query(Course)
    if filters.get("title"):
        query = query.filter(Course.title.ilike(f"%{filters['title']}%"))
    if filters.get("university_id"):
        query = query.join(Course.department).filter(Department.university_id == filters["university_id"])
    if filters.get("department_id"):
        query = query.filter(Course.department_id == filters["department_id"])
    if filters.get("location"):
        query = query.filter(Course.location.ilike(f"%{filters['location']}%"))
    if filters.get("duration"):
        query = query.filter(Course.duration.ilike(f"%{filters['duration']}%"))
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return total, items

def get_course(db: Session, id: int):
    return db.query(Course).filter(Course.id == id).first()
