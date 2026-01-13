import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import SessionLocal
from app.models.role import Role, Permission
from app.core.rbac import Permissions, ROLE_PERMISSIONS

from sqlalchemy.orm import selectinload

async def seed_data():
    async with SessionLocal() as db:
        # ... (permissions seeding same as before) ...
        # 1. Seed Permissions
        print("Seeding permissions...")
        all_permissions = set()
        for role, perms in ROLE_PERMISSIONS.items():
            for perm in perms:
                all_permissions.add(perm)
        
        db_perms = {}
        for perm_slug in all_permissions:
            stmt = select(Permission).where(Permission.slug == perm_slug)
            result = await db.execute(stmt)
            existing_perm = result.scalar_one_or_none()
            
            if not existing_perm:
                new_perm = Permission(slug=perm_slug, description=f"Permission for {perm_slug}")
                db.add(new_perm)
                await db.flush() # get ID
                db_perms[perm_slug] = new_perm
                print(f"Created permission: {perm_slug}")
            else:
                db_perms[perm_slug] = existing_perm

        # 2. Seed Roles
        print("Seeding roles...")
        for role_name, perm_slugs in ROLE_PERMISSIONS.items():
            # Eagerly load permissions to avoid MissingGreenlet
            stmt = select(Role).options(selectinload(Role.permissions)).where(Role.name == role_name)
            result = await db.execute(stmt)
            existing_role = result.scalar_one_or_none()
            
            if not existing_role:
                new_role = Role(name=role_name, description=f"Default role {role_name}")
                db.add(new_role)
                await db.flush()
                # Re-fetch with eager load to ensure permissions are bound and to avoid MissingGreenlet
                result = await db.execute(stmt)
                existing_role = result.scalar_one()
                print(f"Created role: {role_name}")
            
            # Prepare permission objects
            role_perms = []
            for slug in perm_slugs:
                if slug in db_perms:
                    role_perms.append(db_perms[slug])
            
            # Update permissions
            existing_role.permissions = role_perms
            print(f"Updated permissions for role: {role_name}")

        await db.commit()
        print("Seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed_data())
