
import asyncio
import logging
import sys
import os

# Add the parent directory to sys.path to allow imports from app
sys.path.append(os.getcwd())

from app.db.session import SessionLocal
from sqlalchemy import text, select
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.speciality import Speciality, EducationType
from app.models.group import Group, EducationShape
from app.models.subgroup import Subgroup
from app.models.workload import Workload
from app.models.stream import Stream
from app.models.teacher import Teacher
from app.models.user import User
from app.models.role import Role
from app.models.subject import Subject

# ... (imports)

async def populate_db():
    async with SessionLocal() as db:
        # ... (other code)

        # 5. Create Subjects
        subjects_data = [
            {
                "name": "Algoritmlar va Ma'lumotlar Tuzilmasi",
                "department_id": se_dept.id,
                "credits": 6,
                "semesters": ["3"]
            },
            {
                "name": "Veb Dasturlash",
                "department_id": se_dept.id,
                "credits": 5,
                "semesters": ["4"]
            },
            {
                "name": "Mashinali O'qitish Asoslari",
                "department_id": ai_dept.id,
                "credits": 6,
                "semesters": ["1"]
            }
        ]

        for subj_data in subjects_data:
            stmt = select(Subject).where(Subject.name == subj_data["name"])
            result = await db.execute(stmt)
            subj = result.scalar_one_or_none()
            
            if not subj:
                subj = Subject(**subj_data)
                db.add(subj)
                await db.commit()
                await db.refresh(subj)
                logger.info(f"Created Subject: {subj.name} (ID: {subj.id})")
            else:
                logger.info(f"Subject already exists: {subj.name}")

        logger.info("Database population completed successfully!")

if __name__ == "__main__":
    asyncio.run(populate_db())
