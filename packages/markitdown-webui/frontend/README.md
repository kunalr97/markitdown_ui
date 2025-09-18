# MarkItDown Web UI Frontend

React + Vite single-page app providing a friendly interface to the MarkItDown conversion service.

## Scripts

```bash
# Install dependencies
npm install  # or use pnpm / yarn if preferred

# Start dev server (proxies /api to http://localhost:8000)
$env:VITE_API_BASE="https://markitdown-ui.onrender.com"; npm run dev

# Build for production (outputs dist/)
VITE_API_BASE=https://markitdown-ui.onrender.com npm run build
```

When deploying (e.g., Vercel/Netlify), define the environment variable:

```
VITE_API_BASE=https://markitdown-ui.onrender.com
```

This makes the upload panel talk to your Render-hosted backend.
