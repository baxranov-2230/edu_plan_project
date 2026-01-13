from typing import List
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base
from app.models.group import Group

class StreamGroup(Base):
    __tablename__ = "stream_groups"
    
    stream_id: Mapped[int] = mapped_column(ForeignKey("streams.id"), primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"), primary_key=True)

class Stream(Base):
    __tablename__ = "streams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    academic_year: Mapped[str] = mapped_column(String)  # e.g., "2025-2026"

    # Many-to-Many relationship with Group
    groups: Mapped[List["Group"]] = relationship(
        secondary="stream_groups",
        backref="streams"
    )
