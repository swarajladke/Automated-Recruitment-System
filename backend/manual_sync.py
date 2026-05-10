from app import app, db, Application

with app.app_context():
    # Check if application already exists to avoid duplicates
    existing = Application.query.filter_by(user_id=3).first()
    if not existing:
        new_app = Application(
            user_id=3, 
            applied_role='Senior Frontend Developer', 
            status='APPLIED', 
            resume_url='resume_v1.pdf'
        )
        db.session.add(new_app)
        db.session.commit()
        print("SUCCESS: Manually synced application for User ID 3 (Viraj)")
    else:
        print("INFO: User ID 3 already has an application.")
