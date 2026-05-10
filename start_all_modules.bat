@echo off
cd /d "c:\Users\Helios\Desktop\Final interview\remote-interview-platform"
start /b cmd /c "npm run dev -- -p 3001 -H 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\AI Interview"
start /b cmd /c "npm run dev -- -p 3000 -H 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\MCQ interview\frontend"
start /b cmd /c "npm run dev -- --port 5174 --host 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\MCQ interview\backend"
start /b cmd /c "python app.py"
