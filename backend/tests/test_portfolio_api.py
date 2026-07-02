"""Backend regression tests for Portfolio API (iteration 2).

Covers:
- Health: GET /api/
- Contact: POST /api/contact (valid + validation)
- Contact list: GET /api/contact
"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://senior-eng-portfolio-2.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Health ---
class TestHealth:
    def test_root_ok(self, api_client):
        r = api_client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("message") == "Portfolio API online"


# --- Contact submission ---
class TestContact:
    def test_submit_valid(self, api_client):
        payload = {
            "name": "TEST_Iteration2",
            "email": "test_iter2@example.com",
            "message": "Regression test after theme toggle + hero enhancements.",
        }
        r = api_client.post(f"{API}/contact", json=payload, timeout=20)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body.get("status") == "success"
        assert isinstance(body.get("id"), str) and len(body["id"]) > 0
        assert "email_sent" in body

    def test_submit_missing_fields(self, api_client):
        r = api_client.post(f"{API}/contact", json={"name": "x"}, timeout=15)
        assert r.status_code == 422

    def test_submit_invalid_email(self, api_client):
        payload = {"name": "TEST", "email": "not-an-email", "message": "hi"}
        r = api_client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_submit_empty_strings(self, api_client):
        payload = {"name": "", "email": "", "message": ""}
        r = api_client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 422

    def test_list_contains_recent(self, api_client):
        # Ensure at least one message via a POST first
        payload = {
            "name": "TEST_ListCheck",
            "email": "list_check@example.com",
            "message": "list regression",
        }
        api_client.post(f"{API}/contact", json=payload, timeout=20)
        r = api_client.get(f"{API}/contact", timeout=20)
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        assert any(m.get("email") == "list_check@example.com" for m in arr)
