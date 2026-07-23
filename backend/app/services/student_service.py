"""Service layer: business rules for the Student resource.

Routers depend on this layer instead of talking to the CRUD/repository layer
directly, keeping HTTP handlers thin and validation/business rules testable
in isolation.
"""
from typing import Optional

from sqlalchemy.orm import Session

from app.crud import student as student_crud
from app.core.exceptions import ConflictError, NotFoundError
from app.core.logging import get_logger
from app.models.student import Student
from app.schemas.student import (
    DashboardStats,
    StudentCreate,
    StudentListResponse,
    StudentResponse,
    StudentUpdate,
)

logger = get_logger(__name__)

VALID_SORT_FIELDS = {"student_id", "name", "department", "year", "cgpa", "status", "created_at"}


class StudentService:
    """Encapsulates all business logic for student records."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def list_students(
        self,
        *,
        search: Optional[str] = None,
        department: Optional[str] = None,
        status_filter: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
        page: int = 1,
        page_size: int = 10,
    ) -> StudentListResponse:
        sort_by = sort_by if sort_by in VALID_SORT_FIELDS else "created_at"
        sort_order = sort_order if sort_order in {"asc", "desc"} else "desc"

        items, total = student_crud.list_students(
            self.db,
            search=search,
            department=department,
            status_filter=status_filter,
            sort_by=sort_by,
            sort_order=sort_order,
            page=page,
            page_size=page_size,
        )
        total_pages = (total + page_size - 1) // page_size if total > 0 else 0

        return StudentListResponse(
            items=[StudentResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    def get_student(self, student_id: str) -> StudentResponse:
        student = student_crud.get_by_student_id(self.db, student_id)
        if student is None:
            raise NotFoundError(f"Student with student_id '{student_id}' was not found")
        return StudentResponse.model_validate(student)

    def create_student(self, payload: StudentCreate) -> StudentResponse:
        if student_crud.get_by_student_id(self.db, payload.student_id) is not None:
            raise ConflictError(
                f"A student with student_id '{payload.student_id}' already exists"
            )
        if student_crud.get_by_email(self.db, payload.email) is not None:
            raise ConflictError(f"A student with email '{payload.email}' already exists")

        student = student_crud.create(self.db, payload)
        logger.info("Created student %s", student.student_id)
        return StudentResponse.model_validate(student)

    def update_student(self, student_id: str, payload: StudentUpdate) -> StudentResponse:
        student = self._get_or_404(student_id)

        if payload.student_id and payload.student_id != student.student_id:
            existing = student_crud.get_by_student_id(self.db, payload.student_id)
            if existing is not None and existing.id != student.id:
                raise ConflictError(
                    f"A student with student_id '{payload.student_id}' already exists"
                )

        if payload.email and payload.email != student.email:
            existing = student_crud.get_by_email(self.db, payload.email)
            if existing is not None and existing.id != student.id:
                raise ConflictError(f"A student with email '{payload.email}' already exists")

        updated = student_crud.update(self.db, student, payload)
        logger.info("Updated student %s", updated.student_id)
        return StudentResponse.model_validate(updated)

    def delete_student(self, student_id: str) -> None:
        student = self._get_or_404(student_id)
        student_crud.delete(self.db, student)
        logger.info("Deleted student %s", student_id)

    def delete_all_students(self) -> int:
        count = student_crud.delete_all(self.db)
        logger.info("Deleted all students (%s rows)", count)
        return count

    def get_dashboard_stats(self) -> DashboardStats:
        stats = student_crud.get_dashboard_stats(self.db)
        return DashboardStats(**stats)

    def _get_or_404(self, student_id: str) -> Student:
        student = student_crud.get_by_student_id(self.db, student_id)
        if student is None:
            raise NotFoundError(f"Student with student_id '{student_id}' was not found")
        return student
