import requests
import os
import random

BASE_URL = os.getenv("BASE_URL", "http://localhost:8000/api/v1")
EMAIL = "admin@example.com"
PASSWORD = "admin"


def get_token():
    url = f"{BASE_URL}/auth/access-token"
    # Needs form data
    data = {"username": EMAIL, "password": PASSWORD}
    resp = requests.post(url, data=data)
    if resp.status_code != 200:
        print("Login failed:", resp.text)
        return None
    return resp.json()["access_token"]


def reproduce():
    token = get_token()
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get a valid department
    dept_resp = requests.get(f"{BASE_URL}/departments/", headers=headers)
    print("Departments Response:", dept_resp.text)
    data = dept_resp.json()
    if isinstance(data, dict) and "items" in data:
        departments = data["items"]
    elif isinstance(data, list):
        departments = data
    else:
        departments = []

    if not departments:
        print("No departments found. Creating one...")
        # Create dummy faculty and department if needed (omitted for brevity, assuming exists)
        return

    valid_dept_id = departments[0]["id"]

    # 2. Try to create with INVALID Department ID
    print("\n--- Testing Invalid Department ID ---")
    payload_invalid_dept = {
        "name": f"Spec_{random.randint(1000,9999)}",
        "department_id": 999999,  # Unlikely to exist
        "education_type": "Bakalavr",
    }
    resp = requests.post(
        f"{BASE_URL}/specialities/", json=payload_invalid_dept, headers=headers
    )
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

    # 3. Try to create with DUPLICATE Name
    print("\n--- Testing Duplicate Name ---")
    # First create a valid one
    name = f"UniqueSpec_{random.randint(1000,9999)}"
    payload_valid = {
        "name": name,
        "department_id": valid_dept_id,
        "education_type": "Bakalavr",
    }
    requests.post(f"{BASE_URL}/specialities/", json=payload_valid, headers=headers)

    # Now try to create it AGAIN
    resp_dup = requests.post(
        f"{BASE_URL}/specialities/", json=payload_valid, headers=headers
    )
    print(f"Status: {resp_dup.status_code}")
    print(f"Response: {resp_dup.text}")

    # 4. Try Invalid Enum (Should be 422)
    print("\n--- Testing Invalid Enum ---")
    payload_enum = {
        "name": f"Spec_{random.randint(1000,9999)}",
        "department_id": valid_dept_id,
        "education_type": "PhD",  # Invalid
    }
    resp_enum = requests.post(
        f"{BASE_URL}/specialities/", json=payload_enum, headers=headers
    )
    print(f"Status: {resp_enum.status_code}")
    print(f"Response: {resp_enum.text}")


if __name__ == "__main__":
    reproduce()
