from typing import List, Dict

# Permission Constants
class Permissions:
    FACULTY_READ = "faculty:read"
    FACULTY_CREATE = "faculty:create"
    FACULTY_UPDATE = "faculty:update"
    FACULTY_DELETE = "faculty:delete"
    
    DEPARTMENT_READ = "department:read"
    DEPARTMENT_CREATE = "department:create"
    DEPARTMENT_UPDATE = "department:update"
    DEPARTMENT_DELETE = "department:delete"
    
    USER_READ = "user:read"
    USER_CREATE = "user:create"
    USER_UPDATE = "user:update"
    USER_DELETE = "user:delete"

    ROLE_READ = "role:read"
    ROLE_CREATE = "role:create"
    ROLE_UPDATE = "role:update"
    ROLE_DELETE = "role:delete"

# Role Mapping
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "student": [
        Permissions.FACULTY_READ,
        Permissions.DEPARTMENT_READ,
    ],
    "teacher": [
        Permissions.FACULTY_READ,
        Permissions.DEPARTMENT_READ,
        # Maybe add some course related permissions later
    ],
    "admin": [
        Permissions.FACULTY_READ,
        Permissions.FACULTY_CREATE,
        Permissions.FACULTY_UPDATE,
        Permissions.FACULTY_DELETE,
        Permissions.DEPARTMENT_READ,
        Permissions.DEPARTMENT_CREATE,
        Permissions.DEPARTMENT_UPDATE,
        Permissions.DEPARTMENT_DELETE,
        Permissions.USER_READ,
        Permissions.USER_CREATE,
        Permissions.USER_UPDATE,
        Permissions.USER_DELETE,
        Permissions.ROLE_READ,
        Permissions.ROLE_CREATE,
        Permissions.ROLE_UPDATE,
        Permissions.ROLE_DELETE,
    ]
}

def get_role_permissions(role: str) -> List[str]:
    return ROLE_PERMISSIONS.get(role, [])
