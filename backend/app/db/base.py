from app.db.session import engine
from app.db.base_class import Base
from app.models.user import User
from app.models.faculty import Faculty
from app.models.department import Department
from app.models.speciality import Speciality
from app.models.role import Role, Permission
from app.models.group import Group
from app.models.teacher import Teacher
from app.models.subject import Subject
from app.models.stream import Stream, StreamGroup
from app.models.subgroup import Subgroup
from app.models.workload import Workload
from app.models.edu_plan import EduPlan
