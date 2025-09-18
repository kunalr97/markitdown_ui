# MarkItDown Web UI – Local Setup Guide

This document describes how to run the new backend (FastAPI) and frontend (React) scaffolds for the MarkItDown Web UI project using Conda environments.

## Prerequisites
- Conda (Anaconda or Miniconda)
- Node.js 20+ and npm (or another compatible package manager)

## 1. Backend (FastAPI)
```powershell
cd packages/markitdown-webui/backend

# Create & activate environment
conda create -n markitdown-webui-backend python=3.12 -y
conda activate markitdown-webui-backend

# Install dependencies in editable mode (includes dev tools)
pip install -e ".[dev]"

# Run tests
pytest

# Start the API server on http://127.0.0.1:8000
uvicorn markitdown_webui_backend.main:app --reload
```

Environment variables (prefix `MARKITDOWN_WEBUI_`) can be defined via a `.env` file or Conda `conda env config vars set`. Useful knobs include:
- `MAX_UPLOAD_SIZE_MB` (default 20)
- `ALLOWED_EXTENSIONS` (comma-separated list)
- `ENABLE_MARKITDOWN_PLUGINS` ("true" to enable registered plugins)
- `STORAGE_DIR` (path for temporary Markdown output)
- `RESULT_RETENTION_MINUTES` (cleanup window)

## 2. Frontend (React + Vite)
```powershell
cd packages/markitdown-webui/frontend
npm install
npm run dev  # Launches Vite dev server on http://127.0.0.1:5173
```

The Vite dev server proxies API calls addressed to `/api` toward `http://localhost:8000`, so start the FastAPI server first. For a production build:
```powershell
npm run build
```
`dist/` will contain the static assets. These can be hosted by any web server or bundled into the backend later (e.g., via FastAPI static file middleware).

## 3. Docker Compose (coming soon)
A Compose file will orchestrate the backend, frontend, and optional Redis/worker services. Until then, run the two stacks separately as shown above.

## 4. Troubleshooting
- If uploads fail with HTTP 413, adjust `MARKITDOWN_WEBUI_MAX_UPLOAD_SIZE_MB`.
- Permission errors while writing to the storage directory can be resolved by pointing `MARKITDOWN_WEBUI_STORAGE_DIR` to a writable path.
- When toggling plugin support in tests or development, restart the API process to recreate the underlying MarkItDown instance (or call `reset_markitdown_cache()` within application code).

## 5. Next Steps
- Integrate background job queue (Celery + Redis).
- Wire the built frontend into the backend for a unified deployment artifact.
- Expand automated tests to cover edge cases and the REST interface end-to-end.
