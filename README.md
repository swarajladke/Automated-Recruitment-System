# AI-Driven Recruitment System (Main Controller)

A modern, minimal, and professional recruitment platform built with React and Flask. This system serves as the central hub for managing candidates, tracking their progress through various assessment stages (MCQ, AI Interview, Final Interview), and providing an admin control panel.

## Features
- **Modern UI**: Clean white theme with blue accents (#2563eb).
- **Candidate Dashboard**: Status tracker, action cards, and score overview.
- **Admin Panel**: Statistics grid, searchable candidate table, and status filtering.
- **Auth System**: Integrated Login/Signup for candidates and admins.
- **Module Integration**: Ready to trigger external assessment modules.

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.8+)
- pip

### 2. Backend Setup (Flask)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup (React)
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

---

## Default Credentials
- **Admin Email**: `admin@hr.com`
- **Admin Password**: `admin123`

## System Flow
1. **Candidate Registration**: Candidate signs up via the Auth page.
2. **Applied**: Initial status is `APPLIED`.
3. **MCQ Test**: Candidate clicks "Start Now". External module sends back score to `/receive-score`.
4. **AI Interview**: Unlocked if MCQ >= 60.
5. **Final Interview**: Unlocked if AI >= 60.
6. **Selection**: Selected if Final >= 60.
7. **Admin Control**: Admin monitors all candidates and their scores in real-time.
