#!/usr/bin/env python3
"""Simple migration: add phone, dob, is_student columns to users table if missing.

This script is safe to run multiple times; it checks existing columns before ALTER.
"""
import sqlite3
import os
import sys


def find_db_path():
    # prefer finance.db in current working directory
    cwd = os.getcwd()
    db_path = os.path.join(cwd, 'finance.db')
    if os.path.exists(db_path):
        return db_path
    # fallback: script directory parent
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidate = os.path.join(script_dir, '..', 'finance.db')
    candidate = os.path.abspath(candidate)
    if os.path.exists(candidate):
        return candidate
    print('ERROR: finance.db not found in cwd or script parent dir')
    sys.exit(2)


def main():
    db = find_db_path()
    print('Using DB:', db)
    conn = sqlite3.connect(db)
    cur = conn.cursor()

    # ensure users table exists
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
    if cur.fetchone() is None:
        print('ERROR: users table not found in DB')
        conn.close()
        sys.exit(3)

    cur.execute('PRAGMA table_info(users)')
    cols = [r[1] for r in cur.fetchall()]
    added = []

    if 'phone' not in cols:
        print('Adding column phone (TEXT)')
        cur.execute("ALTER TABLE users ADD COLUMN phone TEXT")
        added.append('phone')

    if 'dob' not in cols:
        print('Adding column dob (TEXT)')
        cur.execute("ALTER TABLE users ADD COLUMN dob TEXT")
        added.append('dob')

    if 'is_student' not in cols:
        print('Adding column is_student (BOOLEAN) with default 0')
        cur.execute("ALTER TABLE users ADD COLUMN is_student BOOLEAN DEFAULT 0")
        added.append('is_student')

    if 'age' not in cols:
        print('Adding column age (INTEGER)')
        cur.execute("ALTER TABLE users ADD COLUMN age INTEGER")
        added.append('age')

    conn.commit()
    print('Migration complete. Added columns:', added if added else 'none')
    conn.close()


if __name__ == '__main__':
    main()
