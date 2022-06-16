from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import auth
from app.workers.ingestion import ingest_meals_task


@asynccontextmanager
async def lifespan(app: FastAPI):
    ingest_meals_task.delay()
    yield


app = FastAPI(title="NutriSuggest API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)


@app.get("/health")
def health():
    return {"status": "ok"}
