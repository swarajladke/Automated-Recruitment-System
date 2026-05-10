from app import app, db, User, Application
import json

with app.app_context():
    users = User.query.all()
    apps = Application.query.all()
    
    print("\n--- Registered Users ---")
    for u in users:
        print(f"ID: {u.id} | Email: {u.email} | Name: {u.name}")
        
    print("\n--- Applications ---")
    for a in apps:
        print(f"AppID: {a.id} | UserID: {a.user_id} | Role: {a.applied_role} | Status: {a.status}")
