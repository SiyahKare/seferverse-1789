import os
import json
from fastapi.testclient import TestClient
from app.main import app


def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_deployments_reads_json(tmp_path, monkeypatch):
    # Arrange: create a dummy deployments.json
    dummy = {
        "baseSepolia": {
            "MyContract": {
                "address": "0xabc",
                "txHash": "0xhash"
            }
        }
    }
    p = tmp_path / "deployments.json"
    p.write_text(json.dumps(dummy))

    # Override env for the app router
    monkeypatch.setenv("DEPLOYMENTS_PATH", str(p))

    client = TestClient(app)
    r = client.get("/deployments")
    assert r.status_code == 200
    data = r.json()
    assert "baseSepolia" in data
    assert "MyContract" in data["baseSepolia"]

