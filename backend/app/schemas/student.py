"""Pydantic schemas for Student request/response validation."""
import re
import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

PHONE_REGEX = re.compile(r"^\+?[0-9]{7,15}$")
STUDENT_ID_REGEX = re.compile(r"^[A-Za-z0-9-]{3,50}$")


class StudentStatus(str, Enum):
    """Allowed lifecycle states for a student."""

    ACTIVE = "active"
    INACTIVE = "inactive"


class StudentBase(BaseModel):
    """Fields shared by create and update payloads."""

    student_id: str = Field(..., min_length=3, max_length=50, examples=["STU2024001"])
    name: str = Field(..., min_length=2, max_length=150, examples=["Jane Doe"])
    email: EmailStr = Field(..., examples=["jane.doe@example.com"])
    phone: str = Field(..., examples=["+1234567890"])
    department: str = Field(..., min_length=2, max_length=100, examples=["Computer Science"])
    year: int = Field(..., ge=1, le=6, examples=[2])
    cgpa: float = Field(..., ge=0, le=10, examples=[8.75])
    status: StudentStatus = Field(default=StudentStatus.ACTIVE)

    @field_validator("student_id")
    @classmethod
    def validate_student_id(cls, value: str) -> str:
        if not STUDENT_ID_REGEX.match(value):
            raise ValueError(
                "student_id must be 3-50 characters and contain only letters, digits, or hyphens"
            )
        return value.upper()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not PHONE_REGEX.match(value):
            raise ValueError(
                "phone must contain 7-15 digits and may start with a '+' (e.g. +1234567890)"
            )
        return value

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("name must not be empty")
        return stripped

    @field_validator("department")
    @classmethod
    def validate_department(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("department must not be empty")
        return stripped


class StudentCreate(StudentBase):
    """Payload for creating a new student."""


class StudentUpdate(BaseModel):
    """Payload for updating an existing student. All fields are optional."""

    student_id: Optional[str] = Field(default=None, min_length=3, max_length=50)
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    department: Optional[str] = Field(default=None, min_length=2, max_length=100)
    year: Optional[int] = Field(default=None, ge=1, le=6)
    cgpa: Optional[float] = Field(default=None, ge=0, le=10)
    status: Optional[StudentStatus] = None

    @field_validator("student_id")
    @classmethod
    def validate_student_id(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        if not STUDENT_ID_REGEX.match(value):
            raise ValueError(
                "student_id must be 3-50 characters and contain only letters, digits, or hyphens"
            )
        return value.upper()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        if not PHONE_REGEX.match(value):
            raise ValueError(
                "phone must contain 7-15 digits and may start with a '+' (e.g. +1234567890)"
            )
        return value

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("name must not be empty")
        return stripped

    @field_validator("department")
    @classmethod
    def validate_department(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return value
        stripped = value.strip()
        if not stripped:
            raise ValueError("department must not be empty")
        return stripped


class StudentResponse(StudentBase):
    """Full student representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class StudentListResponse(BaseModel):
    """Paginated list of students."""

    items: List[StudentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class DashboardStats(BaseModel):
    """Aggregate statistics for the dashboard cards."""

    total_students: int
    active_students: int
    inactive_students: int
    average_cgpa: float
