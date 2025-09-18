# MarkItDown Web UI Notes

This project intentionally stays light-weight:

- keep only the `backend/` FastAPI service and `frontend/` React app.
- ship a single README (see packages/markitdown-webui/README.md) for setup, updates, and hosting tips.
- rely on released `markitdown` wheels; update `backend/pyproject.toml` when upstream publishes a new version.
- optional future tasks: add Docker Compose, CI, or documentation site if the project grows.

For historical architecture ideas, check the original plan in version control history.
