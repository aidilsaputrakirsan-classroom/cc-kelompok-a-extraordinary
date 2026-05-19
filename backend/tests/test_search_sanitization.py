"""Tests for items search sanitization (SQL LIKE wildcard escaping).

Refactored from unittest.TestCase to pytest function style + fixtures
per BE-5.1.
"""


def test_search_with_wildcards_is_escaped(client):
    response = client.get("/items/?search=100%_guarantee")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_search_with_backslash_is_escaped(client):
    response = client.get("/items/?search=some\\backslash")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_search_with_special_chars_does_not_crash(client):
    """Composite test for various special characters in search input."""
    for search_term in ["%%%", "___", "100%_special\\chars", "'; DROP TABLE items;--"]:
        response = client.get(f"/items/?search={search_term}")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
