from typing import List
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Table, Column, ForeignKey
from app.db.base_class import Base

# Association Table for User-Roles
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
)
from sqlalchemy import ForeignKey


class User(Base):
    """
    Foydalanuvchi modeli.
    Tizimdagi barcha foydalanuvchilar (admin, o'qituvchi, talaba) uchun umumiy model.
    Rollar (Roles) orqali huquqlari belgilanadi.
    """

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    name: Mapped[str | None] = mapped_column(nullable=True)
    hashed_password: Mapped[str] = mapped_column()
    is_active: Mapped[bool] = mapped_column(default=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    # role column removed, using relationship below

    # New fields
    passport_series: Mapped[str | None] = mapped_column(nullable=True)
    jshshir: Mapped[str | None] = mapped_column(unique=True, index=True, nullable=True)
    username: Mapped[str | None] = mapped_column(unique=True, index=True, nullable=True)
    phone_number: Mapped[str | None] = mapped_column(nullable=True)

    department_id: Mapped[int | None] = mapped_column(
        ForeignKey("departments.id"), nullable=True
    )

    # Relationship to roles
    roles: Mapped[List["Role"]] = relationship(
        "Role", secondary=user_roles, lazy="selectin"
    )
