# MarkItDown Web UI Backend

FastAPI service that exposes MarkItDown document conversion capabilities over HTTP. This package powers the open-source MarkItDown Web UI project.

## Quick start

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -e ".[dev]"
uvicorn markitdown_webui_backend.main:app --reload
```

## Features
- `/api/health` readiness endpoint.
- `/api/convert` for synchronous file-to-Markdown conversion.
- Configurable upload size and allowed file extensions via environment variables.
- Hooks prepared for async background processing and storage adapters.

See the top-level project documentation for the broader architecture and roadmap.
