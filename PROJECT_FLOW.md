# HireFlow AI: Automated Recruitment Ecosystem 🚀

HireFlow AI is a production-grade, end-to-end recruitment platform that leverages Artificial Intelligence to automate candidate screening, assessment, and communication.

---

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite, Lucide-Icons, Vanilla CSS (Premium Glassmorphism Design).
- **Backend**: Flask (Python), SQLAlchemy (SQLite), JWT/Session Auth.
- **Integrations**: Brevo API (Email Automation), AI-ATS Screening Logic.

---

## 👤 Candidate Journey (The Flow)

### 1. Discovery & Application
- **Landing Page**: Candidates browse available roles (Senior Frontend Developer, AI Scientist, etc.).
- **Guest Application**: Candidates can apply instantly with their Resume/CV.
- **AI-ATS Screening**: The system performs instant resume parsing. 
  - **Success**: Candidate receives an automated invitation email to join the platform.
  - **Failure**: Candidate is filtered out if they don't meet the AI-determined threshold.

### 2. Candidate Dashboard
- **Authentication**: Secure Sign-up and Sign-in specifically for candidates.
- **Pipeline Stepper**: A visual timeline tracking their progress (Applied → MCQ → AI Interview → Coding → Selected).
- **Assessment Hub**:
  - **MCQ Assessment**: A proctored technical exam customized for their role.
  - **AI Behavioral**: Voice/Video-based AI evaluation (Port 3000).
  - **Coding Interview**: Real-time technical coding challenge (Port 3001).
- **Message Center**: Real-time chat interface to communicate directly with HR.
- **Resume Portal**: View the specific document they applied with.

---

## 🏢 HR / Admin Journey (The Flow)

### 1. Admin Command Center
- **Secure Access**: Dedicated login for HR administrators.
- **Recruitment Funnel**: Visual analytics showing the number of candidates at each stage of the pipeline.
- **Candidate Oversight**: A centralized table to monitor all applicants, their current status, and assessment scores.

### 2. Evaluation & Selection
- **Profile Review**: Deep-dive into any candidate's profile.
  - **AI Insights**: View AI-extracted skills, match scores, and automated summaries.
  - **Score Analytics**: Review performance across MCQ, AI, and Coding modules.
- **Decision Engine**: HR can officially **Hire** or **Reject** candidates with a single click, updating their status across the entire system.

### 3. Communication & Management
- **HR Message Hub**: A dual-pane inbox to manage conversations with all candidates simultaneously.
- **Job Posting Module (NEW)**: HR can dynamically post new job openings to the public Careers Page, set salary ranges, and manage active vacancies.
- **MCQ Manager**: HR can customize the recruitment process by:
  - Adding role-specific MCQs.
  - Managing the question bank (Delete/Edit).
  - Seeding industry-standard default questions.

---

## 📡 System Integration Points
- **Cross-Port Communication**:
  - **Dashboard**: `http://localhost:5173`
  - **MCQ Platform**: `http://localhost:5174`
  - **Backend API**: `http://localhost:5001`
- **Real-time Sync**: Candidate assessment scores are automatically transmitted to the Admin Dashboard the moment they are completed.
- **Email Automation**: Real-time notifications via Brevo for interview invitations and status updates.

---
**HireFlow AI: Intelligent Recruitment, Reimagined.** 🏁🏆
