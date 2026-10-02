import sqlite3

conn = sqlite3.connect("database/sadeka_dummy.db")

tables = conn.execute("""
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
    ORDER BY name
""").fetchall()

print(tables)

conn.close()