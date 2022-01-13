# NutriSuggest Backend

FastAPI service for NutriSuggest.

## Run locally

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Requires a `.env` with `DATABASE_URL`, `REDIS_URL`, and `JWT_SECRET` set.
