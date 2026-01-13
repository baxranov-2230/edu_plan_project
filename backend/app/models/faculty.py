from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base

class Faculty(Base):
    __tablename__ = "faculties"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(unique=True, index=True)
    description: Mapped[str | None] = mapped_column(nullable=True)
