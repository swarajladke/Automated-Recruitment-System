from app import app, db, User, Application
from werkzeug.security import generate_password_hash
import datetime

def inject_samples():
    with app.app_context():
        # Clear existing for fresh start if needed, but here we just add
        
        # 1. Sample Candidate 1: Cleared Challenge 1
        c1 = User(
            name="Sarah Jenkins",
            email="sarah.j@example.com",
            password=generate_password_hash("password123"),
            role="candidate",
            phone="+1 555-0101",
            experience_years=5
        )
        db.session.add(c1)
        db.session.flush() # Get ID
        
        a1 = Application(
            user_id=c1.id,
            applied_role="Senior Frontend Developer",
            status="MCQ_CLEARED",
            mcq_score=85,
            ai_score=0,
            coding_score=50,
            questions_solved=1,
            test_cases_cleared=5,
            resume_data={
                "skills": ["React", "TypeScript", "Node.js"],
                "match_score": 92,
                "summary": "Expert frontend engineer with strong algorithmic foundations. Cleared the first hard-tier challenge with optimal complexity."
            }
        )
        db.session.add(a1)
        
        # 2. Sample Candidate 2: Cleared All Challenges
        c2 = User(
            name="Marcus Chen",
            email="m.chen@example.com",
            password=generate_password_hash("password123"),
            role="candidate",
            phone="+1 555-0202",
            experience_years=8
        )
        db.session.add(c2)
        db.session.flush()
        
        a2 = Application(
            user_id=c2.id,
            applied_role="AI Research Scientist",
            status="CODING_CLEARED",
            mcq_score=95,
            ai_score=88,
            coding_score=100,
            questions_solved=2,
            test_cases_cleared=10,
            resume_data={
                "skills": ["Python", "PyTorch", "LLMs"],
                "match_score": 98,
                "summary": "Senior AI researcher. Demonstrates exceptional problem-solving skills, clearing all hard-tier challenges with perfect test case pass rates."
            }
        )
        db.session.add(a2)
        
        db.session.commit()
        print("Successfully injected 2 high-fidelity sample candidates.")

if __name__ == "__main__":
    inject_samples()
