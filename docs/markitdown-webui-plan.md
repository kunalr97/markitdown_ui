# MarkItDown Web UI Project Plan

## Vision
Provide an open-source, self-hostable web interface for converting documents to Markdown using the MarkItDown library. The portal should be fast to deploy, easy to customize, and safe for teams that prefer to keep data on-premises.

## Target Users
- Non-technical teammates who need occasional conversions.
- Operators who want to monitor conversion jobs and manage storage.
- Developers integrating MarkItDown into existing workflows via REST APIs.

## Guiding Principles
1. **Simple by default** – ship with a single-node stack (FastAPI + front end) and no authentication.
2. **Secure when needed** – document optional add-ons for auth, rate limiting, and virus scanning.
3. **Extensible** – expose plugin toggles and storage adapters so organizations can adapt it.
4. **Portable** – support Docker Compose, manual installs, and room for cloud deployment recipes.

## Architecture Overview
- **Front end**: React + Vite, Chakra UI for styling, Axios for API calls.
- **Backend API**: FastAPI running under Uvicorn, wrapping `markitdown.MarkItDown`.
- **Async Jobs (optional)**: Celery + Redis for long-running conversions; enabled via config.
- **Storage**: Local temp directory by default; optional S3/Azure Blob adapters (future roadmap).
- **Packaging**: Docker Compose (api, web, redis, worker), plus standalone scripts for lightweight installs.

### Core API Endpoints (initial)
| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/health` | GET | Readiness check |
| `/api/convert` | POST | Accept file upload, return Markdown (sync mode) |
| `/api/jobs` | POST | Submit async job (optional) |
| `/api/jobs/{job_id}` | GET | Job status & metadata |
| `/api/jobs/{job_id}/result` | GET | Fetch Markdown once ready |

### Front-End Views
- Upload page: drag-and-drop area, file chooser, list of conversions in current session.
- Results preview: rendered Markdown with copy/download buttons.
- Job history (future): paginated list with search/filter.

## Feature Roadmap
1. **MVP (v0.1.0)**
   - Sync `/convert` endpoint.
   - Client-side Markdown preview + download.
   - Configurable file size/type limits.
   - Basic error messaging/logging.
2. **v0.2.0**
   - Optional async job queue + job history persistence.
   - Batch upload and progress indicators.
   - Download Markdown as `.md` or zipped package.
3. **v0.3.0**
   - Pluggable storage adapters (local, S3, Azure).
   - Toggle MarkItDown optional dependencies/plugins.
   - Simple auth options (basic/OAuth2 proxy guidance).
4. **Future ideas**
   - Live Markdown diff preview for updated documents.
   - Webhooks/email notifications on completion.
   - Hosted demo with per-session sandboxing.

## Security & Compliance Checklist
- Document risk of running without authentication; recommend reverse proxy or network ACLs.
- Validate MIME type against an allowlist and cap upload size (default 20 MB).
- Optional ClamAV scan hook prior to conversion.
- Ensure temporary files are deleted after delivery; configurable retention window.
- Sanitize Markdown output (escape HTML) before rendering in browser.

## Development Workflow
- **Backend**
  - Python 3.12, FastAPI, Pydantic v2, Starlette.
  - Tooling: ruff, mypy, pytest.
- **Frontend**
  - Node 20+, React 18, Chakra UI, React Query.
  - Tooling: ESLint, Prettier, Vitest + Testing Library, Playwright for E2E.
- **CI/CD**
  - GitHub Actions: lint + tests + Docker build.
  - Release outputs: Docker image, backend wheel, static front-end build artifact.

## Configuration Surface (initial)
- `MAX_UPLOAD_SIZE_MB`
- `ALLOWED_EXTENSIONS`
- `ENABLE_ASYNC_QUEUE`
- `STORAGE_BACKEND` ("local" for now)
- `RESULT_RETENTION_MINUTES`
- `ENABLE_MARKITDOWN_PLUGINS`

## Initial Task Backlog
1. ? Scaffold FastAPI project structure under `packages/markitdown-webui/backend`.
2. ? Implement `/api/health` and `/api/convert` endpoints with streaming Markdown response.
3. ? Add local temp storage helper with auto-cleanup.
4. ? Scaffold React front end under `packages/markitdown-webui/frontend` with Vite + Chakra UI.
5. ? Build upload form, Markdown preview, and download flow.
6. ? Write integration test covering upload -> markdown using FastAPI TestClient.
7. ? Configure Docker Compose for backend, frontend, (placeholder) redis.
8. ? Set up GitHub Actions workflow for lint/test/build.
9. ? Draft contributor docs: README section, CONTRIBUTING guide, code of conduct reuse.
10. ? Gather feedback, triage enhancements, and prepare v0.1.0 release notes.

## Open Questions
- Preferred naming of the new package (e.g., `markitdown-webui` vs `markitdown-portal`).
- Should the repo ship a hosted demo, or strictly self-hosted instructions?
- What is the appetite for optional login integration guidance in v0.1.0?

