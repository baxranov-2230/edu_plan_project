"""
API orqali login qilish va fakultetlar ro'yxatini olishni tekshiruvchi oddiy skript.
"""

import requests

# 1. Login to get a FRESH token
login_url = "http://localhost:8000/api/v1/auth/access-token"
login_data = {"username": "admin@gmail.com", "password": "adminpassword"}

print("Attempting to login...")
response = requests.post(login_url, data=login_data)

if response.status_code != 200:
    print(f"Login failed: {response.status_code}")
    print(response.text)
    exit(1)

token = response.json()["access_token"]
print("Login successful. Got new token.")

# 2. Use the token to fetch faculties
faculties_url = "http://localhost:8000/api/v1/faculties/"
headers = {"Authorization": f"Bearer {token}"}

print("Attempting to fetch faculties...")
response = requests.get(faculties_url, headers=headers)

if response.status_code == 200:
    print("Success! Faculties fetched.")
    print(response.json())
else:
    print(f"Failed to fetch faculties: {response.status_code}")
    print(response.text)
