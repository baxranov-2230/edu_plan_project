import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import asyncio
import logging
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from sqlalchemy import text
from app.models.user import User
from app.models.role import Role, Permission
from app.models.department import Department
from app.models.faculty import Faculty

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.db.base_class import Base
from app.db.session import engine

from app.core.rbac import ROLE_PERMISSIONS

"""
Ushbu skript ma'lumotlar bazasidagi ruxsatnomalar (permissions) va rollarni (roles) tekshiradi va to'g'irlaydi.
Shuningdek, Super Admin foydalanuvchisini parolini tiklaydi va unga admin rolini biriktiradi.
"""


async def fix_data():
    """
    Asosiy funksiya:
    1. Barcha ruxsatnomalar bazada mavjudligini tekshiradi va yo'q bo'lsa yaratadi.
    2. Barcha rollar (admin, teacher, student, department_head) mavjudligini tekshiradi.
    3. Rollarga tegishli ruxsatnomalarni biriktiradi.
    4. Super Admin parolini 'admin' ga o'zgartiradi yoki yangi Super Admin yaratadi.
    5. Super Admin ga 'admin' rolini beradi.
    """
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as db:
        logger.info("Checking Roles and Permissions...")

        # 1. Ensure Permissions Exist
        all_permissions = set()
        for perms in ROLE_PERMISSIONS.values():
            all_permissions.update(perms)

        perm_map = {}  # slug -> id
        for slug in all_permissions:
            result = await db.execute(
                text("SELECT id FROM permissions WHERE slug = :slug"), {"slug": slug}
            )
            perm_row = result.first()
            if not perm_row:
                logger.info(f"Creating permission: {slug}")
                res = await db.execute(
                    text(
                        "INSERT INTO permissions (slug, description) VALUES (:slug, :desc) RETURNING id"
                    ),
                    {"slug": slug, "desc": slug},
                )
                perm_id = res.scalar()
            else:
                perm_id = perm_row[0]
            perm_map[slug] = perm_id

        # 2. Ensure Roles Exist and Link Permissions
        for role_name in ["admin", "teacher", "student", "department_head"]:
            result = await db.execute(
                text("SELECT id FROM roles WHERE name = :name"), {"name": role_name}
            )
            role_row = result.first()
            if not role_row:
                logger.info(f"Creating role: {role_name}")
                res = await db.execute(
                    text(
                        "INSERT INTO roles (name, description) VALUES (:name, :desc) RETURNING id"
                    ),
                    {"name": role_name, "desc": f"{role_name} role"},
                )
                role_id = res.scalar()
            else:
                role_id = role_row[0]

            # Link permissions
            role_perms_slugs = ROLE_PERMISSIONS.get(role_name, [])
            for slug in role_perms_slugs:
                perm_id = perm_map.get(slug)
                if perm_id:
                    # Check link
                    link_res = await db.execute(
                        text(
                            "SELECT 1 FROM role_permissions WHERE role_id=:rid AND permission_id=:pid"
                        ),
                        {"rid": role_id, "pid": perm_id},
                    )
                    if not link_res.scalar():
                        await db.execute(
                            text(
                                "INSERT INTO role_permissions (role_id, permission_id) VALUES (:rid, :pid)"
                            ),
                            {"rid": role_id, "pid": perm_id},
                        )
                        logger.info(f"Linked {slug} to {role_name}")

        await db.commit()

        # 2. Reset Super Admin Password
        email = "super_admin@gmail.com"
        new_password = "admin"
        hashed = get_password_hash(new_password)

        logger.info(f"Resetting password for {email} to '{new_password}'")

        # Check if user exists
        stmt = text("SELECT id FROM users WHERE email = :email")
        result = await db.execute(stmt, {"email": email})
        user = result.first()

        user_id = None
        if user:
            user_id = user[0]
            # Update password
            update_stmt = text(
                "UPDATE users SET hashed_password = :pwd WHERE email = :email"
            )
            await db.execute(update_stmt, {"pwd": hashed, "email": email})
            logger.info("Password updated successfully.")
        else:
            logger.warning(f"User {email} not found! Creating it.")
            # Create if not exists (simplified)
            # Remove role column
            insert_stmt = text(
                """
                INSERT INTO users (email, hashed_password, name, is_active, is_superuser)
                VALUES (:email, :pwd, 'Super Admin', true, true) RETURNING id
            """
            )
            result = await db.execute(insert_stmt, {"email": email, "pwd": hashed})
            user_id = result.scalar()
            logger.info(f"User created with ID {user_id}")

        # 3. Assign Admin Role to Super Admin
        if user_id:
            # Find admin role id
            role_project = await db.execute(
                text("SELECT id FROM roles WHERE name = 'admin'")
            )
            role_id = role_project.scalar()

            # Check if link exists
            link_exists = await db.execute(
                text(
                    "SELECT 1 FROM user_roles WHERE user_id = :uid AND role_id = :rid"
                ),
                {"uid": user_id, "rid": role_id},
            )
            if not link_exists.scalar():
                await db.execute(
                    text(
                        "INSERT INTO user_roles (user_id, role_id) VALUES (:uid, :rid)"
                    ),
                    {"uid": user_id, "rid": role_id},
                )
                logger.info("Assigned admin role to user.")

        await db.commit()
        logger.info("Done.")


if __name__ == "__main__":
    asyncio.run(fix_data())
