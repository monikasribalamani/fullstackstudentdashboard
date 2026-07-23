"""HTTP routes for the Student resource."""
from typing import Optional

from fastapi import APIRouter, Query, status

from app.api.deps import DbSession
from app.schemas.common import MessageResponse
from app.schemas.student import (
    DashboardStats,
    StudentCreate,
    StudentListResponse,
    StudentResponse,
    StudentUpdate,
)
from app.services.student_service import StudentService

router = APIRouter(prefix="/api/students", tags=["Students"])


@router.get(
    "",
    response_model=StudentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List all students",
)
def list_students(
    db: DbSession,
    search: Optional[str] = Query(default=None, description="Search by name, student_id, or email"),
    department: Optional[str] = Query(default=None, description="Filter by department"),
    status_filter: Optional[str] = Query(
        default=None, alias="status", description="Filter by status (active | inactive)"
    ),
    sort_by: str = Query(default="created_at", description="Field to sort by"),
    sort_order: str = Query(default="desc", description="Sort order: asc | desc"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=10, ge=1, le=100, description="Items per page"),
) -> StudentListResponse:
    """Return a paginated, filterable, sortable list of students."""
    service = StudentService(db)
    return service.list_students(
        search=search,
        department=department,
        status_filter=status_filter,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/stats",
    response_model=DashboardStats,
    status_code=status.HTTP_200_OK,
    summary="Get dashboard aggregate statistics",
)
def get_dashboard_stats(db: DbSession) -> DashboardStats:
    """Return total/active/inactive counts and average CGPA."""
    service = StudentService(db)
    return service.get_dashboard_stats()


@router.get(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
    summary="Get a student by student_id",
)
def get_student(student_id: str, db: DbSession) -> StudentResponse:
    """Return a single student identified by their human-readable student_id."""
    service = StudentService(db)
    return service.get_student(student_id)


@router.post(
    "",
    response_model=StudentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new student",
)
def create_student(payload: StudentCreate, db: DbSession) -> StudentResponse:
    """Create a new student record."""
    service = StudentService(db)
    return service.create_student(payload)


@router.put(
    "/{student_id}",
    response_model=StudentResponse,
    status_code=status.HTTP_200_OK,
    summary="Update an existing student",
)
def update_student(student_id: str, payload: StudentUpdate, db: DbSession) -> StudentResponse:
    """Update one or more fields of an existing student."""
    service = StudentService(db)
    return service.update_student(student_id, payload)


@router.delete(
    "/all",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete all students",
)
def delete_all_students(db: DbSession) -> MessageResponse:
    """Delete every student record. Intended to be used behind a confirmation dialog."""
    service = StudentService(db)
    count = service.delete_all_students()
    return MessageResponse(message=f"Deleted {count} student(s) successfully")


@router.delete(
    "/{student_id}",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Delete a student",
)
def delete_student(student_id: str, db: DbSession) -> MessageResponse:
    """Delete a single student identified by their student_id."""
    service = StudentService(db)
    service.delete_student(student_id)
    return MessageResponse(message=f"Student '{student_id}' deleted successfully")
