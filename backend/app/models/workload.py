from enum import Enum
from typing import Optional
from sqlalchemy import Integer, String, ForeignKey, Enum as SaEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class LoadType(str, Enum):
    LECTURE = "lecture"  # Ma'ruza (Potok)
    PRACTICE = "practice"  # Amaliyot (Guruh)
    LAB = "lab"  # Laboratoriya (Guruhcha)
    SEMINAR = "seminar"


class Workload(Base):
    """
    Yuklama (Workload) modeli.
    Fan, o'qituvchi va guruh/oqim o'rtasidagi dars soatlarini taqsimlashni ifodalaydi.
    """

    __tablename__ = "workloads"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Optional name/description for this workload entry (e.g. "Fall 2024 Math")
    name: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # 1. NIMA O'TILADI? (O'quv rejadagi fanga bog'lanadi)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id"))

    # 2. DARS TURI
    load_type: Mapped[LoadType] = mapped_column(SaEnum(LoadType))

    # 3. KIMGA O'TILADI? (Primary Target based on Load Type)
    stream_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("streams.id"), nullable=True
    )
    group_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("groups.id"), nullable=True
    )
    subgroup_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("subgroups.id"), nullable=True
    )

    # 4. O'QUV REJA (Optional, if grouping is used)
    edu_plan_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("edu_plans.id"), nullable=True
    )

    # 5. SOAT
    hours: Mapped[int] = mapped_column(Integer)

    # Relationships
    subject = relationship("Subject", backref="workloads")
    edu_plan = relationship("EduPlan", back_populates="workloads")

    stream = relationship("Stream", backref="workloads")
    group = relationship("Group", backref="workloads")
    subgroup = relationship("Subgroup", back_populates="workloads")
