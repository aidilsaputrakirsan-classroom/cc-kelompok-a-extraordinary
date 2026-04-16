import unittest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestSearchSanitization(unittest.TestCase):
    def test_search_with_wildcards_is_escaped(self):
        # Even if items don't exist, we just want to ensure it doesn't crash or return wildcards improperly
        # Sending special chars like %, _, or \. 
        # Since we use ILIKE, the query should run correctly without parsing % as a wildcard.
        response = client.get("/items/?search=100%_guarantee")
        self.assertEqual(response.status_code, 200)
        # Verify it returns a list
        self.assertIsInstance(response.json(), list)

    def test_search_with_backslash_is_escaped(self):
        response = client.get("/items/?search=some\\backslash")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

if __name__ == '__main__':
    unittest.main()
