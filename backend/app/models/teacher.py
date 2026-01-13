from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base

class Teacher(Base):
    __tablename__ = "teachers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id"))
    
    # Relationships
    user = relationship("User", backref="teacher_profile")
    department = relationship("Department", backref="teachers")
