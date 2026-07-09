# NutriSuggest

AI-powered meal suggestion platform. FastAPI backend + Next.js frontend.

Personalises meal suggestions based on a user's body profile, dietary
preferences, pantry ingredients, and calorie targets. Meal data is ingested
from TheMealDB and Open Food Facts.

## Structure

- `backend/` — FastAPI service (SQLAlchemy, Alembic, Celery, JWT auth)
- `frontend/` — Next.js app (App Router, TanStack Query, Tailwind)

## Quick start

```bash
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

See `backend/README.md` for backend-only setup without Docker.

## Features

- Profile-aware suggestions (BMI/BMR/TDEE-driven calorie targets)
- Ingredient-based ("what's in my pantry") meal filtering
- Dietary tag and allergen-aware suggestion scoring
- Favourites and a daily meal planner
- Meal data ingested from TheMealDB and Open Food Facts via Celery
