from typing import Optional
from app.repositories.race_repository import RaceRepository
from app.models.schemas import Race, RaceSummary


def _to_race(doc: dict) -> Race:
    doc["_id"] = str(doc["_id"])
    return Race(**doc)


def _to_race_summary(doc: dict) -> RaceSummary:
    winner = None
    winner_team = None
    if doc.get("results"):
        top = next((r for r in doc["results"] if r["position"] == 1 and not r.get("dnf")), None)
        if top:
            winner = top["driver_name"]
            winner_team = top["team"]
    return RaceSummary(
        race_id=doc["race_id"],
        name=doc["name"],
        circuit=doc["circuit"],
        country=doc["country"],
        date=doc["date"],
        season=doc["season"],
        round=doc["round"],
        winner_name=winner,
        winner_team=winner_team,
    )


class RaceService:
    def __init__(self, repo: RaceRepository):
        self.repo = repo

    async def get_all_summaries(self, season: Optional[int] = None) -> list[RaceSummary]:
        docs = await self.repo.find_all(season=season)
        return [_to_race_summary(d) for d in docs]

    async def get_race(self, race_id: str) -> Optional[Race]:
        doc = await self.repo.find_by_id(race_id)
        if not doc:
            return None
        return _to_race(doc)

    async def get_seasons(self) -> list[int]:
        return await self.repo.find_seasons()
