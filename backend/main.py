from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import connect_to_mongo, close_mongo_connection
from app.routers import races, drivers


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(
    title="F1 Telemetry Dashboard API",
    description="Formula 1 race data API for the F1 Dashboard portfolio project.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(races.router, prefix="/api")
app.include_router(drivers.router, prefix="/api")


@app.get("/", tags=["health"])
async def root():
    return {"status": "ok", "message": "F1 Dashboard API is running 🏎️"}


@app.get("/health", tags=["health"])
async def health():
    return {"status": "healthy"}
