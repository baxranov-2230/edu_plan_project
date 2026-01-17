from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Department(Base):
    """
    Kafedra modeli.
    Fakultet tarkibidagi kafedralarni ifodalaydi.
    boshqa jadvallar (teachers, specialities) bilan bog'langan.
    """

    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id"), index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    description: Mapped[str | None] = mapped_column(nullable=True)

    # Optional: Relationship back to Faculty if needed
    # Relationships
    specialities = relationship("Speciality", back_populates="department")
