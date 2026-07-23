"""Health check endpoint used by Docker, Render, and uptime monitors."""
from fastapi import APIRouter, status
from sqlalchemy import text

from app.api.deps import DbSession
from app.core.config import get_settings
from app.schemas.common import HealthResponse

router = APIRouter(prefix="/api", tags=["Health"])
settings = get_settings()


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
)
def health_check(db: DbSession) -> HealthResponse:
    """Report application liveness and database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        database_status = "connected"
    except Exception:
        database_status = "unavailable"

    return HealthResponse(
        status="ok",
        database=database_status,
        version=settings.app_version,
        environment=settings.environment,
    )
