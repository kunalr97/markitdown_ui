# MarkItDown Web UI

Lightweight web interface for converting files into LLM-friendly Markdown using the open-source [MarkItDown](https://github.com/microsoft/markitdown) library from Microsoft. Upload any supported document, and the app returns clean Markdown that you can copy, download, or feed to downstream tools.

> **Live site:** https://markitdown-ui.vercel.app/
> **Backend API:** https://markitdown-ui.onrender.com/

## Features
- Single-page UI with drag-and-drop upload, Markdown preview, and download button
- FastAPI backend that wraps `markitdown.MarkItDown` with the full optional dependency set
- Ready-to-deploy configuration for Render (backend) and Vercel (frontend)
- Environment-variable based configuration (`VITE_API_BASE`) so hosted builds point to your API

## Quick Start (local dev)
### Backend (FastAPI + MarkItDown)
```powershell
conda create -n markitdown-webui-backend python=3.12 -y
conda activate markitdown-webui-backend
pip install -e "packages/markitdown-webui/backend[dev]"
uvicorn markitdown_webui_backend.main:app --reload
```

### Frontend (React + Vite)
```powershell
cd packages/markitdown-webui/frontend
npm install
$env:VITE_API_BASE="http://127.0.0.1:8000"; npm run dev
```

## Deployments
### Backend on Render
1. Connect this repo to Render and create a **Python** web service
2. Root directory: `packages/markitdown-webui/backend`
3. Build command: `pip install -e ".[dev]"`
4. Start command: `uvicorn markitdown_webui_backend.main:app --host 0.0.0.0 --port 10000`

### Frontend on Vercel (or Netlify)
1. Set the root directory to `packages/markitdown-webui/frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable: `VITE_API_BASE=https://<your-render-app>.onrender.com`

## Updating When MarkItDown Releases
1. Activate the backend environment
2. Run `pip install "markitdown[all]" --upgrade`
3. Smoke test key formats (PDF, DOCX, PPTX)
4. Bump the `markitdown[all]` version constraint in `packages/markitdown-webui/backend/pyproject.toml`
5. Commit and redeploy backend & frontend if needed

## Credits
- Built on top of Microsoft's MIT-licensed [MarkItDown](https://github.com/microsoft/markitdown) project — huge thanks to the original maintainers
- Web UI maintained by **Kunal Runwal**

## License
This repository inherits the MIT license from the upstream MarkItDown project. See `LICENSE` for details.
