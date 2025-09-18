"""Application configuration settings."""
from pathlib import Path
from typing import Set

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-driven configuration for the API."""

    model_config = SettingsConfigDict(env_prefix="MARKITDOWN_WEBUI_", case_sensitive=False)

    max_upload_size_mb: int = 20
    allowed_extensions: Set[str] = {".pdf", ".docx", ".pptx", ".xlsx", ".txt", ".html", ".md"}
    enable_markitdown_plugins: bool = False
    storage_dir: Path = Path("./.data/uploads")
    result_retention_minutes: int = 120


settings = Settings()
settings.storage_dir.mkdir(parents=True, exist_ok=True)


def load_settings(**overrides) -> Settings:
    """Reload settings with optional overrides (primarily for tests)."""

    global settings
    settings = Settings(**overrides)
    settings.storage_dir.mkdir(parents=True, exist_ok=True)
    return settings


__all__ = ["Settings", "settings", "load_settings"]
