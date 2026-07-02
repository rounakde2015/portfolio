"""Iteration 3: Backend tests for JWT-based Admin panel.

Covers:
- POST /api/admin/login (success + wrong password)
- GET /api/admin/verify (with & without token)
- GET /api/admin/messages (auth required, sorted desc)
- GET /api/admin/stats
- PATCH /api/admin/messages/{id}/read
- DELETE /api/admin/messages/{id}
- Public endpoints regression: GET /api/ + POST /api/contact
NOTE: Brute-force (429) is NOT tested here to avoid poisoning the IP for
downstream frontend tests. That is exercised in a separate script.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get(
    'REACT_APP_BACKEND_URL',
    'https://senior-eng-portfolio-2.preview.emergentagent.com',
).rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_PASSWORD = "changeme-in-env"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def admin_token(api_client):
    r = api_client.post(
        f"{API}/admin/login",
        json={"password": ADMIN_PASSWORD},
        timeout=15,
    )
    if r.status_code != 200:
        pytest.skip(f"Admin login failed ({r.status_code}): {r.text}")
    return r.json().get("token")


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}",
    }


@pytest.fixture(scope="module")
def seeded_message_id(api_client):
    payload = {
        "name": "TEST_AdminSeed",
        "email": "test_admin_seed@example.com",
        "message": "Seed message for admin CRUD tests.",
    }
    r = api_client.post(f"{API}/contact", json=payload, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()["id"]


# --- Public regression ---
class TestPublicRegression:
    def test_root(self, api_client):
        r = api_client.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        assert r.json().get("message") == "Portfolio API online"

    def test_contact_submit(self, api_client):
        payload = {
            "name": "TEST_Iter3Public",
            "email": "iter3_public@example.com",
            "message": "public regression",
        }
        r = api_client.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200
        body = r.json()
        assert body["status"] == "success"
        assert isinstance(body["id"], str) and len(body["id"]) > 0


# --- Admin login ---
class TestAdminLogin:
    def test_login_success(self, api_client):
        r = api_client.post(
            f"{API}/admin/login",
            json={"password": ADMIN_PASSWORD},
            timeout=15,
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert isinstance(data.get("token"), str) and len(data["token"]) > 20
        assert "expires_at" in data
        # Token is 3-part JWT
        assert data["token"].count(".") == 2

    def test_login_wrong_password(self, api_client):
        r = api_client.post(
            f"{API}/admin/login",
            json={"password": "wrong-password-xyz"},
            timeout=15,
        )
        assert r.status_code == 401
        assert "Invalid password" in r.json().get("detail", "")


# --- Admin verify ---
class TestAdminVerify:
    def test_verify_valid(self, api_client, auth_headers):
        r = api_client.get(f"{API}/admin/verify", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json().get("valid") is True

    def test_verify_invalid_token(self, api_client):
        r = api_client.get(
            f"{API}/admin/verify",
            headers={"Authorization": "Bearer garbage.token.here"},
            timeout=15,
        )
        assert r.status_code == 401

    def test_verify_no_token(self, api_client):
        r = api_client.get(f"{API}/admin/verify", timeout=15)
        assert r.status_code == 401


# --- Admin messages ---
class TestAdminMessages:
    def test_list_requires_auth(self, api_client):
        r = api_client.get(f"{API}/admin/messages", timeout=15)
        assert r.status_code == 401

    def test_list_with_auth(self, api_client, auth_headers, seeded_message_id):
        r = api_client.get(f"{API}/admin/messages", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        # Verify seeded present
        ids = [m["id"] for m in arr]
        assert seeded_message_id in ids
        # Verify sort desc by timestamp
        if len(arr) >= 2:
            for i in range(len(arr) - 1):
                assert arr[i]["timestamp"] >= arr[i + 1]["timestamp"], (
                    f"Not sorted desc at index {i}"
                )

    def test_stats(self, api_client, auth_headers):
        r = api_client.get(f"{API}/admin/stats", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert "total" in data and "unread" in data
        assert isinstance(data["total"], int) and data["total"] >= 1
        assert isinstance(data["unread"], int) and data["unread"] >= 0


# --- Read toggle ---
class TestReadToggle:
    def test_mark_read_persists(self, api_client, auth_headers, seeded_message_id):
        r = api_client.patch(
            f"{API}/admin/messages/{seeded_message_id}/read",
            json={"read": True},
            headers=auth_headers,
            timeout=15,
        )
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["id"] == seeded_message_id
        assert updated["read"] is True

        # Verify via list
        r2 = api_client.get(f"{API}/admin/messages", headers=auth_headers, timeout=15)
        target = next(m for m in r2.json() if m["id"] == seeded_message_id)
        assert target["read"] is True

    def test_mark_unread(self, api_client, auth_headers, seeded_message_id):
        r = api_client.patch(
            f"{API}/admin/messages/{seeded_message_id}/read",
            json={"read": False},
            headers=auth_headers,
            timeout=15,
        )
        assert r.status_code == 200
        assert r.json()["read"] is False

    def test_mark_unknown_returns_404(self, api_client, auth_headers):
        r = api_client.patch(
            f"{API}/admin/messages/nonexistent-id-xyz/read",
            json={"read": True},
            headers=auth_headers,
            timeout=15,
        )
        assert r.status_code == 404


# --- Delete ---
class TestDelete:
    def test_delete_and_gone(self, api_client, auth_headers):
        # First create a fresh message to delete
        payload = {
            "name": "TEST_DeleteMe",
            "email": "test_delete@example.com",
            "message": "to be removed",
        }
        r_create = api_client.post(f"{API}/contact", json=payload, timeout=15)
        assert r_create.status_code == 200
        mid = r_create.json()["id"]

        r_del = api_client.delete(
            f"{API}/admin/messages/{mid}",
            headers=auth_headers,
            timeout=15,
        )
        assert r_del.status_code == 200
        body = r_del.json()
        assert body.get("status") == "deleted" and body.get("id") == mid

        # Confirm no longer in list
        r_list = api_client.get(
            f"{API}/admin/messages", headers=auth_headers, timeout=15
        )
        ids = [m["id"] for m in r_list.json()]
        assert mid not in ids

    def test_delete_unknown_404(self, api_client, auth_headers):
        r = api_client.delete(
            f"{API}/admin/messages/nonexistent-xyz",
            headers=auth_headers,
            timeout=15,
        )
        assert r.status_code == 404
