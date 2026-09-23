# 🏎️ F1 Telemetry Dashboard

A full-stack Formula 1 data dashboard built as a portfolio project. Displays race results, championship standings, driver stats, and head-to-head comparisons for the 2023 F1 season.

![Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Stack](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi)
![Stack](https://img.shields.io/badge/MongoDB-7-47A248?style=flat&logo=mongodb)
![Stack](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)

---

## Features

- **Dashboard** — Championship standings table, race calendar, points bar chart
- **Race Details** — Full results table, fastest lap, avg lap time comparison chart
- **Driver Comparison** — Head-to-head stats, cumulative points line chart, race-by-race breakdown

---

## Tech Stack

| Layer     | Technology                         |
|-----------|------------------------------------|
| Frontend  | React 18 + Vite + Recharts + Tailwind CSS |
| Backend   | FastAPI (Python 3.12) + Motor (async MongoDB) |
| Database  | MongoDB 7                          |
| Container | Docker + docker-compose            |

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed

### Run with Docker (recommended)

```bash
git clone https://github.com/Tomi-Molina/f1-dashboard
cd f1-dashboard

docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:8000      |
| API Docs | http://localhost:8000/docs |

The backend automatically seeds the database with 2023 season data on first startup.

---

### Run locally (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit if needed

# Start MongoDB locally first, then:
python seed_data.py             # seed the database
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
f1-dashboard/
├── backend/
│   ├── app/
│   │   ├── core/           # Config and DB connection
│   │   ├── models/         # Pydantic schemas
│   │   ├── repositories/   # MongoDB data access layer
│   │   ├── routers/        # FastAPI route handlers
│   │   └── services/       # Business logic
│   ├── main.py             # FastAPI app entry point
│   ├── seed_data.py        # Database seeder (2023 season)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Dashboard, RaceDetails, DriverComparison
│   │   └── services/       # Axios API client
│   ├── vite.config.js
│   └── Dockerfile
└── docker-compose.yml
```

---

## API Endpoints

```
GET  /api/races/seasons          — Available seasons
GET  /api/races?season=2023      — All race summaries
GET  /api/races/{race_id}        — Full race details + results
GET  /api/drivers?season=2023    — All drivers
GET  /api/drivers/standings      — Championship standings
GET  /api/drivers/compare        — Head-to-head comparison
GET  /api/drivers/{driver_id}    — Driver profile
```

Interactive API documentation: http://localhost:8000/docs

---

## Data

The project includes pre-seeded data for the first 10 rounds of the **2023 F1 Season**:
Bahrain, Saudi Arabia, Australia, Azerbaijan, Miami, Monaco, Spain, Canada, Britain, Hungary.

Drivers: Verstappen, Pérez, Alonso, Hamilton, Sainz, Leclerc, Norris, Russell, Piastri, Stroll.

---

## License

MIT — feel free to use this project as a portfolio template.
