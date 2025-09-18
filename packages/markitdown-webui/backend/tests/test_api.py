import io

import pytest
from fastapi.testclient import TestClient

from markitdown_webui_backend.main import create_app


@pytest.fixture(autouse=True)
def reset_settings(tmp_path):
    from markitdown_webui_backend import config
    from markitdown_webui_backend.api.routes import reset_markitdown_cache

    config.load_settings(storage_dir=tmp_path)
    reset_markitdown_cache()
    yield


def test_health() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_convert_plain_text() -> None:
    app = create_app()
    with TestClient(app) as client:
        response = client.post(
            "/api/convert",
            files={"file": ("example.txt", io.BytesIO(b"Hello world"), "text/plain")},
        )

    assert response.status_code == 200
    assert response.text.strip() == "Hello world"

    from markitdown_webui_backend import config

    stored_files = list(config.settings.storage_dir.glob("*.md"))
    assert stored_files, "Markdown file should be stored"
    assert stored_files[0].read_text(encoding="utf-8").strip() == "Hello world"
