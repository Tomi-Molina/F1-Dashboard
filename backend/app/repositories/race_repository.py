from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional


class RaceRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["races"]

    async def find_all(self, season: Optional[int] = None) -> list[dict]:
        query = {}
        if season:
            query["season"] = season
        cursor = self.collection.find(query, sort=[("round", 1)])
        return await cursor.to_list(length=None)

    async def find_by_id(self, race_id: str) -> Optional[dict]:
        return await self.collection.find_one({"race_id": race_id})

    async def find_seasons(self) -> list[int]:
        seasons = await self.collection.distinct("season")
        return sorted(seasons, reverse=True)

    async def insert_many(self, races: list[dict]) -> None:
        if races:
            await self.collection.insert_many(races)

    async def count(self, season: Optional[int] = None) -> int:
        query = {}
        if season:
            query["season"] = season
        return await self.collection.count_documents(query)
