"""Common, reusable response schemas."""
from typing import Any, Optional

from pydantic import BaseModel


class MessageResponse(BaseModel):
    """Generic success message envelope."""

    success: bool = True
    message: str
    details: Optional[Any] = None


class HealthResponse(BaseModel):
    """Response body for the health check endpoint."""

    status: str
    database: str
    version: str
    environment: str
