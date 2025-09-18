"""API route declarations."""
from __future__ import annotations

import contextlib
import io
from datetime import datetime, timedelta
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import PlainTextResponse
from markitdown import MarkItDown, StreamInfo

from .. import config


router = APIRouter(prefix="/api")


@lru_cache(maxsize=1)
def _get_markitdown() -> MarkItDown:
    """Create MarkItDown instance respecting current settings."""

    return MarkItDown(enable_plugins=config.settings.enable_markitdown_plugins)


def reset_markitdown_cache() -> None:
    """Reset the cached MarkItDown instance (useful for tests or config reloads)."""

    _get_markitdown.cache_clear()


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Simple readiness probe."""

    return {"status": "ok"}


@router.post("/convert", response_class=PlainTextResponse)
async def convert_document(file: UploadFile = File(...)) -> PlainTextResponse:
    """Convert an uploaded document to Markdown."""

    settings = config.settings

    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a filename")

    extension = Path(file.filename).suffix.lower()
    if settings.allowed_extensions and extension not in settings.allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File extension '{extension or '[none]'}' is not permitted",
        )

    raw_bytes = await file.read()
    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(raw_bytes) > max_bytes:
        raise HTTPException(status_code=413, detail="File exceeds configured size limit")

    stream = io.BytesIO(raw_bytes)
    stream_info = StreamInfo(
        filename=file.filename,
        extension=extension,
    )

    converter = _get_markitdown()

    try:
        result = converter.convert_stream(stream, stream_info=stream_info)
    except Exception as exc:  # pragma: no cover - surfaced to client
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    _persist_markdown(result.markdown, file.filename, settings)

    return PlainTextResponse(
        content=result.markdown,
        media_type="text/markdown; charset=utf-8",
        headers={"X-MarkItDown-Title": result.title or ""},
    )


def _persist_markdown(markdown: str, original_filename: str, settings: config.Settings) -> None:
    """Persist converted markdown to disk for temporary retrieval/inspection."""

    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    stem = Path(original_filename).stem or "upload"
    sanitized_stem = stem.replace("/", "_").replace("\\", "_")
    output_path = settings.storage_dir / f"{timestamp}_{sanitized_stem}.md"
    output_path.write_text(markdown, encoding="utf-8")

    _expire_old_results(settings)


def _expire_old_results(settings: config.Settings) -> None:
    """Remove stored results older than the retention window."""

    cutoff = datetime.utcnow() - timedelta(minutes=settings.result_retention_minutes)
    for path in settings.storage_dir.glob("*.md"):
        if datetime.utcfromtimestamp(path.stat().st_mtime) < cutoff:
            with contextlib.suppress(OSError):
                path.unlink()


__all__ = ["router", "reset_markitdown_cache"]
