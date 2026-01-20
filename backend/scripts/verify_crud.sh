#!/bin/bash

# Load env vars from ../.env if it exists
if [ -f "$(dirname "$0")/../.env" ]; then
    export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

BASE_URL=${BASE_URL:-"http://localhost:8000/api/v1"}
EMAIL="admin@example.com"
PASSWORD="admin"

echo "1. Login..."
TOKEN=$(curl -s -X POST "$BASE_URL/auth/access-token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=$EMAIL&password=$PASSWORD" | jq -r '.access_token')

if [ "$TOKEN" == "null" ]; then
  echo "Login failed"
  exit 1
fi
echo "Token received"

echo "2. Create Faculty..."
FACULTY_ID=$(curl -s -X POST "$BASE_URL/faculties/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "IT Faculty", "description": "Information Technology"}' | jq -r '.id')
echo "Faculty ID: $FACULTY_ID"

echo "3. Create Department..."
DEPT_ID=$(curl -s -X POST "$BASE_URL/departments/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Computer Science\", \"faculty_id\": $FACULTY_ID}" | jq -r '.id')
echo "Department ID: $DEPT_ID"

echo "4. Create Speciality..."
curl -s -X POST "$BASE_URL/specialities/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Software Engineering\", \"department_id\": $DEPT_ID, \"education_type\": \"Bakalavr\"}" | jq
