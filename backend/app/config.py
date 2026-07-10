from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://nutri_user:secret@localhost/nutrisuggest_db"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    themealdb_base_url: str = "https://www.themealdb.com/api/json/v1/1"
    openfoodfacts_base_url: str = "https://world.openfoodfacts.org/api/v3"

    cors_origins: list[str] = ["http://localhost:3000","http://localhost:3001"]


settings = Settings()
