from pydantic import BaseModel, Field
from typing import Optional


# ── Race Result ──────────────────────────────────────────────────────────────

class RaceResult(BaseModel):
    position: int
    driver_id: str
    driver_name: str
    short_name: str
    team: str
    points: float
    fastest_lap: bool = False
    dnf: bool = False
    avg_lap_time: Optional[float] = None  # seconds


# ── Race ─────────────────────────────────────────────────────────────────────

class RaceBase(BaseModel):
    race_id: str
    name: str
    circuit: str
    country: str
    date: str
    season: int
    round: int
    laps: int


class RaceCreate(RaceBase):
    results: list[RaceResult] = []


class Race(RaceBase):
    id: Optional[str] = Field(None, alias="_id")
    results: list[RaceResult] = []

    model_config = {"populate_by_name": True}


class RaceSummary(BaseModel):
    """Lightweight race card shown in lists."""
    race_id: str
    name: str
    circuit: str
    country: str
    date: str
    season: int
    round: int
    winner_name: Optional[str] = None
    winner_team: Optional[str] = None


# ── Driver ───────────────────────────────────────────────────────────────────

class DriverBase(BaseModel):
    driver_id: str
    name: str
    short_name: str
    number: int
    team: str
    nationality: str
    season: int


class DriverCreate(DriverBase):
    total_points: float = 0
    wins: int = 0
    podiums: int = 0
    pole_positions: int = 0


class Driver(DriverBase):
    id: Optional[str] = Field(None, alias="_id")
    total_points: float = 0
    wins: int = 0
    podiums: int = 0
    pole_positions: int = 0

    model_config = {"populate_by_name": True}


# ── Standings ────────────────────────────────────────────────────────────────

class StandingsEntry(BaseModel):
    position: int
    driver_id: str
    driver_name: str
    short_name: str
    team: str
    nationality: str
    total_points: float
    wins: int
    podiums: int


class Standings(BaseModel):
    season: int
    entries: list[StandingsEntry]


# ── Comparison ───────────────────────────────────────────────────────────────

class RacePoint(BaseModel):
    round: int
    race_name: str
    points: float
    position: Optional[int] = None
    dnf: bool = False


class DriverComparisonData(BaseModel):
    driver: Driver
    race_points: list[RacePoint]
    cumulative_points: list[float]
    h2h_wins: int  # head-to-head wins vs the other driver


class ComparisonResponse(BaseModel):
    season: int
    driver1: DriverComparisonData
    driver2: DriverComparisonData
