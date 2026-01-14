"""rename_curriculum_to_subject

Revision ID: 6c818e6aaa47
Revises: 41af8eb2afb2
Create Date: 2026-01-14 06:02:09.951614

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6c818e6aaa47"
down_revision: Union[str, Sequence[str], None] = "41af8eb2afb2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename table
    op.rename_table("curriculums", "subjects")
    
    # Rename column in workloads
    op.alter_column("workloads", "curriculum_id", new_column_name="subject_id")
    
    # Drop old FK
    op.drop_constraint("workloads_curriculum_id_fkey", "workloads", type_="foreignkey")
    
    # Create new FK
    op.create_foreign_key("workloads_subject_id_fkey", "workloads", "subjects", ["subject_id"], ["id"])


def downgrade() -> None:
    """Downgrade schema."""
    # Drop new FK
    op.drop_constraint("workloads_subject_id_fkey", "workloads", type_="foreignkey")
    
    # Rename column back
    op.alter_column("workloads", "subject_id", new_column_name="curriculum_id")
    
    # Create old FK
    op.create_foreign_key("workloads_curriculum_id_fkey", "workloads", "curriculums", ["curriculum_id"], ["id"])
    
    # Rename table back
    op.rename_table("subjects", "curriculums")
