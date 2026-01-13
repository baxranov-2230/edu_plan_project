
import asyncio
import logging
import random
from app.db.session import SessionLocal
from app.models.speciality import Speciality, EducationType
from sqlalchemy import select
from app.models.department import Department

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

speciality_names = [
    "Software Engineering", "Computer Science", "Information Security",
    "Artificial Intelligence", "Data Science", "Cyber Security",
    "Telecommunications", "Radio Engineering", "Electronics",
    "Mobile Systems", "Web Development", "Cloud Computing",
    "Robotics", "Automation", "Mechatronics",
    "Economics in IT", "Digital Economy", "E-Commerce",
    "Business Analytics", "IT Management", "Project Management",
    "Multimedia Technologies", "Computer Graphics", "Game Design",
    "Network Engineering", "System Administration", "DevOps",
    "Database Administration", "Blockchain Technology", "IoT Systems"
]

async def create_specialities() -> None:
    async with SessionLocal() as db:
        logger.info("Starting seed...")
        
        # Get a department (assuming at least one exists from previous steps)
        result = await db.execute(select(Department))
        department = result.scalars().first()
        
        if not department:
            logger.error("No department found. Please create a department first.")
            return

        for name in speciality_names:
            # Check if exists
            exists = await db.execute(select(Speciality).where(Speciality.name == name))
            if exists.scalars().first():
                logger.info(f"Skipping {name}, already exists")
                continue
                
            edu_type = random.choice([EducationType.BACHELOR, EducationType.MASTER])
            
            speciality = Speciality(
                name=name,
                department_id=department.id,
                education_type=edu_type
            )
            db.add(speciality)
        
        await db.commit()
        logger.info("Seed completed.")

if __name__ == "__main__":
    asyncio.run(create_specialities())
