from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import resend
import requests
import json
from dotenv import load_dotenv
import google.generativeai as genai
import cv2
import numpy as np
import base64
from io import BytesIO
from PIL import Image

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
resend.api_key = os.getenv('RESEND_API_KEY')
BREVO_API_KEY = os.getenv('BREVO_API_KEY', 'xkeysib-mock-key')

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///recruitment.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

db = SQLAlchemy(app)
import datetime

# Global store for live code synchronization
live_code_sessions = {}

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='candidate') # 'candidate' or 'admin'
    phone = db.Column(db.String(20))
    experience_years = db.Column(db.Integer, default=0)
    applications = db.relationship('Application', backref='user', lazy=True)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    applied_role = db.Column(db.String(100), default='Senior Frontend Developer')
    status = db.Column(db.String(50), default='APPLIED')
    mcq_score = db.Column(db.Integer, default=0)
    ai_score = db.Column(db.Integer, default=0)
    coding_score = db.Column(db.Integer, default=0)
    questions_solved = db.Column(db.Integer, default=0)
    test_cases_cleared = db.Column(db.Integer, default=0)
    interview_time = db.Column(db.String(100)) # Stores scheduled time (e.g., "May 20, 2:00 PM")
    resume_url = db.Column(db.String(200))
    resume_data = db.Column(db.JSON)
    mcq_violations = db.Column(db.Integer, default=0)
    coding_violations = db.Column(db.Integer, default=0)
    applied_date = db.Column(db.DateTime, default=db.func.current_timestamp())

@app.route('/admin/schedule-interview', methods=['POST'])
def schedule_interview():
    data = request.json
    app_record = Application.query.get(data['application_id'])
    if not app_record: return jsonify({'message': 'Application not found'}), 404
    
    app_record.interview_time = data['interview_time']
    app_record.status = 'INTERVIEW_SCHEDULED'
    db.session.commit()
    return jsonify({'message': 'Interview scheduled successfully', 'new_status': app_record.status})

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, nullable=False)
    receiver_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    sender_name = db.Column(db.String(100))
    sender_role = db.Column(db.String(20)) # 'candidate' or 'admin'

class MCQQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(100), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False) # List of strings
    correct_answer = db.Column(db.String(200), nullable=False)

class CodingQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    difficulty = db.Column(db.String(20), default='Medium')  # Easy / Medium / Hard
    starter_code = db.Column(db.Text, default='')
    test_cases = db.Column(db.JSON, nullable=False)  # [{input, expected_output}]
    time_limit_mins = db.Column(db.Integer, default=30)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    dept = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), default='Remote')
    type = db.Column(db.String(50), default='Full-time')
    salary = db.Column(db.String(100))
    description = db.Column(db.Text, default='')
    requirements = db.Column(db.Text, default='')
    posted_date = db.Column(db.DateTime, default=db.func.current_timestamp())

# Create Database
with app.app_context():
    db.create_all()
    # Create default admin if not exists
    if not User.query.filter_by(email='admin@hr.com').first():
        admin = User(
            name='Admin User',
            email='admin@hr.com',
            password=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()

# APIs
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=generate_password_hash(data['password']),
        role='candidate'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created', 'id': new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role
        }), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/candidate-status/<int:id>', methods=['GET'])
def get_status(id):
    # This now returns the LATEST application or all applications
    user = User.query.get(id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    apps = Application.query.filter_by(user_id=id).order_by(Application.applied_date.desc()).all()
    
    result_apps = []
    for app_record in apps:
        result_apps.append({
            'id': app_record.id,
            'status': app_record.status,
            'applied_role': app_record.applied_role,
            'applied_date': app_record.applied_date.strftime("%b %d, %Y"),
            'scores': {
                'mcq': app_record.mcq_score,
                'ai': app_record.ai_score,
                'coding': app_record.coding_score
            },
            'interview_time': app_record.interview_time,
            'resume_insight': app_record.resume_data,
            'resume_url': app_record.resume_url
        })

    return jsonify({
        'id': user.id,
        'name': user.name,
        'phone': user.phone,
        'experience': user.experience_years,
        'applications': result_apps
    })

@app.route('/receive-score', methods=['POST'])
def receive_score():
    data = request.json
    app_id = data.get('application_id')
    candidate_id = data.get('candidate_id')
    module = data.get('module') # 'mcq', 'ai', 'coding'
    score = data.get('score')
    if score is None:
        score = 0
    
    # Try to find specific application, fallback to latest for compatibility
    if app_id:
        app_record = Application.query.get(app_id)
    else:
        app_record = Application.query.filter_by(user_id=candidate_id).order_by(Application.applied_date.desc()).first()

    if not app_record:
        return jsonify({'message': 'Application not found'}), 404
    
    # Extract violations count if provided
    violations_count = data.get('violations_count', 0)
    
    # Handle detailed coding scores
    if 'questions_solved' in data:
        app_record.questions_solved = data.get('questions_solved', 0)
        app_record.test_cases_cleared = data.get('test_cases_cleared', 0)
        app_record.coding_violations = violations_count
        
        # GRANULAR SCORING: Total Test Cases cleared / Total available
        total_tc = data.get('total_test_cases', 10) # Fallback to 10 if not provided
        app_record.coding_score = int((app_record.test_cases_cleared / total_tc) * 100) if total_tc > 0 else 0
        
        app_record.status = 'CODING_CLEARED' if app_record.coding_score >= 50 else 'REJECTED'
    
    # Legacy module support
    elif module == 'mcq':
        app_record.mcq_score = score
        app_record.mcq_violations = violations_count
        app_record.status = 'MCQ_CLEARED' if score >= 60 else 'REJECTED'
    elif module == 'ai':
        app_record.ai_score = score
        app_record.status = 'AI_CLEARED' if score >= 60 else 'REJECTED'
    elif module == 'coding':
        app_record.coding_score = score
        app_record.coding_violations = violations_count
        app_record.status = 'CODING_CLEARED' if score >= 60 else 'REJECTED'
            
    db.session.commit()
    return jsonify({'message': f'Score updated', 'new_status': app_record.status})

import requests

def send_email_via_brevo(email, type, match_score=0):
    """Sends a real email via Brevo API"""
    try:
        api_key = BREVO_API_KEY
        sender_email = os.getenv('BREVO_SENDER_EMAIL')
        sender_name = os.getenv('BREVO_SENDER_NAME', 'HireFlow AI')
        
        if not api_key or not sender_email or api_key == 'xkeysib-mock-key':
            print(f"\n[BREVO] SKIPPING: Email not sent to {email} (API Key or Sender Email missing)", flush=True)
            return
        if type == "INVITATION":
            subject = "Congratulations! You've cleared the initial screening 🚀"
            html_content = f"""
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #10b981;">Great news from HireFlow AI!</h2>
                    <p>We loved your profile (AI Match Score: <strong>{match_score}%</strong>). You've been selected to move forward to the next stage.</p>
                    <p style="margin: 30px 0;">
                        <a href="http://localhost:5173/auth?mode=signup&email={email}" 
                           style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                           Complete Your Application
                        </a>
                    </p>
                    <p style="color: #64748b; font-size: 0.9rem;">If the button doesn't work, copy this link: http://localhost:5173/auth?mode=signup&email={email}</p>
                </div>
            """
        else:
            subject = "Application Update - HireFlow AI"
            html_content = f"""
                <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h2 style="color: #64748b;">Thank you for applying</h2>
                    <p>We appreciate your interest in the position. After an AI review, we've decided to move forward with other candidates at this time.</p>
                    <p>We'll keep your resume on file for future opportunities that match your skills.</p>
                </div>
            """

        payload = {
            "sender": {"name": sender_name, "email": sender_email},
            "to": [{"email": email}],
            "subject": subject,
            "htmlContent": html_content
        }
        
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "api-key": api_key
        }

        response = requests.post("https://api.brevo.com/v3/smtp/email", json=payload, headers=headers)
        
        if response.status_code in [200, 201, 202]:
            print(f"\n[BREVO] SUCCESS: Email sent to {email}", flush=True)
        else:
            print(f"\n[BREVO] ERROR: {response.text}", flush=True)
            
    except Exception as e:
        print(f"\n[BREVO] EXCEPTION: {str(e)}", flush=True)

@app.route('/guest/apply', methods=['POST'])
def guest_apply():
    data = request.json
    email = data.get('email')
    experience = int(data.get('experience', 0))
    role = data.get('role', 'Senior Frontend Developer')
    
    # 1. Instant AI Analysis (Probabilistic logic for demo)
    import random
    if experience >= 3:
        match_score = random.randint(75, 98)
    else:
        match_score = random.randint(45, 75)
        
    status = 'PASS' if match_score >= 60 else 'FAIL'
    
    print(f"\n[AI-ATS] Decision for {email}: {status} (Score: {match_score}%)", flush=True)
    
    # 2. Trigger Real Email via Brevo
    send_email_via_brevo(email, "INVITATION" if status == 'PASS' else "REJECTION", match_score)
    
    return jsonify({
        "status": status,
        "message": "AI Screening complete. Result sent via email.",
        "match_score": match_score
    })

@app.route('/admin/update-status', methods=['POST'])
def update_final_status():
    data = request.json
    app_record = Application.query.get(data['application_id'])
    if not app_record: return jsonify({'message': 'Not found'}), 404
    
    app_record.status = data['status'] # e.g., 'SELECTED' or 'REJECTED'
    db.session.commit()
    return jsonify({'message': 'Status updated'})

@app.route('/candidate/apply', methods=['POST'])
def apply_for_job():
    data = request.json
    user = User.query.get(data['candidate_id'])
    if not user: return jsonify({'message': 'Not found'}), 404
    
    # Check for existing application to prevent duplicates (Case-insensitive & Trimmed)
    role_name = data['role'].strip()
    existing_app = Application.query.filter(
        Application.user_id == user.id,
        db.func.lower(Application.applied_role) == role_name.lower()
    ).first()
    
    if existing_app:
        return jsonify({
            'message': f'You have already applied for {role_name}.',
            'status': 'ALREADY_APPLIED'
        }), 400
        
    # Create NEW Application instead of updating User
    new_app = Application(
        user_id=user.id,
        applied_role=data['role'],
        resume_url=data.get('resume_name'),
        status='APPLIED'
    )
    
    user.phone = data.get('phone')
    user.experience_years = data.get('experience')
    
    # AI Resume Screening Logic (Mocked for Demo)
    role_keywords = {
        'Senior Frontend Developer': ['React', 'Next.js', 'Tailwind', 'TypeScript', 'Redux'],
        'AI Research Scientist': ['Python', 'PyTorch', 'NLP', 'TensorFlow', 'LLMs'],
        'Full Stack Engineer': ['Node.js', 'React', 'PostgreSQL', 'Docker', 'AWS']
    }
    
    target_skills = role_keywords.get(new_app.applied_role, ['Communication', 'Teamwork', 'Problem Solving'])
    import random
    extracted_skills = random.sample(target_skills, min(len(target_skills), 4))
    
    try:
        exp = int(user.experience_years or 0)
    except:
        exp = 0
        
    match_score = random.randint(65, 95) if exp >= 3 else random.randint(40, 60)
    
    new_app.resume_data = {
        'skills': extracted_skills,
        'match_score': match_score,
        'summary': f"Candidate has {user.experience_years} years of experience. Demonstrated proficiency in {', '.join(extracted_skills)}. AI match confidence is high for the {new_app.applied_role} position."
    }
    
    if match_score < 60:
        new_app.status = 'REJECTED'
        new_app.resume_data['summary'] = "Application filtered by AI-ATS. Qualification criteria (Match < 60%) not met for this specific role."
    else:
        new_app.status = 'APPLIED' 

    db.session.add(new_app)
    db.session.commit()
    return jsonify({'message': 'Application processed', 'status': new_app.status, 'resume_screening': new_app.resume_data, 'application_id': new_app.id})

@app.route('/admin/candidates', methods=['GET'])
def get_all_candidates():
    apps = Application.query.order_by(Application.applied_date.desc()).all()
    result = []
    for a in apps:
        u = a.user
        result.append({
            'id': u.id,
            'application_id': a.id,
            'name': u.name,
            'email': u.email,
            'status': a.status,
            'applied_role': a.applied_role,
            'scores': {
                'mcq': a.mcq_score,
                'ai': a.ai_score,
                'coding': a.coding_score,
                'coding_details': {
                    'solved': a.questions_solved,
                    'test_cases': a.test_cases_cleared
                }
            },
            'interview_time': a.interview_time,
            'resume_insight': a.resume_data,
            'proctoring': {
                'mcq_violations': getattr(a, 'mcq_violations', 0),
                'coding_violations': getattr(a, 'coding_violations', 0)
            }
        })
    return jsonify(result)

@app.route('/messages/send', methods=['POST'])
def send_message():
    data = request.json
    new_msg = Message(
        sender_id=data['sender_id'],
        receiver_id=data['receiver_id'],
        content=data['content'],
        sender_name=data.get('sender_name', 'User'),
        sender_role=data.get('sender_role', 'candidate')
    )
    db.session.add(new_msg)
    db.session.commit()
    return jsonify({'message': 'Sent', 'id': new_msg.id}), 201

@app.route('/messages/<int:user_id>', methods=['GET'])
def get_messages(user_id):
    # Get messages where user is either sender or receiver
    messages = Message.query.filter(
        (Message.sender_id == user_id) | (Message.receiver_id == user_id)
    ).order_by(Message.timestamp.asc()).all()
    
    result = []
    for m in messages:
        result.append({
            'id': m.id,
            'sender_id': m.sender_id,
            'receiver_id': m.receiver_id,
            'content': m.content,
            'timestamp': m.timestamp.strftime("%H:%M"),
            'sender_name': m.sender_name,
            'sender_role': m.sender_role
        })
    return jsonify(result)

# MCQ Management APIs
@app.route('/admin/mcq', methods=['POST'])
def add_mcq():
    data = request.json
    new_q = MCQQuestion(
        role=data['role'],
        question=data['question'],
        options=data['options'],
        correct_answer=data['correct_answer']
    )
    db.session.add(new_q)
    db.session.commit()
    return jsonify({'message': 'Question added', 'id': new_q.id}), 201

@app.route('/admin/mcq', methods=['GET'])
def get_all_mcqs():
    questions = MCQQuestion.query.all()
    result = []
    for q in questions:
        result.append({
            'id': q.id,
            'role': q.role,
            'question': q.question,
            'options': q.options,
            'correct_answer': q.correct_answer
        })
    return jsonify(result)

@app.route('/admin/mcq/<int:id>', methods=['DELETE'])
def delete_mcq(id):
    q = MCQQuestion.query.get(id)
    if not q: return jsonify({'message': 'Not found'}), 404
    db.session.delete(q)
    db.session.commit()
    return jsonify({'message': 'Question deleted'})

# ─── Coding Question Management APIs ─────────────────────────────────────────

@app.route('/admin/coding-questions', methods=['POST'])
def add_coding_question():
    data = request.json
    if not data.get('role') or not data.get('title') or not data.get('description') or not data.get('test_cases'):
        return jsonify({'message': 'Missing required fields'}), 400
    new_q = CodingQuestion(
        role=data['role'],
        title=data['title'],
        description=data['description'],
        difficulty=data.get('difficulty', 'Medium'),
        starter_code=data.get('starter_code', ''),
        test_cases=data['test_cases'],
        time_limit_mins=int(data.get('time_limit_mins', 30))
    )
    db.session.add(new_q)
    db.session.commit()
    return jsonify({'message': 'Coding question added', 'id': new_q.id}), 201

@app.route('/admin/coding-questions', methods=['GET'])
def get_all_coding_questions():
    questions = CodingQuestion.query.all()
    result = [{
        'id': q.id, 'role': q.role, 'title': q.title,
        'description': q.description, 'difficulty': q.difficulty,
        'starter_code': q.starter_code, 'test_cases': q.test_cases,
        'time_limit_mins': q.time_limit_mins
    } for q in questions]
    return jsonify(result)

@app.route('/admin/coding-questions/<int:id>', methods=['DELETE'])
def delete_coding_question(id):
    q = CodingQuestion.query.get(id)
    if not q:
        return jsonify({'message': 'Not found'}), 404
    db.session.delete(q)
    db.session.commit()
    return jsonify({'message': 'Question deleted'})

@app.route('/candidate/coding-questions', methods=['GET'])
def get_candidate_coding_questions():
    role = request.args.get('role')
    if role:
        questions = CodingQuestion.query.filter_by(role=role).all()
        if not questions:
            questions = CodingQuestion.query.limit(2).all()
    else:
        questions = CodingQuestion.query.limit(2).all()
    result = [{
        'id': q.id, 'title': q.title, 'description': q.description,
        'difficulty': q.difficulty, 'starter_code': q.starter_code,
        'test_cases': q.test_cases, 'time_limit_mins': q.time_limit_mins
    } for q in questions]
    return jsonify(result)

@app.route('/admin/coding-questions/init-defaults', methods=['POST'])
def init_default_coding_questions():
    defaults = [
        {
            'role': 'Full Stack Engineer',
            'title': 'Two Sum',
            'description': 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nExample:\nInput: nums = [2, 7, 11, 15], target = 9\nOutput: [0, 1]\nExplanation: nums[0] + nums[1] == 9, return [0, 1].',
            'difficulty': 'Easy',
            'starter_code': 'def two_sum(nums, target):\n    # Write your solution here\n    pass',
            'test_cases': [
                {'input': '[2,7,11,15], 9', 'expected_output': '[0, 1]'},
                {'input': '[3,2,4], 6', 'expected_output': '[1, 2]'},
                {'input': '[3,3], 6', 'expected_output': '[0, 1]'}
            ],
            'time_limit_mins': 20
        },
        {
            'role': 'Senior Frontend Developer',
            'title': 'Flatten Nested Array',
            'description': 'Write a function that flattens a nested array of any depth into a single-level array.\n\nExample:\nInput: [[1,2,[3]],4,[5,[6,7]]]\nOutput: [1,2,3,4,5,6,7]',
            'difficulty': 'Medium',
            'starter_code': 'def flatten(arr):\n    # Write your solution here\n    pass',
            'test_cases': [
                {'input': '[[1,2,[3]],4]', 'expected_output': '[1, 2, 3, 4]'},
                {'input': '[[1,[2,[3,[4]]]]]', 'expected_output': '[1, 2, 3, 4]'},
                {'input': '[1,2,3]', 'expected_output': '[1, 2, 3]'}
            ],
            'time_limit_mins': 25
        },
        {
            'role': 'AI Research Scientist',
            'title': 'Valid Parentheses',
            'description': 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.\n\nA string is valid if:\n- Open brackets are closed by the same type.\n- Open brackets are closed in the correct order.\n\nExample:\nInput: s = "()[]{}"\nOutput: True',
            'difficulty': 'Easy',
            'starter_code': 'def is_valid(s):\n    # Write your solution here\n    pass',
            'test_cases': [
                {'input': '"()"', 'expected_output': 'True'},
                {'input': '"()[]{}"', 'expected_output': 'True'},
                {'input': '"(]"', 'expected_output': 'False'}
            ],
            'time_limit_mins': 20
        }
    ]
    added = 0
    for d in defaults:
        if not CodingQuestion.query.filter_by(title=d['title']).first():
            q = CodingQuestion(**d)
            db.session.add(q)
            added += 1
    db.session.commit()
    return jsonify({'message': f'{added} default questions initialized'})

# ─── End Coding Question APIs ─────────────────────────────────────────────────

@app.route('/candidate/mcq', methods=['GET'])
def get_candidate_mcqs():
    role = request.args.get('role')
    if not role:
        questions = MCQQuestion.query.limit(10).all()
    else:
        questions = MCQQuestion.query.filter_by(role=role).all()
        # Fallback if no questions for this role
        if not questions:
            questions = MCQQuestion.query.limit(10).all()
            
    result = []
    for q in questions:
        result.append({
            'id': q.id,
            'question': q.question,
            'options': q.options,
            'answer': q.correct_answer
        })
    return jsonify(result)

@app.route('/admin/mcq/init-defaults', methods=['POST'])
def init_default_mcqs():
    defaults = [
        {"role": "Senior Frontend Developer", "question": "What is the primary benefit of React Virtual DOM?", "options": ["Faster rendering by batching updates", "Direct manipulation of real DOM", "Eliminates need for CSS", "Automatic database connection"], "correct_answer": "Faster rendering by batching updates"},
        {"role": "AI Research Scientist", "question": "What does GPT stand for in LLMs?", "options": ["Generative Pre-trained Transformer", "General Purpose Tool", "Global Positioning Technology", "Graphical Processing Task"], "correct_answer": "Generative Pre-trained Transformer"},
        {"role": "Full Stack Engineer", "question": "Which of these is a non-relational (NoSQL) database?", "options": ["MongoDB", "PostgreSQL", "MySQL", "Oracle"], "correct_answer": "MongoDB"}
    ]
    for d in defaults:
        if not MCQQuestion.query.filter_by(question=d['question']).first():
            q = MCQQuestion(**d)
            db.session.add(q)
    db.session.commit()
    return jsonify({'message': 'Defaults initialized'})

# Job Management APIs
@app.route('/admin/jobs', methods=['POST'])
def add_job():
    data = request.json
    new_job = Job(
        title=data['title'],
        dept=data['dept'],
        location=data.get('location', 'Remote'),
        type=data.get('type', 'Full-time'),
        salary=data.get('salary', 'Competitive'),
        description=data.get('description', ''),
        requirements=data.get('requirements', '')
    )
    db.session.add(new_job)
    db.session.commit()
    return jsonify({'message': 'Job posted', 'id': new_job.id}), 201

@app.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = Job.query.order_by(Job.posted_date.desc()).all()
    result = []
    for j in jobs:
        result.append({
            'id': j.id,
            'title': j.title,
            'dept': j.dept,
            'location': j.location,
            'type': j.type,
            'salary': j.salary,
            'description': j.description,
            'requirements': j.requirements,
            'posted': 'Recently' # Simplified for demo
        })
    return jsonify(result)

@app.route('/admin/jobs/<int:id>', methods=['DELETE'])
def delete_job(id):
    j = Job.query.get(id)
    if not j: return jsonify({'message': 'Not found'}), 404
    db.session.delete(j)
    db.session.commit()
    return jsonify({'message': 'Job deleted'})

@app.route('/admin/jobs/init-defaults', methods=['POST'])
def init_default_jobs():
    defaults = [
        { 'title': 'Senior Frontend Developer', 'dept': 'Engineering', 'location': 'Remote', 'type': 'Full-time', 'salary': '$120k - $160k' },
        { 'title': 'AI Research Scientist', 'dept': 'AI Labs', 'location': 'San Francisco, CA', 'type': 'Full-time', 'salary': '$180k - $240k' },
        { 'title': 'Product Designer', 'dept': 'Design', 'location': 'New York, NY', 'type': 'Contract', 'salary': '$80/hr - $110/hr' }
    ]
    for d in defaults:
        if not Job.query.filter_by(title=d['title']).first():
            j = Job(**d)
            db.session.add(j)
    db.session.commit()
    return jsonify({'message': 'Default jobs initialized'})

@app.route('/sync-code', methods=['POST'])
def sync_code():
    data = request.json
    app_id = data.get('application_id')
    code = data.get('code')
    language = data.get('language')
    
    if not app_id:
        return jsonify({"error": "Missing application_id"}), 400
        
    live_code_sessions[str(app_id)] = {
        "code": code or live_code_sessions.get(str(app_id), {}).get("code", ""),
        "language": language or live_code_sessions.get(str(app_id), {}).get("language", "javascript"),
        "is_sharing": data.get("is_sharing", live_code_sessions.get(str(app_id), {}).get("is_sharing", False)),
        "is_cam_off": data.get("is_cam_off", live_code_sessions.get(str(app_id), {}).get("is_cam_off", False)),
        "last_updated": datetime.datetime.now().isoformat()
    }
    return jsonify({"status": "success"})

@app.route('/get-synced-code/<app_id>', methods=['GET'])
def get_synced_code(app_id):
    session = live_code_sessions.get(str(app_id))
    if not session:
        return jsonify({"code": "", "language": "javascript", "is_sharing": False})
    return jsonify(session)

@app.route('/proctor/analyze-frame', methods=['POST'])
def analyze_proctor_frame():
    data = request.json
    frame_data = data.get('frame')
    candidate_id = data.get('candidate_id')
    app_id = data.get('application_id')
    
    if not frame_data:
        return jsonify({"error": "Missing frame data"}), 400
        
    try:
        # 1. Decode Base64 Image to OpenCV format
        header, encoded = frame_data.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({"error": "Invalid image data"}), 400
            
        # 2. Convert to grayscale for face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 3. Load OpenCV Haar Cascade
        # We use the default frontal face classifier
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # 4. Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        num_faces = len(faces)
        
        # 5. Evaluate Rules
        violation_detected = False
        reason = "Candidate focused"
        
        if num_faces == 0:
            violation_detected = True
            reason = "Candidate not detected in frame. Please face the screen."
        elif num_faces > 1:
            violation_detected = True
            reason = "Multiple people detected in frame."
            
        analysis = {
            "violation_detected": violation_detected,
            "reason": reason,
            "confidence": 1.0,
            "faces_count": num_faces
        }
        
        # 6. Log violation if detected
        if violation_detected:
            print(f"\n[SECURITY ALERT] Candidate {candidate_id} (App: {app_id}): {reason}", flush=True)
            
        return jsonify(analysis)
        
    except Exception as e:
        print(f"Proctoring Error: {str(e)}", flush=True)
        return jsonify({"error": "Analysis failed", "details": str(e)}), 500

if __name__ == '__main__':
    # Ensure database is clean for presentation if needed, or just keep it
    app.run(debug=True, port=5001, host='0.0.0.0')
