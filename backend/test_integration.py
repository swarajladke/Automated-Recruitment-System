import requests
import json

# Configuration
BASE_URL = "http://127.0.0.1:5001"
CANDIDATE_ID = 2 # Change this to the ID of a registered candidate

def send_score(module, score):
    payload = {
        "candidate_id": CANDIDATE_ID,
        "module": module,
        "score": score
    }
    response = requests.post(f"{BASE_URL}/receive-score", json=payload)
    print(f"Status for {module}: {response.status_code}")
    print(response.json())

if __name__ == "__main__":
    print("Simulating Score Updates...")
    # Simulate MCQ Pass
    send_score("mcq", 85)
    
    # Simulate AI Pass
    # send_score("ai", 75)
    
    # Simulate Final Pass
    # send_score("final", 90)
