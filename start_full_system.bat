@echo off
echo Killing existing processes...
taskkill /F /IM node.exe /T >nul 2>&1
taskkill /F /IM python.exe /T >nul 2>&1

echo Starting Main Platform...
cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\backend"
start /b cmd /c "python app.py"
cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\frontend"
start /b cmd /c "npm.cmd run dev -- --host 127.0.0.1"

echo Starting Assessment Modules...
cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\Final interview\remote-interview-platform"
start /b cmd /c "npm.cmd run dev -- -p 3001 -H 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\AI Interview"
start /b cmd /c "npm.cmd run dev -- -p 3000 -H 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\MCQ interview\frontend"
start /b cmd /c "npm.cmd run dev -- --port 5174 --host 127.0.0.1"

cd /d "c:\Users\Helios\Desktop\AI-Driven Recruiter\MCQ interview\backend"
start /b cmd /c "python app.py"

echo All services launched!
