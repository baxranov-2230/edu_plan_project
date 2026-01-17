import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import asyncio
import json
import logging
import random
import urllib.request
import urllib.error
import urllib.parse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/api/v1"


def make_request(method, url, data=None):
    headers = {"Content-Type": "application/json"}
    if data:
        data_json = json.dumps(data).encode("utf-8")
    else:
        data_json = None

    req = urllib.request.Request(url, data=data_json, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_body = response.read().decode("utf-8")
            return status_code, json.loads(response_body)
    except urllib.error.HTTPError as e:
        logger.error(f"HTTP Error: {e.code} - {e.reason}")
        error_body = e.read().decode("utf-8")
        logger.error(f"Body: {error_body}")
        return e.code, json.loads(error_body) if error_body else {}
    except Exception as e:
        logger.error(f"Request failed: {e}")
        return 0, {}


"""
Ushbu skript foydalanuvchi oqimini (User Flow) tekshirish uchun ishlatiladi:
Ro'yxatdan o'tish, login qilish, ma'lumotlarni yangilash va rollarni tekshirish.
"""


async def verify_user_flow():
    """
    Foydalanuvchi oqimini tekshirish funksiyasi:
    1. Super Admin sifatida login qiladi.
    2. Yangi foydalanuvchi yaratadi.
    3. Rollar va ma'lumotlar to'g'riligini tekshiradi.
    4. Foydalanuvchi sifatida login qilib ko'radi.
    5. Foydalanuvchi ma'lumotlarini o'zgartirib tekshiradi.
    """
    # 0. Login as Super Admin to get token
    admin_login_data = urllib.parse.urlencode(
        {"username": "super_admin@gmail.com", "password": "admin"}
    ).encode("utf-8")

    logger.info("Logging in as Super Admin...")
    login_req = urllib.request.Request(
        f"{BASE_URL}/auth/access-token",
        data=admin_login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )

    token = None
    try:
        with urllib.request.urlopen(login_req) as response:
            data = json.loads(response.read().decode("utf-8"))
            token = data["access_token"]
            logger.info("Super Admin logged in.")
    except Exception as e:
        logger.error(f"Super Admin login failed: {e}")
        return

    # 1. Create User with new fields
    rand_id = random.randint(10000, 99999)
    email = f"user_{rand_id}@example.com"
    passport = f"AA{rand_id}"
    jshshir = f"1234567890{rand_id}"

    user_payload = {
        "email": email,
        "passport_series": passport,
        "jshshir": jshshir,
        "phone_number": "+998901234567",
        "name": "Multi Role User",
        "roles": ["student", "teacher"],
    }

    logger.info(f"Creating user with payload: {user_payload}")

    # Update make_request to accept token
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    data_json = json.dumps(user_payload).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE_URL}/users/", data=data_json, headers=headers, method="POST"
    )

    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            user_data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        logger.error(
            f"Failed to create user. Status: {e.code} Body: {e.read().decode('utf-8')}"
        )
        return

    logger.info(f"User created: {user_data}")

    # Verify roles
    created_roles = [r["name"] for r in user_data.get("roles", [])]
    if "student" not in created_roles or "teacher" not in created_roles:
        logger.error(
            f"Roles mismatch! Expected ['student', 'teacher'], got {created_roles}"
        )
        return

    # Verify default assumption: password=passport, username=jshshir
    if user_data.get("username") != jshshir:
        logger.error(f"Username mismatch: {user_data.get('username')} != {jshshir}")
        return
    if user_data.get("passport_series") != passport:
        logger.error(
            f"Passport mismatch: {user_data.get('passport_series')} != {passport}"
        )
        return

    user_id = user_data["id"]

    # 2. Login to verify password (logic check only, assuming endpoint exists)
    # The endpoint is /auth/access-token and it expects FORM data, NOT JSON.
    # We need to send form-urlencoded data.
    login_data = urllib.parse.urlencode(
        {"username": email, "password": passport}
    ).encode("utf-8")

    logger.info(f"Attempting login with default password (passport series)")
    login_req = urllib.request.Request(
        f"{BASE_URL}/auth/access-token",
        data=login_data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(login_req) as response:
            logger.info("Login successful with default credentials!")
            # token = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        logger.error(f"Login failed: {e.code} - {e.read().decode('utf-8')}")
        return

    # 3. Update User Department
    update_payload = {"phone_number": "+998907654321"}

    logger.info(f"Updating user {user_id} with {update_payload}")
    status, updated_data = make_request(
        "PATCH", f"{BASE_URL}/users/{user_id}", update_payload
    )

    if status != 200:
        logger.error(f"Failed to update user: {updated_data}")
    else:
        logger.info(f"Update successful: {updated_data}")
        if updated_data["phone_number"] == "+998907654321":
            logger.info("Verification Passed: Phone number updated.")
        else:
            logger.error("Verification Failed: Phone number not updated.")


if __name__ == "__main__":
    asyncio.run(verify_user_flow())
