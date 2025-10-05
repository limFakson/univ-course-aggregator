from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class University(Base):
    __tablename__ = "universities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    country = Column(String, default="UK")
    website = Column(String, nullable=True)
    departments = relationship("Department", back_populates="university")

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String, index=True, nullable=True)
    university_id = Column(Integer, ForeignKey("universities.id"))
    university = relationship("University", back_populates="departments")
    courses = relationship("Course", back_populates="department")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    duration = Column(String, nullable=True)
    mode = Column(String, nullable=True)
    location = Column(String, nullable=True)
    fees = Column(String, nullable=True)
    fees_detail = Column(Text, nullable=True)
    requirements = Column(Text, nullable=True)
    link = Column(String, nullable=True, unique=True)
    summary = Column(Text, nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department = relationship("Department", back_populates="courses")
    last_updated = Column(DateTime, default=datetime.utcnow)
