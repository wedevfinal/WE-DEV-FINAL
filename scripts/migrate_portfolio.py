"""
Idempotent migration script to add `symbol` and `value` columns to `portfolios` table if missing.
Run with the project venv activated: `python scripts/migrate_portfolio.py`
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'finance.db')

def column_exists(cursor, table, column):
    cursor.execute(f"PRAGMA table_info('{table}')")
    cols = [r[1] for r in cursor.fetchall()]
    return column in cols

if __name__ == '__main__':
    if not os.path.exists(DB_PATH):
        print('finance.db not found, skipping migration')
        exit(0)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    added = []

    if not column_exists(cur, 'portfolios', 'symbol'):
        try:
            cur.execute("ALTER TABLE portfolios ADD COLUMN symbol TEXT")
            added.append('symbol')
        except Exception as e:
            print('Failed to add symbol column:', e)

    if not column_exists(cur, 'portfolios', 'value'):
        try:
            cur.execute("ALTER TABLE portfolios ADD COLUMN value REAL")
            added.append('value')
        except Exception as e:
            print('Failed to add value column:', e)

    conn.commit()
    conn.close()

    print('Migration complete. Added columns:', ', '.join(added) if added else 'none')
