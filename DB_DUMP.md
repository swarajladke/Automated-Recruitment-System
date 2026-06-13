# Database Dump

## Table: user
```json
[
  {
    "id": 1,
    "name": "Admin HR",
    "email": "admin@hr.com",
    "password": "scrypt:32768:8:1$M6kUN5NKHE1Fiz3C$fb182e4b7c1fcf4767b22da81df029c6733f51a87b98c66f3210773f4c1165c5137fef7506a402b5164b1b952433a2ea697d5dfbfcd55b30038f2938c7f2e5da",
    "role": "admin",
    "phone": null,
    "experience_years": 0
  },
  {
    "id": 2,
    "name": "Sarah Jenkins",
    "email": "sarah.j@example.com",
    "password": "scrypt:32768:8:1$aCZrTEuTgY9QjCwG$e4f13451ec72a3100ab2c280ac16e483c4dce4d81326c4b2e9e9ab9c9a840ead64b1b2458c296ab17407d3c3ff0b6c29112242f34a7c3de980e53599b79b3296",
    "role": "candidate",
    "phone": "+1 555-0101",
    "experience_years": 5
  },
  {
    "id": 3,
    "name": "Marcus Chen",
    "email": "m.chen@example.com",
    "password": "scrypt:32768:8:1$rwkV9zsYvlKrVP34$2f217c3eee5364848a6387ff0adcf63d8bd082d0a4b9d39ec9e23993a88ca9d2d54c746b335ff935ea5d9e1d0b8c94d9056f18038c0d5eb3ca303682d80fe681",
    "role": "candidate",
    "phone": "+1 555-0202",
    "experience_years": 8
  },
  {
    "id": 4,
    "name": "swaraj",
    "email": "swarajladke20@gmail.com",
    "password": "scrypt:32768:8:1$7AxhEi7soGOQX5MW$e2e97eb178a9dddac2da09fc84d68a9436af7eac575582c48c1d09e3a61cd907d03cf60d4845114439c526981d7f15de96fc876ca279a7fefe377d0f7dee7561",
    "role": "candidate",
    "phone": "+91 9359123490",
    "experience_years": 3
  }
]
```

## Table: message
```json
[]
```

## Table: mcq_question
```json
[
  {
    "id": 1,
    "role": "Senior Frontend Developer",
    "question": "What is the primary benefit of React Virtual DOM?",
    "options": "[\"Faster rendering by batching updates\", \"Direct manipulation of real DOM\", \"Eliminates need for CSS\", \"Automatic database connection\"]",
    "correct_answer": "Faster rendering by batching updates"
  },
  {
    "id": 2,
    "role": "AI Research Scientist",
    "question": "What does GPT stand for in LLMs?",
    "options": "[\"Generative Pre-trained Transformer\", \"General Purpose Tool\", \"Global Positioning Technology\", \"Graphical Processing Task\"]",
    "correct_answer": "Generative Pre-trained Transformer"
  },
  {
    "id": 3,
    "role": "Full Stack Engineer",
    "question": "Which of these is a non-relational (NoSQL) database?",
    "options": "[\"MongoDB\", \"PostgreSQL\", \"MySQL\", \"Oracle\"]",
    "correct_answer": "MongoDB"
  }
]
```

## Table: job
```json
[
  {
    "id": 1,
    "title": "Senior Frontend Developer",
    "dept": "Engineering",
    "location": "Remote",
    "type": "Full-time",
    "salary": "$120k - $160k",
    "posted_date": "2026-05-12 09:37:29"
  },
  {
    "id": 2,
    "title": "AI Research Scientist",
    "dept": "AI Labs",
    "location": "San Francisco, CA",
    "type": "Full-time",
    "salary": "$180k - $240k",
    "posted_date": "2026-05-12 09:37:29"
  },
  {
    "id": 3,
    "title": "Product Designer",
    "dept": "Design",
    "location": "New York, NY",
    "type": "Contract",
    "salary": "$80/hr - $110/hr",
    "posted_date": "2026-05-12 09:37:29"
  },
  {
    "id": 4,
    "title": "Senior Frontend Developer",
    "dept": "Engineering",
    "location": "Remote",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:00"
  },
  {
    "id": 5,
    "title": "AI Research Scientist",
    "dept": "AI Labs",
    "location": "San Francisco, CA",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:02"
  },
  {
    "id": 6,
    "title": "Full Stack Engineer",
    "dept": "Engineering",
    "location": "Austin, TX",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:04"
  },
  {
    "id": 7,
    "title": "DevOps Engineer",
    "dept": "Infrastructure",
    "location": "Remote",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:06"
  },
  {
    "id": 8,
    "title": "Product Manager",
    "dept": "Product",
    "location": "New York, NY",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:08"
  },
  {
    "id": 9,
    "title": "Data Engineer",
    "dept": "Data Science",
    "location": "Remote",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:10"
  },
  {
    "id": 10,
    "title": "Backend Developer (Node.js)",
    "dept": "Engineering",
    "location": "London, UK",
    "type": "Full-time",
    "salary": "\u00a380k - \u00a3110k",
    "posted_date": "2026-05-15 04:57:12"
  },
  {
    "id": 11,
    "title": "UI/UX Designer",
    "dept": "Design",
    "location": "Berlin, Germany",
    "type": "Full-time",
    "salary": "\u20ac70k - \u20ac95k",
    "posted_date": "2026-05-15 04:57:15"
  },
  {
    "id": 12,
    "title": "Cybersecurity Analyst",
    "dept": "Security",
    "location": "Remote",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:17"
  },
  {
    "id": 13,
    "title": "Cloud Architect",
    "dept": "Infrastructure",
    "location": "Seattle, WA",
    "type": "Full-time",
    "salary": " - ",
    "posted_date": "2026-05-15 04:57:19"
  }
]
```

## Table: application
```json
[
  {
    "id": 1,
    "user_id": 2,
    "applied_role": "Senior Frontend Developer",
    "status": "MCQ_CLEARED",
    "mcq_score": 85,
    "ai_score": 0,
    "coding_score": 50,
    "questions_solved": 1,
    "test_cases_cleared": 5,
    "interview_time": null,
    "resume_url": null,
    "resume_data": "{\"skills\": [\"React\", \"TypeScript\", \"Node.js\"], \"match_score\": 92, \"summary\": \"Expert frontend engineer with strong algorithmic foundations. Cleared the first hard-tier challenge with optimal complexity.\"}",
    "applied_date": "2026-05-12 09:35:36"
  },
  {
    "id": 2,
    "user_id": 3,
    "applied_role": "AI Research Scientist",
    "status": "CODING_CLEARED",
    "mcq_score": 95,
    "ai_score": 88,
    "coding_score": 100,
    "questions_solved": 2,
    "test_cases_cleared": 10,
    "interview_time": null,
    "resume_url": null,
    "resume_data": "{\"skills\": [\"Python\", \"PyTorch\", \"LLMs\"], \"match_score\": 98, \"summary\": \"Senior AI researcher. Demonstrates exceptional problem-solving skills, clearing all hard-tier challenges with perfect test case pass rates.\"}",
    "applied_date": "2026-05-12 09:35:36"
  },
  {
    "id": 3,
    "user_id": 4,
    "applied_role": "AI Research Scientist",
    "status": "AI_CLEARED",
    "mcq_score": 100,
    "ai_score": 88,
    "coding_score": 0,
    "questions_solved": 0,
    "test_cases_cleared": 0,
    "interview_time": null,
    "resume_url": "SwarajLadke-Updated-Resume (1).pdf",
    "resume_data": "{\"skills\": [\"PyTorch\", \"LLMs\", \"Python\", \"NLP\"], \"match_score\": 71, \"summary\": \"Candidate has 3 years of experience. Demonstrated proficiency in PyTorch, LLMs, Python, NLP. AI match confidence is high for the AI Research Scientist position.\"}",
    "applied_date": "2026-05-12 09:39:05"
  },
  {
    "id": 4,
    "user_id": 4,
    "applied_role": "UI/UX Designer",
    "status": "APPLIED",
    "mcq_score": 0,
    "ai_score": 0,
    "coding_score": 0,
    "questions_solved": 0,
    "test_cases_cleared": 0,
    "interview_time": null,
    "resume_url": "SwarajLadke-Updated-Resume (1).pdf",
    "resume_data": "{\"skills\": [\"Communication\", \"Problem Solving\", \"Teamwork\"], \"match_score\": 67, \"summary\": \"Candidate has 3 years of experience. Demonstrated proficiency in Communication, Problem Solving, Teamwork. AI match confidence is high for the UI/UX Designer position.\"}",
    "applied_date": "2026-05-15 05:22:32"
  }
]
```

