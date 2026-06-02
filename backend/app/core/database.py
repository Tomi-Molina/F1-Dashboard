from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

_client: AsyncIOMotorClient = None
_db: AsyncIOMotorDatabase = None


async def connect_to_mongo() -> None:
    global _client, _db
    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    _db = _client[settings.DATABASE_NAME]
    # Verify connection
    await _client.admin.command("ping")
    print(f"✅ Connected to MongoDB — database: {settings.DATABASE_NAME}")


async def close_mongo_connection() -> None:
    global _client
    if _client:
        _client.close()
        print("🔌 MongoDB connection closed")


def get_database() -> AsyncIOMotorDatabase:
    if _db is None:
        raise RuntimeError("Database not initialised — call connect_to_mongo() first")
    return _db
