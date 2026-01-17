from sqlalchemy import String, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY
from app.db.base_class import Base
import enum


class SemesterType(str, enum.Enum):
    KUZGI = "kuzgi"
    BAHORGI = "bahorgi"


class Subject(Base):
    """
    Fan (Subject) modeli.
    O'quv rejasidagi fanlarni ifodalaydi.
    (Masalan: Matematika, Fizika).
    """

    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True)  # Subject name
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"))

    # New Fields
    credits: Mapped[int] = mapped_column(Integer, default=0)
    # Changed from single semester Enum to Array of Strings
    semesters: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)

    # Relationships
    department = relationship("Department", backref="subjects")
