# MCQ Assessment Platform

## Folder Structure

- `frontend/`: React frontend (Vite)
- `backend/`: Flask backend

## How to Run

### 1. Start the Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows: venv\Scripts\activate
   # On Mac/Linux: source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:
   ```bash
   python app.py
   ```
   The backend will start at `http://localhost:5000`.

### 2. Start the Frontend

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the provided URL (usually `http://localhost:5173`) in your browser.
