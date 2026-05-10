from app import app, db, User
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()
    
    # Re-create Admin account
    admin = User(
        name="Admin HR",
        email="admin@hr.com",
        password=generate_password_hash("admin123"),
        role="admin"
    )
    db.session.add(admin)
    db.session.commit()
    
    print("Database cleared and Admin account recreated!")
