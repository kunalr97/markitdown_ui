# MarkItDown Web UI Frontend

React + Vite single-page app providing a friendly interface to the MarkItDown conversion service.

## Scripts

```bash
# Install dependencies
npm install  # or use pnpm / yarn if preferred

# Start dev server (proxies /api to http://localhost:8000)
npm run dev

# Build for production (outputs dist/)
npm run build
```

Set `VITE_API_BASE` to point at your deployed backend when building for production, e.g.

```bash
VITE_API_BASE=https://your-backend.onrender.com npm run build
```

During local development you can leave `VITE_API_BASE` unset.
