# HireFlow AI: Project Report

## Chapter 1: Introduction
### 1.1 Problem Statement
Traditional recruitment processes are heavily manual, time-consuming, and prone to human bias. HR departments spend countless hours screening resumes, scheduling interviews, and evaluating candidates across multiple disparate platforms. Furthermore, remote technical and behavioral assessments often lack robust, automated proctoring mechanisms, making it difficult to ensure assessment integrity. There is a critical need for a unified, intelligent system that can automate the recruitment pipeline from end to end while maintaining high fidelity in candidate evaluation and security.

### 1.2 Objectives
*   **Automate Candidate Evaluation**: Implement AI-driven modules to automatically assess candidates across Multiple Choice Questions (MCQs), Behavioral Interviews, and Technical Coding challenges.
*   **Ensure Assessment Integrity**: Deploy a "Zero-Trust" security perimeter with real-time AI vision proctoring to detect unauthorized devices, tab-switching, and suspicious behaviors.
*   **Provide Granular Analytics**: Equip HR administrators with a centralized command center to view detailed candidate performance metrics, AI-generated behavioral feedback, and algorithmic coding scores.
*   **Deliver a Premium UX**: Create a studio-grade, visually consistent, and distraction-free interface for both candidates and recruiters using modern web design principles.

### 1.3 Scope
The scope of the HireFlow ecosystem encompasses a multi-module platform:
1.  **Public Marketplace**: A dynamic careers page for job discovery and direct applications.
2.  **Candidate Dashboard**: A secure portal for applicants to track their progress and access assessment modules.
3.  **Assessment Engine**: Three distinct evaluation environments (MCQ, AI Voice Interview, Coding Arena) integrated with real-time scoring.
4.  **Admin Command Center**: An HR dashboard for pipeline management, job posting, and data-driven hiring decisions.
5.  **Automated Communications**: Integrated email notifications for status updates and interview invitations.

---

## Chapter 2: Design
### 2.1 System Architecture
HireFlow employs a decentralized, modular architecture that ensures scalability and separation of concerns. 
*   **Central Hub (Backend)**: A RESTful API built with Python (Flask) running on Port 5001. It handles state synchronization, data persistence, authentication, and communication with external AI services.
*   **Distributed Frontends**: Multiple React.js/Vite applications run concurrently (Dashboard on 5173, MCQ on 5174, Coding Arena on 3001), communicating seamlessly with the central backend.
*   **AI Integration Layer**: Real-time connections to Google Gemini 1.5 Flash for vision and text analysis, Vapi for conversational AI, and Stream for WebRTC media routing.

### 2.2 Database Design
The system utilizes a relational database structure (SQLite via SQLAlchemy) optimized for the recruitment lifecycle. Key entities include:
*   **User**: Stores authentication details, roles (Candidate/HR), and profile data.
*   **Job**: Represents active vacancies with attributes like title, type, and salary range.
*   **Application**: Maps Users to Jobs, tracking pipeline status and aggregating scores across modules.
*   **Feedback**: Stores highly granular, Gemini-generated behavioral assessments, categorizing strengths, weaknesses, and communication metrics.

---

## Chapter 3: Implementation
### 3.1 Frontend Development
The frontend is constructed using **React.js** and **Vite**, prioritizing a premium "Glassmorphism" aesthetic. Key implementation highlights include:
*   **State Management**: React Hooks and Context API ensure seamless data flow across the decentralized modules.
*   **Code Editor**: Integration of a browser-based IDE in the Coding Arena with syntax highlighting and real-time execution feedback.
*   **Responsive Layouts**: Utilizing Tailwind CSS and custom Vanilla CSS for adaptable, accessible, and high-fidelity user interfaces.

### 3.2 Backend Development
The **Flask** backend acts as the secure orchestrator of the platform:
*   **Security Validation**: Endpoints feature strict duplicate-application checks (case-insensitive and whitespace-tolerant) to maintain data integrity.
*   **Scoring Engine**: Implements granular evaluation logic, particularly in the Coding Arena, where scores are calculated based on the precise ratio of cleared test cases to total available test cases.
*   **Proctoring Analysis**: A dedicated `/proctor/analyze-frame` endpoint processes base64 video frames via Pillow and Gemini, analyzing candidate environments in real-time.

### 3.3 Integration
The platform achieves its "intelligent" status through critical external integrations:
*   **Google Gemini 1.5 Flash**: Powers both the silent snapshot proctoring heartbeat and the dynamic analysis of behavioral interview transcripts.
*   **Vapi SDK**: Drives the interactive voice-based AI interviewer, providing a natural, conversational assessment experience.
*   **Stream SDK**: Handles secure video and audio stream orchestration during technical assessments.
*   **Brevo API**: Automates transactional emails for candidate pipeline updates.

---

## Chapter 4: Testing
### 4.1 Test Cases
Comprehensive testing was conducted to ensure production-readiness:
1.  **Application Integrity Check**: Attempting to apply for the same role multiple times with varying text casing and whitespace.
2.  **Proctoring Hardening Check**: Triggering browser visibility changes, exiting fullscreen, and simulating the presence of a mobile phone via webcam.
3.  **Coding Evaluation Accuracy**: Submitting partial solutions to verify that the granular test-case scoring correctly awards partial credit rather than a binary pass/fail.
4.  **Cross-Module Synchronization**: Completing an assessment on a peripheral module (e.g., MCQ on Port 5174) and verifying instant status updates on the central Dashboard (Port 5173).

### 4.2 Results
*   **Integrity Maintained**: The backend definitively blocks duplicate applications, ensuring a clean 1:1 Candidate-to-Role mapping.
*   **Proctoring Active**: The Zero-Trust perimeter successfully captures and logs all tab-switching and fullscreen violations, while the Gemini engine accurately flags unauthorized objects in the camera feed.
*   **Scoring Validated**: The Coding Arena precisely tracks individual test cases, and the AI Behavioral module dynamically generates customized scores and feedback reports based on actual transcript data.

---

## Chapter 5: Conclusion
### 5.1 Summary
The HireFlow Automated Recruitment System successfully transitions traditional hiring into a secure, AI-guarded, and highly efficient digital ecosystem. By integrating real-time proctoring, dynamic behavioral analysis, and granular technical scoring, the platform provides recruiters with irrefutable, data-driven insights while offering candidates a modern, studio-grade application experience.

### 5.2 Future Enhancements
*   **Secure Sandbox Migration**: Transitioning the current browser-based code execution to an isolated, containerized environment (e.g., Judge0 or Docker) to support multiple languages securely.
*   **Database Scaling**: Migrating from SQLite to PostgreSQL or MongoDB to support high-concurrency enterprise loads.
*   **Advanced AI Code Review**: Expanding the AI's role in the Coding Arena to provide qualitative feedback on Big O complexity, code readability, and architectural best practices.
*   **Identity Provider Integration**: Replacing custom JWT authentication with a robust provider like Clerk or Auth0 for enhanced security and SSO capabilities.

---

## Chapter 6: References
1.  React Documentation: https://react.dev/
2.  Flask Documentation: https://flask.palletsprojects.com/
3.  Google Gemini API: https://ai.google.dev/
4.  Vapi SDK: https://docs.vapi.ai/
5.  Stream Video React SDK: https://getstream.io/video/docs/react/
6.  Tailwind CSS: https://tailwindcss.com/

---

## Chapter 7: Appendices
*   **Appendix A: Environment Configuration**
    Refer to `EXTERNAL_APIS_CONFIG.md` for the definitive manifest of required API keys and environment variables necessary for deployment.
*   **Appendix B: Project Architecture Diagram**
    Refer to `PROJECT_FLOW.md` for a detailed breakdown of candidate and HR journey mappings.

---

## Chapter 8: Annexure - Progress Sheet
| Phase | Objective | Status | Description |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation & UI | Completed | Setup of decentralized React modules, Flask backend, and premium Glassmorphism design tokens. |
| **Phase 2** | Core Features | Completed | Implementation of Job Marketplace, Application Tracking, and candidate/HR dashboards. |
| **Phase 3** | AI Integration | Completed | Integration of Gemini 1.5 for behavioral analysis and Vapi for interactive voice interviews. |
| **Phase 4** | Proctoring & Security | Completed | Deployment of the Zero-Trust perimeter, tab-locking, and the Gemini Vision 30-second heartbeat. |
| **Phase 5** | Scoring & Polish | Completed | Granular test-case scoring in the Coding Arena, Regex-based UI fallbacks, and backend integrity hardening. |
| **Phase 6** | Documentation | Completed | Finalization of External API manifest and generation of comprehensive project reports. |
