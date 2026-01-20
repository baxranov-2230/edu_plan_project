"""
Ro'yxatdan o'tish (register), login qilish va ma'lumot olishni to'liq tekshiruvchi skript.
"""

import requests
import time

import os

base_url = os.getenv("BASE_URL", "http://localhost:8000/api/v1")
email = f"verifier_{int(time.time())}@example.com"
password = "testpassword123"

# 1. Register
print(f"Registering user {email}...")
register_url = f"{base_url}/auth/register"
register_data = {"email": email, "password": password, "name": "Verifier User"}
resp = requests.post(register_url, json=register_data)
if resp.status_code not in [200, 201]:
    print(f"Registration failed: {resp.status_code}")
    print(resp.text)
    # exit(1) # Continue just in case user already exists

# 2. Login
print("Logging in...")
login_url = f"{base_url}/auth/access-token"
login_data = {"username": email, "password": password}
resp = requests.post(login_url, data=login_data)
if resp.status_code != 200:
    print(f"Login failed: {resp.status_code}")
    print(resp.text)
    exit(1)

token = resp.json()["access_token"]
print("Login successful.")

# 3. Check Token Subject (Subject should be ID now, checking locally via decoding is complex without lib, so relying on API call)

# 4. Fetch Faculties
print("Fetching faculties...")
faculties_url = f"{base_url}/faculties/"
headers = {"Authorization": f"Bearer {token}"}
resp = requests.get(faculties_url, headers=headers)

if resp.status_code == 200:
    print("Success! Faculties fetched.")
    print(resp.json())
else:
    print(f"Failed to fetch faculties: {resp.status_code}")
    print(resp.text)
