from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base


class Subgroup(Base):
    """
    Guruhcha (Subgroup) modeli.
    Guruhni bo'lingan kichik qismlari (masalan, labaratoriya uchun).
    """

    __tablename__ = "subgroups"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)  # "1-guruhcha", "2-guruhcha"
    group_id: Mapped[int] = mapped_column(ForeignKey("groups.id"))
    student_count: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    group = relationship("Group", back_populates="subgroups")
    workloads = relationship("Workload", back_populates="subgroup")
