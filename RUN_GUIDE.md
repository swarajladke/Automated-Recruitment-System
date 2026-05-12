# 🚀 HireFlow AI: Seamless Deployment Guide

This guide ensures a definitive and smooth setup of the **HireFlow AI Technical Recruitment Platform** on a fresh machine.

## 📋 Prerequisites
Ensure the following are installed on the system:
*   **Node.js** (v18+ recommended)
*   **Python** (3.10+ recommended)
*   **Git**

---

## 🛠️ Phase 1: Installation
Run the following commands to install dependencies for all modules.

### 1. Main Backend
```powershell
cd backend
pip install -r requirements.txt
```

### 2. Main Dashboard (Frontend)
```powershell
cd ../frontend
npm install
```

### 3. MCQ Assessment Module
```powershell
cd "../MCQ interview/frontend"
npm install
```

### 4. AI Interview Module
```powershell
cd "../../AI Interview"
npm install
```

### 5. Technical Coding Arena
```powershell
cd "../Final interview/remote-interview-platform"
npm install
```

---

## 🔑 Phase 2: Environment Configuration
Ensure you have the following `.env` or configuration files in their respective directories (Copy them from your existing setup if possible):

*   **`backend/.env`**: (Database & Secret Keys)
*   **`AI Interview/.env.local`**: (Firebase & Vapi Keys)
*   **`Final interview/remote-interview-platform/.env.local`**: (Stream & Convex Keys)

---

## 🚀 Phase 3: Launching the Platform
We have provided an orchestrator script to launch all 5 services simultaneously.

1.  Open **PowerShell** or **CMD** as Administrator.
2.  Navigate to the root directory.
3.  Execute:
    ```powershell
    .\start_full_system.bat
    ```

### 🌐 Service Endpoints
Once launched, the following portals will be active:
*   **Main Portal**: [http://localhost:5173](http://localhost:5173)
*   **MCQ Arena**: [http://localhost:5174](http://localhost:5174)
*   **AI Interview**: [http://localhost:3000](http://localhost:3000)
*   **Coding Arena**: [http://localhost:3001](http://localhost:3001)

---

## 🧪 Phase 4: Initializing the Database (Mandatory)
On a fresh clone, the database will be empty. Run the following command to seed the marketplace with jobs and assessment banks:

```powershell
# While the services are running, execute this in a new terminal:
cd backend
python -c "import requests; requests.post('http://localhost:5001/admin/jobs/init-defaults'); requests.post('http://localhost:5001/admin/mcq/init-defaults')"
```

---

## 💡 Troubleshooting
*   **Port Conflicts**: If a port is blocked, the script will try to kill the process. If it fails, manually kill the process or restart your laptop.
*   **Execution Policy**: If `npm` fails to load, the script automatically uses `npm.cmd` to bypass Windows PowerShell restrictions.
*   **White Screen**: If the AI Interview (3000) shows a white screen, try running it without Turbopack: `npx next dev -p 3000`.

**Your Technical Recruitment Ecosystem is now definitive and production-ready!** 🚀💻🏆
