# MarkItDown Web UI

Minimal web front end for the [MarkItDown](https://github.com/microsoft/markitdown) document converter. Upload a file, get Markdown back � no CLI required.

Maintainer: **Kunal Runwal**

## Quick Start

### Backend (FastAPI)
```powershell
conda create -n markitdown-webui-backend python=3.12 -y
conda activate markitdown-webui-backend
pip install -e "backend[dev]"  # installs markitdown and FastAPI extras
uvicorn markitdown_webui_backend.main:app --reload
```

### Frontend (React + Vite)
```powershell
cd frontend
npm install
npm run dev  # http://localhost:5173 (proxies API to :8000)
```

## Updating When MarkItDown Changes
1. Activate the backend environment.
2. Run `pip install "markitdown[all]" --upgrade`.
3. Smoke test a couple of files (PDF, DOCX, PPTX).
4. If everything looks good, bump the version constraint in `backend/pyproject.toml` and tag a release.

## Free Hosting Options
- **Render** (backend): Deploy a free Python web service from this repo with the start command `uvicorn markitdown_webui_backend.main:app --host 0.0.0.0 --port 10000`.
- **Vercel** (frontend): Connect the repo, set `npm run build` as the build command, and `dist` as the output directory. Add an env var `VITE_API_BASE=https://<your-render-service>.onrender.com`.

## Folder Layout
```
backend/   FastAPI API wrapping MarkItDown
frontend/  React single-page app (Chakra UI)
```

---
Inspired by Microsoft�s MIT-licensed MarkItDown project.
