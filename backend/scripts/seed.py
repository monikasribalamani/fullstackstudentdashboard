"""Seed the students table with realistic sample data.

Usage:
    python -m scripts.seed
"""
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.core.logging import configure_logging, get_logger  # noqa: E402
from app.database.session import SessionLocal  # noqa: E402
from app.models.student import Student  # noqa: E402

configure_logging()
logger = get_logger(__name__)

SAMPLE_STUDENTS = [
    {
        "student_id": "STU2024001",
        "name": "Aarav Sharma",
        "email": "aarav.sharma@example.com",
        "phone": "+14155550101",
        "department": "Computer Science",
        "year": 3,
        "cgpa": 9.12,
        "status": "active",
    },
    {
        "student_id": "STU2024002",
        "name": "Priya Nair",
        "email": "priya.nair@example.com",
        "phone": "+14155550102",
        "department": "Electronics",
        "year": 2,
        "cgpa": 8.45,
        "status": "active",
    },
    {
        "student_id": "STU2024003",
        "name": "Liam Johnson",
        "email": "liam.johnson@example.com",
        "phone": "+14155550103",
        "department": "Mechanical Engineering",
        "year": 4,
        "cgpa": 7.68,
        "status": "active",
    },
    {
        "student_id": "STU2024004",
        "name": "Sofia Garcia",
        "email": "sofia.garcia@example.com",
        "phone": "+14155550104",
        "department": "Civil Engineering",
        "year": 1,
        "cgpa": 8.90,
        "status": "active",
    },
    {
        "student_id": "STU2024005",
        "name": "Wei Chen",
        "email": "wei.chen@example.com",
        "phone": "+14155550105",
        "department": "Computer Science",
        "year": 4,
        "cgpa": 6.75,
        "status": "inactive",
    },
    {
        "student_id": "STU2024006",
        "name": "Emma Williams",
        "email": "emma.williams@example.com",
        "phone": "+14155550106",
        "department": "Information Technology",
        "year": 2,
        "cgpa": 9.55,
        "status": "active",
    },
    {
        "student_id": "STU2024007",
        "name": "Noah Martinez",
        "email": "noah.martinez@example.com",
        "phone": "+14155550107",
        "department": "Electrical Engineering",
        "year": 3,
        "cgpa": 5.90,
        "status": "inactive",
    },
    {
        "student_id": "STU2024008",
        "name": "Ananya Iyer",
        "email": "ananya.iyer@example.com",
        "phone": "+14155550108",
        "department": "Computer Science",
        "year": 1,
        "cgpa": 8.20,
        "status": "active",
    },
    {
        "student_id": "STU2024009",
        "name": "Lucas Silva",
        "email": "lucas.silva@example.com",
        "phone": "+14155550109",
        "department": "Mechanical Engineering",
        "year": 2,
        "cgpa": 7.30,
        "status": "active",
    },
    {
        "student_id": "STU2024010",
        "name": "Mia Anderson",
        "email": "mia.anderson@example.com",
        "phone": "+14155550110",
        "department": "Information Technology",
        "year": 4,
        "cgpa": 9.00,
        "status": "active",
    },
]


def seed() -> None:
    """Insert sample students, skipping any that already exist."""
    db = SessionLocal()
    try:
        inserted = 0
        skipped = 0
        for record in SAMPLE_STUDENTS:
            exists = (
                db.query(Student)
                .filter(Student.student_id == record["student_id"])
                .first()
            )
            if exists:
                skipped += 1
                continue
            db.add(Student(**record))
            inserted += 1

        db.commit()
        logger.info("Seed complete: %d inserted, %d skipped (already existed)", inserted, skipped)
    finally:
        db.close()


if __name__ == "__main__":
    seed()
