"""FastAPI application factory."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router as api_router
from .config import settings


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""

    app = FastAPI(title="MarkItDown Web UI Backend", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Documented as placeholder; to be restricted in production.
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)

    @app.get("/")
    async def root() -> dict[str, str]:
        return {"service": "markitdown-webui", "status": "ok"}

    return app


app = create_app()

__all__ = ["create_app", "app", "settings"]
