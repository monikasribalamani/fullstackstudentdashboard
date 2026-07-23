"""Shared FastAPI dependencies."""
from fastapi import Depends
from sqlalchemy.orm import Session
from typing_extensions import Annotated

from app.database.session import get_db
from app.services.student_service import StudentService

DbSession = Annotated[Session, Depends(get_db)]


def get_student_service(db: DbSession) -> StudentService:
    """Provide a StudentService bound to the current request's DB session."""
    return StudentService(db)
