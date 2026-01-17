from enum import Enum
from sqlalchemy import ForeignKey, String, Enum as SaEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class EducationType(str, Enum):
    BACHELOR = "Bakalavr"
    MASTER = "Magistr"


class Speciality(Base):
    """
    Yo'nalish (Mutaxassislik) modeli.
    Universitetdagi ta'lim yo'nalishlarini ifodalaydi.
    """

    __tablename__ = "specialities"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"))
    education_type: Mapped[EducationType] = mapped_column(SaEnum(EducationType))

    # Relationships
    department = relationship("Department", back_populates="specialities")
