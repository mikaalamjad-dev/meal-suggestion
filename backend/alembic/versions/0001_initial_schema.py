"""initial schema

Revision ID: 0001
Revises:
Create Date: 2022-01-08

"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "user_profiles",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), unique=True, nullable=False),
        sa.Column("weight_kg", sa.Float, nullable=False),
        sa.Column("height_cm", sa.Float, nullable=False),
        sa.Column("age", sa.Integer, nullable=False),
        sa.Column("gender", sa.String(16), nullable=False),
        sa.Column("activity_level", sa.String(32), nullable=False),
        sa.Column("goal", sa.String(16), nullable=False),
        sa.Column("bmi", sa.Float, nullable=True),
        sa.Column("bmr", sa.Float, nullable=True),
        sa.Column("tdee", sa.Float, nullable=True),
        sa.Column("daily_calorie_target", sa.Float, nullable=True),
    )

    op.create_table(
        "meals",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("external_id", sa.String(64), unique=True, index=True, nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category", sa.String(64), index=True, nullable=False),
        sa.Column("area", sa.String(64), nullable=True),
        sa.Column("instructions", sa.Text, nullable=True),
        sa.Column("thumbnail_url", sa.String(512), nullable=True),
        sa.Column("calories", sa.Float, nullable=True),
    )

    op.create_table(
        "ingredients",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("calories_per_100g", sa.Float, nullable=True),
        sa.Column("protein_g", sa.Float, nullable=True),
        sa.Column("carbs_g", sa.Float, nullable=True),
        sa.Column("fat_g", sa.Float, nullable=True),
    )

    op.create_table(
        "meal_ingredients",
        sa.Column("meal_id", sa.Integer, sa.ForeignKey("meals.id"), primary_key=True),
        sa.Column("ingredient_id", sa.Integer, sa.ForeignKey("ingredients.id"), primary_key=True),
        sa.Column("measure", sa.String(128), nullable=True),
    )

    op.create_table(
        "dietary_tags",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("name", sa.String(64), nullable=False),
        sa.Column("slug", sa.String(64), unique=True, index=True, nullable=False),
    )

    op.create_table(
        "meal_dietary_tags",
        sa.Column("meal_id", sa.Integer, sa.ForeignKey("meals.id"), primary_key=True),
        sa.Column("tag_id", sa.Integer, sa.ForeignKey("dietary_tags.id"), primary_key=True),
    )

    op.create_table(
        "user_favourites",
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("meal_id", sa.Integer, sa.ForeignKey("meals.id"), primary_key=True),
        sa.Column("saved_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "user_ingredients",
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("ingredient_id", sa.Integer, sa.ForeignKey("ingredients.id"), primary_key=True),
        sa.Column("added_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "meal_plans",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id"), index=True, nullable=False),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column("target_calories", sa.Float, nullable=True),
    )

    op.create_table(
        "meal_plan_items",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("plan_id", sa.Integer, sa.ForeignKey("meal_plans.id"), nullable=False),
        sa.Column("meal_id", sa.Integer, sa.ForeignKey("meals.id"), nullable=False),
        sa.Column("meal_type", sa.String(16), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("meal_plan_items")
    op.drop_table("meal_plans")
    op.drop_table("user_ingredients")
    op.drop_table("user_favourites")
    op.drop_table("meal_dietary_tags")
    op.drop_table("dietary_tags")
    op.drop_table("meal_ingredients")
    op.drop_table("ingredients")
    op.drop_table("meals")
    op.drop_table("user_profiles")
    op.drop_table("users")
