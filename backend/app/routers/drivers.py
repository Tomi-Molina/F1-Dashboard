from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.core.database import get_database
from app.repositories.driver_repository import DriverRepository
from app.repositories.race_repository import RaceRepository
from app.services.driver_service import DriverService
from app.models.schemas import Driver, Standings, ComparisonResponse

router = APIRouter(prefix="/drivers", tags=["drivers"])


def get_service() -> DriverService:
    db = get_database()
    return DriverService(DriverRepository(db), RaceRepository(db))


@router.get(
    "/standings",
    response_model=Standings,
    summary="Get championship standings for a season",
)
async def get_standings(
    season: int = Query(2023, description="Season year"),
    service: DriverService = Depends(get_service),
):
    return await service.get_standings(season=season)


@router.get(
    "/compare",
    response_model=ComparisonResponse,
    summary="Compare two drivers head-to-head",
)
async def compare_drivers(
    driver1_id: str = Query(..., description="First driver ID"),
    driver2_id: str = Query(..., description="Second driver ID"),
    season: int = Query(2023, description="Season year"),
    service: DriverService = Depends(get_service),
):
    result = await service.get_comparison(driver1_id, driver2_id, season=season)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="One or both drivers not found for the given season",
        )
    return result


@router.get("", response_model=list[Driver], summary="List all drivers")
async def list_drivers(
    season: Optional[int] = Query(None, description="Filter by season year"),
    service: DriverService = Depends(get_service),
):
    return await service.get_all(season=season)


@router.get("/{driver_id}", response_model=Driver, summary="Get driver by ID")
async def get_driver(
    driver_id: str,
    season: int = Query(2023, description="Season year"),
    service: DriverService = Depends(get_service),
):
    driver = await service.get_driver(driver_id, season=season)
    if not driver:
        raise HTTPException(
            status_code=404,
            detail=f"Driver '{driver_id}' not found for season {season}",
        )
    return driver
