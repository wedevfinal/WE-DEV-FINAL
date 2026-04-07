"""Simple migration script to add `completed_courses` column to `users` table
and create any new tables (achievements_master, user_achievements).

Run with the project's venv active:

    python scripts/migrate_add_achievements.py

This is safe to run multiple times — it checks for the column/table existence.
"""
import sqlite3
from sqlalchemy import create_engine
from app.database import DATABASE_URL, engine, init_db

DB_PATH = DATABASE_URL.replace("sqlite:///", "")

def column_exists(conn, table, column):
    cur = conn.cursor()
    cur.execute(f"PRAGMA table_info('{table}')")
    cols = [r[1] for r in cur.fetchall()]
    return column in cols


def add_column_if_missing(conn, table, column, definition):
    if column_exists(conn, table, column):
        print(f"Column '{column}' already exists on '{table}' — skipping")
        return
    sql = f"ALTER TABLE {table} ADD COLUMN {column} {definition};"
    print("Running:", sql)
    cur = conn.cursor()
    cur.execute(sql)
    conn.commit()
    print(f"Added column '{column}' to '{table}'")


if __name__ == '__main__':
    print("Using DB:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    try:
        add_column_if_missing(conn, 'users', 'completed_courses', 'INTEGER DEFAULT 0')
    finally:
        conn.close()

    # Create any new tables defined by SQLAlchemy models
    print("Creating missing tables from SQLAlchemy models (if any)...")
    init_db()
    print("Migration complete.")
