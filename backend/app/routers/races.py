from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.core.database import get_database
from app.repositories.race_repository import RaceRepository
from app.services.race_service import RaceService
from app.models.schemas import Race, RaceSummary

router = APIRouter(prefix="/races", tags=["races"])


def get_service() -> RaceService:
    db = get_database()
    return RaceService(RaceRepository(db))


@router.get("/seasons", response_model=list[int], summary="List available seasons")
async def list_seasons(service: RaceService = Depends(get_service)):
    return await service.get_seasons()


@router.get("", response_model=list[RaceSummary], summary="List all races")
async def list_races(
    season: Optional[int] = Query(None, description="Filter by season year"),
    service: RaceService = Depends(get_service),
):
    return await service.get_all_summaries(season=season)


@router.get("/{race_id}", response_model=Race, summary="Get full race details")
async def get_race(race_id: str, service: RaceService = Depends(get_service)):
    race = await service.get_race(race_id)
    if not race:
        raise HTTPException(status_code=404, detail=f"Race '{race_id}' not found")
    return race
