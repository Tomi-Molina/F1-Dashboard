"""
Seed the MongoDB database with 2023 F1 season data.
Run: python seed_data.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "f1_dashboard")

# ── Helpers ───────────────────────────────────────────────────────────────────

POINTS_MAP = {1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1}


def result(pos, driver_id, name, short, team, fastest=False, dnf=False, avg_lap=None):
    pts = 0 if dnf else POINTS_MAP.get(pos, 0)
    if fastest and pos <= 10 and not dnf:
        pts += 1
    return {
        "position": pos,
        "driver_id": driver_id,
        "driver_name": name,
        "short_name": short,
        "team": team,
        "points": pts,
        "fastest_lap": fastest,
        "dnf": dnf,
        "avg_lap_time": avg_lap,
    }


# ── Drivers ──────────────────────────────────────────────────────────────────

DRIVERS = [
    {
        "driver_id": "verstappen",
        "name": "Max Verstappen",
        "short_name": "VER",
        "number": 1,
        "team": "Red Bull Racing",
        "nationality": "Dutch",
        "season": 2023,
        "total_points": 575,
        "wins": 19,
        "podiums": 21,
        "pole_positions": 12,
    },
    {
        "driver_id": "perez",
        "name": "Sergio Pérez",
        "short_name": "PER",
        "number": 11,
        "team": "Red Bull Racing",
        "nationality": "Mexican",
        "season": 2023,
        "total_points": 285,
        "wins": 2,
        "podiums": 9,
        "pole_positions": 3,
    },
    {
        "driver_id": "alonso",
        "name": "Fernando Alonso",
        "short_name": "ALO",
        "number": 14,
        "team": "Aston Martin",
        "nationality": "Spanish",
        "season": 2023,
        "total_points": 206,
        "wins": 0,
        "podiums": 8,
        "pole_positions": 0,
    },
    {
        "driver_id": "hamilton",
        "name": "Lewis Hamilton",
        "short_name": "HAM",
        "number": 44,
        "team": "Mercedes",
        "nationality": "British",
        "season": 2023,
        "total_points": 234,
        "wins": 0,
        "podiums": 4,
        "pole_positions": 0,
    },
    {
        "driver_id": "sainz",
        "name": "Carlos Sainz",
        "short_name": "SAI",
        "number": 55,
        "team": "Ferrari",
        "nationality": "Spanish",
        "season": 2023,
        "total_points": 200,
        "wins": 1,
        "podiums": 4,
        "pole_positions": 0,
    },
    {
        "driver_id": "leclerc",
        "name": "Charles Leclerc",
        "short_name": "LEC",
        "number": 16,
        "team": "Ferrari",
        "nationality": "Monégasque",
        "season": 2023,
        "total_points": 206,
        "wins": 0,
        "podiums": 3,
        "pole_positions": 5,
    },
    {
        "driver_id": "norris",
        "name": "Lando Norris",
        "short_name": "NOR",
        "number": 4,
        "team": "McLaren",
        "nationality": "British",
        "season": 2023,
        "total_points": 205,
        "wins": 0,
        "podiums": 6,
        "pole_positions": 1,
    },
    {
        "driver_id": "russell",
        "name": "George Russell",
        "short_name": "RUS",
        "number": 63,
        "team": "Mercedes",
        "nationality": "British",
        "season": 2023,
        "total_points": 175,
        "wins": 0,
        "podiums": 1,
        "pole_positions": 1,
    },
    {
        "driver_id": "piastri",
        "name": "Oscar Piastri",
        "short_name": "PIA",
        "number": 81,
        "team": "McLaren",
        "nationality": "Australian",
        "season": 2023,
        "total_points": 97,
        "wins": 0,
        "podiums": 2,
        "pole_positions": 0,
    },
    {
        "driver_id": "stroll",
        "name": "Lance Stroll",
        "short_name": "STR",
        "number": 18,
        "team": "Aston Martin",
        "nationality": "Canadian",
        "season": 2023,
        "total_points": 74,
        "wins": 0,
        "podiums": 0,
        "pole_positions": 0,
    },
]

# ── Races ─────────────────────────────────────────────────────────────────────

RACES = [
    {
        "race_id": "2023-bahrain",
        "name": "Bahrain Grand Prix",
        "circuit": "Bahrain International Circuit",
        "country": "Bahrain",
        "date": "2023-03-05",
        "season": 2023,
        "round": 1,
        "laps": 57,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  avg_lap=98.23),
            result(2, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=98.71),
            result(3, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=99.12),
            result(4, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=99.45),
            result(5, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=99.78),
            result(6, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=100.01),
            result(7, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          fastest=True, avg_lap=97.95),
            result(8, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=100.44),
            result(9, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=100.67),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=100.89),
        ],
    },
    {
        "race_id": "2023-saudi",
        "name": "Saudi Arabian Grand Prix",
        "circuit": "Jeddah Corniche Circuit",
        "country": "Saudi Arabia",
        "date": "2023-03-19",
        "season": 2023,
        "round": 2,
        "laps": 50,
        "results": [
            result(1, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=90.12),
            result(2, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=89.77),
            result(3, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=91.08),
            result(4, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=91.55),
            result(5, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=91.89),
            result(6, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=92.14),
            result(7, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=92.38),
            result(8, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=92.62),
            result(9, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=92.88),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=93.14),
        ],
    },
    {
        "race_id": "2023-australia",
        "name": "Australian Grand Prix",
        "circuit": "Albert Park Circuit",
        "country": "Australia",
        "date": "2023-04-02",
        "season": 2023,
        "round": 3,
        "laps": 58,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  avg_lap=84.52),
            result(2, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         fastest=True, avg_lap=84.19),
            result(3, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=85.01),
            result(4, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=85.33),
            result(5, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=85.60),
            result(6, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=85.88),
            result(7, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=86.11),
            result(8, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=86.35),
            result(9, "piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=86.60),
            result(10,"perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=86.85),
        ],
    },
    {
        "race_id": "2023-azerbaijan",
        "name": "Azerbaijan Grand Prix",
        "circuit": "Baku City Circuit",
        "country": "Azerbaijan",
        "date": "2023-04-30",
        "season": 2023,
        "round": 4,
        "laps": 51,
        "results": [
            result(1, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=106.05),
            result(2, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=105.72),
            result(3, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=107.01),
            result(4, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=107.44),
            result(5, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=107.78),
            result(6, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=108.12),
            result(7, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=108.45),
            result(8, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=108.78),
            result(9, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=109.01),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=109.34),
        ],
    },
    {
        "race_id": "2023-miami",
        "name": "Miami Grand Prix",
        "circuit": "Miami International Autodrome",
        "country": "United States",
        "date": "2023-05-07",
        "season": 2023,
        "round": 5,
        "laps": 57,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=93.14),
            result(2, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=93.88),
            result(3, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=94.21),
            result(4, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=94.55),
            result(5, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=94.88),
            result(6, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=95.22),
            result(7, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=95.55),
            result(8, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=95.88),
            result(9, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=96.12),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=96.45),
        ],
    },
    {
        "race_id": "2023-monaco",
        "name": "Monaco Grand Prix",
        "circuit": "Circuit de Monaco",
        "country": "Monaco",
        "date": "2023-05-28",
        "season": 2023,
        "round": 6,
        "laps": 78,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  avg_lap=80.01),
            result(2, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=80.44),
            result(3, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=80.77),
            result(4, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         fastest=True, avg_lap=79.78),
            result(5, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=81.11),
            result(6, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=81.34),
            result(7, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=81.57),
            result(8, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=81.80),
            result(9, "piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=82.03),
            result(10,"stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=82.26),
        ],
    },
    {
        "race_id": "2023-spain",
        "name": "Spanish Grand Prix",
        "circuit": "Circuit de Barcelona-Catalunya",
        "country": "Spain",
        "date": "2023-06-04",
        "season": 2023,
        "round": 7,
        "laps": 66,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=82.11),
            result(2, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=82.77),
            result(3, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=83.01),
            result(4, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=83.25),
            result(5, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=83.50),
            result(6, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=83.74),
            result(7, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=83.98),
            result(8, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=84.22),
            result(9, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=84.46),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=84.70),
        ],
    },
    {
        "race_id": "2023-canada",
        "name": "Canadian Grand Prix",
        "circuit": "Circuit Gilles Villeneuve",
        "country": "Canada",
        "date": "2023-06-18",
        "season": 2023,
        "round": 8,
        "laps": 70,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  avg_lap=77.22),
            result(2, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     fastest=True, avg_lap=76.91),
            result(3, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=77.78),
            result(4, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=78.01),
            result(5, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=78.25),
            result(6, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=78.49),
            result(7, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=78.73),
            result(8, "stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=78.97),
            result(9, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=79.21),
            result(10,"piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=79.45),
        ],
    },
    {
        "race_id": "2023-britain",
        "name": "British Grand Prix",
        "circuit": "Silverstone Circuit",
        "country": "United Kingdom",
        "date": "2023-07-09",
        "season": 2023,
        "round": 9,
        "laps": 52,
        "results": [
            result(1, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=92.55),
            result(2, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=92.23),
            result(3, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=93.11),
            result(4, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=93.45),
            result(5, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=93.68),
            result(6, "piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=93.92),
            result(7, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=94.15),
            result(8, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=94.38),
            result(9, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=94.62),
            result(10,"stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=94.85),
        ],
    },
    {
        "race_id": "2023-hungary",
        "name": "Hungarian Grand Prix",
        "circuit": "Hungaroring",
        "country": "Hungary",
        "date": "2023-07-23",
        "season": 2023,
        "round": 10,
        "laps": 70,
        "results": [
            result(1, "verstappen",  "Max Verstappen",  "VER", "Red Bull Racing",  fastest=True, avg_lap=80.71),
            result(2, "hamilton",    "Lewis Hamilton",  "HAM", "Mercedes",         avg_lap=81.24),
            result(3, "norris",      "Lando Norris",    "NOR", "McLaren",          avg_lap=81.58),
            result(4, "alonso",      "Fernando Alonso", "ALO", "Aston Martin",     avg_lap=81.91),
            result(5, "leclerc",     "Charles Leclerc", "LEC", "Ferrari",          avg_lap=82.25),
            result(6, "sainz",       "Carlos Sainz",    "SAI", "Ferrari",          avg_lap=82.58),
            result(7, "russell",     "George Russell",  "RUS", "Mercedes",         avg_lap=82.92),
            result(8, "piastri",     "Oscar Piastri",   "PIA", "McLaren",          avg_lap=83.25),
            result(9, "perez",       "Sergio Pérez",    "PER", "Red Bull Racing",  avg_lap=83.58),
            result(10,"stroll",      "Lance Stroll",    "STR", "Aston Martin",     avg_lap=83.92),
        ],
    },
]


# ── Main ──────────────────────────────────────────────────────────────────────

async def seed():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]

    # Clear existing data
    await db["drivers"].drop()
    await db["races"].drop()
    print("🗑️  Cleared existing collections")

    # Insert drivers
    await db["drivers"].insert_many(DRIVERS)
    print(f"✅ Inserted {len(DRIVERS)} drivers")

    # Insert races
    await db["races"].insert_many(RACES)
    print(f"✅ Inserted {len(RACES)} races")

    # Create indexes
    await db["drivers"].create_index([("driver_id", 1), ("season", 1)], unique=True)
    await db["races"].create_index([("race_id", 1)], unique=True)
    await db["races"].create_index([("season", 1), ("round", 1)])
    print("📑 Indexes created")

    client.close()
    print("🏁 Seeding complete!")


if __name__ == "__main__":
    asyncio.run(seed())
