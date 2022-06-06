from celery import Celery

from app.config import settings

celery_app = Celery("nutrisuggest", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.task_routes = {"app.workers.ingestion.*": {"queue": "ingestion"}}
