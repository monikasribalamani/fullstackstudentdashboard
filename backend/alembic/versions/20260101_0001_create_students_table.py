"""create students table

Revision ID: 0001
Revises:
Create Date: 2026-01-01 00:00:01

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "students",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
        ),
        sa.Column("student_id", sa.String(length=50), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("department", sa.String(length=100), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("cgpa", sa.Numeric(4, 2), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="active"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.CheckConstraint("cgpa >= 0 AND cgpa <= 10", name="ck_students_cgpa_range"),
        sa.CheckConstraint("year >= 1 AND year <= 6", name="ck_students_year_range"),
        sa.CheckConstraint("status IN ('active', 'inactive')", name="ck_students_status_values"),
    )
    op.create_index("ix_students_student_id", "students", ["student_id"], unique=True)
    op.create_index("ix_students_email", "students", ["email"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_students_email", table_name="students")
    op.drop_index("ix_students_student_id", table_name="students")
    op.drop_table("students")
