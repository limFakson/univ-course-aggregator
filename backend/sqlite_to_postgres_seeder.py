"""
Seeder Script: Transfer data from SQLite to PostgreSQL
------------------------------------------------------

Usage:
    python sqlite_to_postgres_seeder.py
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, University, Department, Course

# ---------------------------------
# Database Connections
# ---------------------------------
SQLITE_URL = "sqlite:///./db/courses.sqlite3"
POSTGRES_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:mysecretpassword@localhost:5432/unicamp_db"
)

sqlite_engine = create_engine(SQLITE_URL, connect_args={"check_same_thread": False})
pg_engine = create_engine(POSTGRES_URL, pool_pre_ping=True)

SQLiteSession = sessionmaker(bind=sqlite_engine)
PGSession = sessionmaker(bind=pg_engine)

sqlite_db = SQLiteSession()
pg_db = PGSession()

# Ensure target tables exist
Base.metadata.create_all(bind=pg_engine)

# ---------------------------------
# Seeder Functions
# ---------------------------------
def transfer_universities():
    print("🚀 Transferring universities...")
    universities = sqlite_db.query(University).all()
    for uni in universities:
        exists = pg_db.query(University).filter(University.name == uni.name).first()
        if not exists:
            pg_db.add(University(
                name=uni.name,
                country=uni.country,
                website=uni.website
            ))
    pg_db.commit()
    print(f"✅ {len(universities)} universities transferred.")


def transfer_departments():
    print("🚀 Transferring departments...")
    departments = sqlite_db.query(Department).all()
    for dept in departments:
        # Match university by name to preserve foreign key
        uni = pg_db.query(University).filter(University.name == dept.university.name).first()
        if not uni:
            continue
        exists = pg_db.query(Department).filter(
            Department.name == dept.name,
            Department.university_id == uni.id
        ).first()
        if not exists:
            pg_db.add(Department(
                name=dept.name,
                slug=dept.slug,
                university_id=uni.id
            ))
    pg_db.commit()
    print(f"✅ {len(departments)} departments transferred.")


def transfer_courses():
    print("🚀 Transferring courses...")
    courses = sqlite_db.query(Course).all()
    for course in courses:
        # Match department by name + university
        dept = pg_db.query(Department).filter(
            Department.name == course.department.name
        ).first()
        if not dept:
            continue

        exists = pg_db.query(Course).filter(Course.title == course.title).first()
        if not exists:
            pg_db.add(Course(
                title=course.title,
                duration=course.duration,
                mode=course.mode,
                location=course.location,
                fees=course.fees,
                fees_detail=course.fees_detail,
                requirements=course.requirements,
                link=course.link,
                summary=course.summary,
                department_id=dept.id,
                last_updated=course.last_updated
            ))
    pg_db.commit()
    print(f"✅ {len(courses)} courses transferred.")


# ---------------------------------
# Run Seeder
# ---------------------------------
if __name__ == "__main__":
    try:
        transfer_universities()
        transfer_departments()
        transfer_courses()
        print("\n🎉 Migration completed successfully!")
    except Exception as e:
        print("❌ Error during migration:", e)
    finally:
        sqlite_db.close()
        pg_db.close()
