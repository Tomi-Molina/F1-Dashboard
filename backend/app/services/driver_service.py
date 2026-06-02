from typing import Optional
from app.repositories.driver_repository import DriverRepository
from app.repositories.race_repository import RaceRepository
from app.models.schemas import (
    Driver,
    Standings,
    StandingsEntry,
    ComparisonResponse,
    DriverComparisonData,
    RacePoint,
)


def _to_driver(doc: dict) -> Driver:
    doc["_id"] = str(doc["_id"])
    return Driver(**doc)


class DriverService:
    def __init__(self, driver_repo: DriverRepository, race_repo: RaceRepository):
        self.driver_repo = driver_repo
        self.race_repo = race_repo

    async def get_all(self, season: Optional[int] = None) -> list[Driver]:
        docs = await self.driver_repo.find_all(season=season)
        return [_to_driver(d) for d in docs]

    async def get_driver(self, driver_id: str, season: int) -> Optional[Driver]:
        doc = await self.driver_repo.find_by_id(driver_id, season)
        if not doc:
            return None
        return _to_driver(doc)

    async def get_standings(self, season: int) -> Standings:
        docs = await self.driver_repo.find_all(season=season)
        entries = []
        for i, doc in enumerate(docs, start=1):
            entries.append(
                StandingsEntry(
                    position=i,
                    driver_id=doc["driver_id"],
                    driver_name=doc["name"],
                    short_name=doc["short_name"],
                    team=doc["team"],
                    nationality=doc["nationality"],
                    total_points=doc["total_points"],
                    wins=doc["wins"],
                    podiums=doc["podiums"],
                )
            )
        return Standings(season=season, entries=entries)

    async def get_comparison(
        self, driver1_id: str, driver2_id: str, season: int
    ) -> Optional[ComparisonResponse]:
        d1_doc = await self.driver_repo.find_by_id(driver1_id, season)
        d2_doc = await self.driver_repo.find_by_id(driver2_id, season)
        if not d1_doc or not d2_doc:
            return None

        races = await self.race_repo.find_all(season=season)

        def build_data(driver_id: str, other_id: str) -> DriverComparisonData:
            points_list: list[RacePoint] = []
            cumulative: list[float] = []
            h2h = 0
            running = 0.0

            for race in races:
                results = race.get("results", [])
                my_result = next(
                    (r for r in results if r["driver_id"] == driver_id), None
                )
                opp_result = next(
                    (r for r in results if r["driver_id"] == other_id), None
                )

                pts = my_result["points"] if my_result else 0.0
                pos = my_result["position"] if my_result else None
                dnf = my_result.get("dnf", False) if my_result else False

                running += pts
                points_list.append(
                    RacePoint(
                        round=race["round"],
                        race_name=race["name"],
                        points=pts,
                        position=pos,
                        dnf=dnf,
                    )
                )
                cumulative.append(round(running, 1))

                # Head-to-head: did I finish ahead of opponent?
                if my_result and opp_result and not dnf:
                    if pos and opp_result["position"] and pos < opp_result["position"]:
                        h2h += 1

            driver = _to_driver(
                d1_doc if driver_id == driver1_id else d2_doc
            )
            return DriverComparisonData(
                driver=driver,
                race_points=points_list,
                cumulative_points=cumulative,
                h2h_wins=h2h,
            )

        return ComparisonResponse(
            season=season,
            driver1=build_data(driver1_id, driver2_id),
            driver2=build_data(driver2_id, driver1_id),
        )
