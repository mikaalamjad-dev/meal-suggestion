import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

logger = logging.getLogger("nutrisuggest")

from app.config import settings
from app.routers import auth, favourites, ingredients, meal_plans, meals, suggestions, users
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
app.include_router(users.router)
app.include_router(meals.router)
app.include_router(favourites.router)
app.include_router(ingredients.router)
app.include_router(meal_plans.router)
app.include_router(suggestions.router)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/health")
def health():
    return {"status": "ok"}
