from app import app, db, User
with app.app_context():
    db.drop_all()
    db.create_all()
    print("Database cleared successfully.")
