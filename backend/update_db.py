import sqlite3
import os

db_path = 'instance/recruitment.db'
if not os.path.exists(db_path):
    print(f"Database {db_path} not found.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(application)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'interview_time' not in columns:
            cursor.execute('ALTER TABLE application ADD COLUMN interview_time TEXT')
            print("Successfully added 'interview_time' column to 'application' table.")
        else:
            print("'interview_time' column already exists.")
            
        conn.commit()
    except Exception as e:
        print(f"Error updating database: {e}")
    finally:
        conn.close()
