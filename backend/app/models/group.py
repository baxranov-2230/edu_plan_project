from typing import List, Optional
import enum
from sqlalchemy import String, Integer, ForeignKey, Boolean, Enum as SqEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class EducationShape(str, enum.Enum):
    KUNDUZGI = "kunduzgi"
    KECHKI = "kechki"
    SIRTQI = "sirtqi"
    MASOFAVIY = "masofaviy"


class Group(Base):
    """
    Guruh modeli.
    Talabalar guruhini ifodalaydi.
    Guruh ma'lum bir yo'nalishga, ta'lim shakliga va kursga tegishli bo'ladi.
    """

    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)
    speciality_id: Mapped[int] = mapped_column(ForeignKey("specialities.id"))

    # Optional: Course number
    course: Mapped[int] = mapped_column(Integer, default=1)

    # New fields
    student_count: Mapped[int] = mapped_column(Integer, default=0)
    education_shape: Mapped[EducationShape] = mapped_column(
        String, default=EducationShape.KUNDUZGI
    )

    # Lab Split Flag
    he_lab_split: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    speciality = relationship("Speciality", backref="groups")
    subgroups = relationship("Subgroup", back_populates="group")
    # stream_groups relationship will be defined in StreamGroup or via backref
