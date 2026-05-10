from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

def load_questions():
    file_path = os.path.join(os.path.dirname(__file__), 'questions.json')
    with open(file_path, 'r') as f:
        return json.load(f)

@app.route('/questions', methods=['GET'])
def get_questions():
    questions = load_questions()
    # Remove answers before sending to frontend
    safe_questions = []
    for q in questions:
        safe_q = {
            'id': q['id'],
            'question': q['question'],
            'options': q['options']
        }
        safe_questions.append(safe_q)
    return jsonify(safe_questions)

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    answers = data.get('answers', {})
    
    questions = load_questions()
    total = len(questions)
    score = 0
    
    # Evaluate answers
    for q in questions:
        q_id = str(q['id'])
        if q_id in answers and answers[q_id] == q['answer']:
            score += 1
            
    percentage = (score / total) * 100 if total > 0 else 0
    status = "PASS" if percentage >= 60 else "FAIL"
    
    return jsonify({
        'score': score,
        'total': total,
        'percentage': round(percentage, 2),
        'status': status
    })

@app.route('/send-score', methods=['POST'])
def send_score():
    # Mock integration endpoint
    data = request.json
    print(f"Received score for integration: {data}")
    return jsonify({
        "success": True,
        "message": "Score successfully sent to recruitment system.",
        "data_received": data
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
