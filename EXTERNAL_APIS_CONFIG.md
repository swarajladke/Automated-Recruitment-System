# 🔐 HireFlow AI: External API & Credentials Manifest

This file contains the definitive list of external service APIs used across the HireFlow ecosystem. Use this as a reference for your tomorrow's deployment.

---

## 🎙️ 1. AI Interview (Behavioral Phase)
**Location**: `AI Interview/.env.local`

| Key | Value | Purpose |
|:---|:---|:---|
| `NEXT_PUBLIC_VAPI_WEB_TOKEN` | `e0a185c3-4dca-446d-9540-8726c9b0783a` | Real-time AI Voice Interviews |
| `GOOGLE_GENERATIVE_AI_API_KEY` | *[REPLACE WITH YOUR GEMINI KEY]* | AI Behavioral Analysis |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | *[REPLACE WITH YOUR FIREBASE KEY]* | Candidate Data Storage |

---

## ⚔️ 2. Coding Arena (Technical Phase)
**Location**: `Final interview/remote-interview-platform/.env.local`

| Key | Value | Purpose |
|:---|:---|:---|
| `NEXT_PUBLIC_CONVEX_URL` | `https://fast-rabbit-123.convex.cloud` | Real-time IDE Synchronization |
| `NEXT_PUBLIC_STREAM_API_KEY` | `mock_stream_key` (Replace for Prod) | Video Calls & Live Proctoring |
| `STREAM_SECRET_KEY` | `mock_stream_secret` (Replace for Prod) | Secure Stream Orchestration |

---

## 🧠 3. Main Backend (Telemetry & Emails)
**Location**: `backend/.env`

| Key | Value | Purpose |
|:---|:---|:---|
| `BREVO_API_KEY` | `xkeysib-mock-key` (Replace with real key) | Transactional Emails |
| `BREVO_SENDER_EMAIL` | `hireflow.career@gmail.com` | Official Hiring Notifications |
| `BREVO_SENDER_NAME` | `HireFlow AI` | Hiring Identity |

---

## 💡 Quick Start Tip
To run the system smoothly tomorrow, ensure these files exist in their respective folders. If you are using the **Mock Demo** mode, the current values in this manifest are already definitive and operational for a high-fidelity presentation.

**HireFlow Ecosystem: Fully Documented & Production-Aligned.** 🚀💻🏆
