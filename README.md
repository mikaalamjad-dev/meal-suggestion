# NutriSuggest

AI-powered meal suggestion platform. FastAPI backend + Next.js frontend.

Personalises meal suggestions based on a user's body profile, dietary
preferences, pantry ingredients, and calorie targets. Meal data is ingested
from TheMealDB and Open Food Facts.

## Structure

- `backend/` — FastAPI service (SQLAlchemy, Alembic, Celery, JWT auth)
- `frontend/` — Next.js app (App Router, TanStack Query, Tailwind)

See `backend/README.md` and `frontend/` for setup notes as they land.
