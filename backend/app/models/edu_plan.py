from sqlalchemy import String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base

class EduPlan(Base):
    __tablename__ = "edu_plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, index=True) # e.g., "2023-2024 O'quv Rejasi"
    speciality_id: Mapped[int] = mapped_column(ForeignKey("specialities.id"))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    speciality = relationship("Speciality", backref="edu_plans", lazy="selectin")
    workloads = relationship("Workload", back_populates="edu_plan")
