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

    GROUP_READ = "group:read"
    GROUP_CREATE = "group:create"
    GROUP_UPDATE = "group:update"
    GROUP_DELETE = "group:delete"

    ROLE_READ = "role:read"
    ROLE_CREATE = "role:create"
    ROLE_UPDATE = "role:update"
    ROLE_DELETE = "role:delete"

    SUBJECT_READ = "subject:read"
    SUBJECT_CREATE = "subject:create"
    SUBJECT_UPDATE = "subject:update"
    SUBJECT_DELETE = "subject:delete"

    EDUPLAN_READ = "eduplan:read"
    EDUPLAN_CREATE = "eduplan:create"
    EDUPLAN_UPDATE = "eduplan:update"
    EDUPLAN_DELETE = "eduplan:delete"

    STREAM_READ = "stream:read"
    STREAM_CREATE = "stream:create"
    STREAM_UPDATE = "stream:update"
    STREAM_DELETE = "stream:delete"

    SPECIALITY_READ = "speciality:read"
    SPECIALITY_CREATE = "speciality:create"
    SPECIALITY_UPDATE = "speciality:update"
    SPECIALITY_DELETE = "speciality:delete"


# Role Mapping
ROLE_PERMISSIONS: Dict[str, List[str]] = {
    "student": [
        Permissions.FACULTY_READ,
        Permissions.DEPARTMENT_READ,
        Permissions.SPECIALITY_READ,
        Permissions.GROUP_READ,
        Permissions.SUBJECT_READ,
        Permissions.EDUPLAN_READ,
        Permissions.STREAM_READ,
    ],
    "teacher": [
        Permissions.FACULTY_READ,
        Permissions.DEPARTMENT_READ,
        Permissions.SPECIALITY_READ,
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
        Permissions.SPECIALITY_READ,
        Permissions.SPECIALITY_CREATE,
        Permissions.SPECIALITY_UPDATE,
        Permissions.SPECIALITY_DELETE,
        Permissions.GROUP_READ,
        Permissions.GROUP_CREATE,
        Permissions.GROUP_UPDATE,
        Permissions.GROUP_DELETE,
        Permissions.SUBJECT_READ,
        Permissions.SUBJECT_CREATE,
        Permissions.SUBJECT_UPDATE,
        Permissions.SUBJECT_DELETE,
        Permissions.EDUPLAN_READ,
        Permissions.EDUPLAN_CREATE,
        Permissions.EDUPLAN_UPDATE,
        Permissions.EDUPLAN_DELETE,
        Permissions.STREAM_READ,
        Permissions.STREAM_CREATE,
        Permissions.STREAM_UPDATE,
        Permissions.STREAM_DELETE,
    ],
}


def get_role_permissions(roles: str | List[str]) -> List[str]:
    if isinstance(roles, str):
        return ROLE_PERMISSIONS.get(roles, [])

    # If list, merge unique permissions
    permissions = set()
    for role in roles:
        role_perms = ROLE_PERMISSIONS.get(role, [])
        permissions.update(role_perms)
    return list(permissions)
