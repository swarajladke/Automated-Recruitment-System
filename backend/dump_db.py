import sqlite3
import json

db_path = 'instance/recruitment.db'

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    with open('../DB_DUMP.md', 'w', encoding='utf-8') as f:
        f.write('# Database Dump\n\n')
        for table_name in tables:
            table_name = table_name[0]
            cursor.execute(f"SELECT * from {table_name}")
            rows = cursor.fetchall()
            f.write(f'## Table: {table_name}\n```json\n')
            f.write(json.dumps([dict(row) for row in rows], indent=2))
            f.write('\n```\n\n')
            
    conn.close()
except Exception as e:
    print(f"Error: {e}")
