import unittest

import psycopg2

from app.config import settings


class UserSchemaTest(unittest.TestCase):
    def test_users_table_matches_temuin_auth_schema(self):
        conn = psycopg2.connect(settings.DATABASE_URL)
        try:
            cur = conn.cursor()
            cur.execute(
                "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users'"
            )
            columns = {row[0]: row[1] for row in cur.fetchall()}
        finally:
            conn.close()

        self.assertEqual(columns.get("id"), "character varying")
        self.assertIn("firebase_uid", columns)
        self.assertIn("password_hash", columns)
        self.assertIn("role", columns)
        self.assertIn("phone", columns)


if __name__ == "__main__":
    unittest.main()
