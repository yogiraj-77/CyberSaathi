"""Integration tests for FastAPI endpoints."""
import pytest
from fastapi.testclient import TestClient
from src.backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_status_endpoint():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert "index_ready" in data
    assert data["index_ready"] is True
    assert data["index_stats"]["documents_indexed"] == 35845
    assert data["index_stats"]["shards_processed"] == 8

def test_laws_endpoint():
    response = client.get("/api/laws")
    assert response.status_code == 200
    laws = response.json()
    assert len(laws) >= 5
    sections = [l["section"] for l in laws]
    assert "Section 66D" in sections
    assert "BNS Section 318" in sections

def test_awareness_endpoint():
    response = client.get("/api/awareness")
    assert response.status_code == 200
    guides = response.json()
    assert len(guides) >= 4
    categories = [g["category"] for g in guides]
    assert "Online Payments" in categories

def test_chat_empty_message_validation():
    response = client.post("/api/chat", json={"message": "   ", "language": "en"})
    assert response.status_code == 400
    assert "empty" in response.json()["detail"]

def test_chat_dataset_match_endpoint():
    response = client.post(
        "/api/chat",
        json={
            "message": "What legal provisions apply to identity theft and computer passwords under IT Act?",
            "language": "en",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["dataset_match"] is True
    assert len(data["sources"]) > 0
    assert "disclaimer" in data
