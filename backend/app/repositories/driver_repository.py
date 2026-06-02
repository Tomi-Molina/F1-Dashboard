from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional


class DriverRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["drivers"]

    async def find_all(self, season: Optional[int] = None) -> list[dict]:
        query = {}
        if season:
            query["season"] = season
        cursor = self.collection.find(query, sort=[("total_points", -1)])
        return await cursor.to_list(length=None)

    async def find_by_id(self, driver_id: str, season: int) -> Optional[dict]:
        return await self.collection.find_one(
            {"driver_id": driver_id, "season": season}
        )

    async def insert_many(self, drivers: list[dict]) -> None:
        if drivers:
            await self.collection.insert_many(drivers)

    async def count(self, season: Optional[int] = None) -> int:
        query = {}
        if season:
            query["season"] = season
        return await self.collection.count_documents(query)
