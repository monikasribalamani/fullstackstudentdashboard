"""Repository layer: raw database access for the Student entity.

This layer knows nothing about HTTP concerns - it only translates between
the ORM and plain Python objects, and is the single place that constructs
SQLAlchemy queries for students.
"""
from typing import List, Optional, Tuple

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate


def get_by_id(db: Session, student_pk: str) -> Optional[Student]:
    """Fetch a student by primary key (UUID)."""
    return db.get(Student, student_pk)


def get_by_student_id(db: Session, student_id: str) -> Optional[Student]:
    """Fetch a student by the human-readable, unique student_id."""
    stmt = select(Student).where(Student.student_id == student_id.upper())
    return db.execute(stmt).scalar_one_or_none()


def get_by_email(db: Session, email: str) -> Optional[Student]:
    """Fetch a student by email address."""
    stmt = select(Student).where(func.lower(Student.email) == email.lower())
    return db.execute(stmt).scalar_one_or_none()


def list_students(
    db: Session,
    *,
    search: Optional[str] = None,
    department: Optional[str] = None,
    status_filter: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    page: int = 1,
    page_size: int = 10,
) -> Tuple[List[Student], int]:
    """Return a filtered, sorted, paginated list of students plus the total count."""
    stmt = select(Student)
    count_stmt = select(func.count()).select_from(Student)

    if search:
        pattern = f"%{search.lower()}%"
        search_filter = (
            func.lower(Student.name).like(pattern)
            | func.lower(Student.student_id).like(pattern)
            | func.lower(Student.email).like(pattern)
        )
        stmt = stmt.where(search_filter)
        count_stmt = count_stmt.where(search_filter)

    if department:
        stmt = stmt.where(func.lower(Student.department) == department.lower())
        count_stmt = count_stmt.where(func.lower(Student.department) == department.lower())

    if status_filter:
        stmt = stmt.where(Student.status == status_filter.lower())
        count_stmt = count_stmt.where(Student.status == status_filter.lower())

    sort_columns = {
        "student_id": Student.student_id,
        "name": Student.name,
        "department": Student.department,
        "year": Student.year,
        "cgpa": Student.cgpa,
        "status": Student.status,
        "created_at": Student.created_at,
    }
    sort_column = sort_columns.get(sort_by, Student.created_at)
    stmt = stmt.order_by(sort_column.asc() if sort_order == "asc" else sort_column.desc())

    total = db.execute(count_stmt).scalar_one()
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)
    items = list(db.execute(stmt).scalars().all())

    return items, total


def create(db: Session, payload: StudentCreate) -> Student:
    """Insert a new student row."""
    student = Student(**payload.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def update(db: Session, student: Student, payload: StudentUpdate) -> Student:
    """Apply partial updates to an existing student row."""
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    return student


def delete(db: Session, student: Student) -> None:
    """Delete a single student row."""
    db.delete(student)
    db.commit()


def delete_all(db: Session) -> int:
    """Delete every student row and return the number of rows removed."""
    count = db.execute(select(func.count()).select_from(Student)).scalar_one()
    db.query(Student).delete()
    db.commit()
    return count


def get_dashboard_stats(db: Session) -> dict:
    """Compute aggregate counts and average CGPA for the dashboard."""
    total = db.execute(select(func.count()).select_from(Student)).scalar_one()
    active = db.execute(
        select(func.count()).select_from(Student).where(Student.status == "active")
    ).scalar_one()
    inactive = db.execute(
        select(func.count()).select_from(Student).where(Student.status == "inactive")
    ).scalar_one()
    avg_cgpa = db.execute(select(func.avg(Student.cgpa))).scalar_one()

    return {
        "total_students": total,
        "active_students": active,
        "inactive_students": inactive,
        "average_cgpa": round(float(avg_cgpa), 2) if avg_cgpa is not None else 0.0,
    }
