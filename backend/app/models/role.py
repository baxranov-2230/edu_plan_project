from typing import List
from sqlalchemy import String, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

# Association Table
role_permissions = Table(
    "role_permissions",
    Base.metadata,
    Column("role_id", ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    Column(
        "permission_id",
        ForeignKey("permissions.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class Permission(Base):
    """
    Ruxsatnoma (Permission) modeli.
    Tizimdagi har bir amal uchun ruxsatnomani belgilaydi (masalan: 'faculty:create').
    """

    __tablename__ = "permissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(
        String, unique=True, index=True
    )  # e.g. "faculty:create"
    description: Mapped[str] = mapped_column(String, nullable=True)


class Role(Base):
    """
    Rol (Role) modeli.
    Foydalanuvchi rollarini (admin, teacher va h.k) ifodalaydi.
    Har bir rolga bir nechta ruxsatnomalar biriktirilgan bo'lishi mumkin.
    """

    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String, unique=True, index=True)  # e.g. "admin"
    description: Mapped[str] = mapped_column(String, nullable=True)

    # Relationship to permissions
    permissions: Mapped[List["Permission"]] = relationship(
        secondary=role_permissions, lazy="selectin"
    )
