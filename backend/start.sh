#!/bin/sh
set -e

echo "⏳ Waiting for MongoDB to be ready..."
sleep 8

echo "🌱 Seeding database..."
python seed_data.py

echo "🚀 Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload