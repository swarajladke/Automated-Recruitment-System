# hireFlow AI-Driven Recruitment System - Technical Test Plan

## 4.1 TEST CASES

| Sr.No | Test Scenario | Pre-requisite | Test Data | Steps | Expected Result | Actual Result | Status |
|:---:|:---|:---|:---|:---|:---|:---|:---:|
| 1 | **Signup Validation** | - Landing Page open | Email: `test@gmail` (invalid) | 1. Open Signup form<br>2. Enter email without '@' symbol<br>3. Click Submit | System should reject the email and show validation error. | System rejected the email and showed error. | **PASSED** |
| 2 | **MCQ Interview Flow** | - Authenticated candidate<br>- Job applied | Candidate Role: `AI Scientist` | 1. Access MCQ Phase<br>2. Answer all questions<br>3. Submit Assessment | Score should be calculated and synced to backend `/receive-score`. | Score calculated and synced successfully. | **PASSED** |
| 3 | **AI Interview Integrity** | - MCQ Cleared<br>- Webcam active | - | 1. Start AI Video Interview<br>2. Complete voice/video response<br>3. Exit Interview | AI feedback and score should be generated and stored. | AI analysis completed and stored in database. | **PASSED** |
| 4 | **Coding Arena - Challenge Navigation** | - AI Interview Cleared<br>- Coding Phase open | Hard Questions Bank | 1. Open Assessment Roadmap<br>2. Solve Challenge 1<br>3. Navigate to Challenge 2 | "Next Challenge" button should unlock only after Challenge 1 is solved. | Navigation unlocked upon clearing all test cases. | **PASSED** |
| 5 | **Hard-Tier Test Case Validation** | - Median of Two Sorted Arrays active | Input: `nums1=[1,3], nums2=[2]` | 1. Implement solution<br>2. Click "Run Tests"<br>3. Observe result | Test case should pass with output `2.00000`. | Test case passed with correct output. | **PASSED** |
| 6 | **HR Telemetry Synchronization** | - Candidate completed Coding Phase | Questions Solved: `1`<br>Test Cases: `5` | 1. Submit Coding Assessment<br>2. Access Admin Dashboard<br>3. Review Candidate | Dashboard should show granular `1/2` Solved and `5` Test Cases Cleared. | Granular technical telemetry synced and visible. | **PASSED** |
| 7 | **Admin Dashboard Filtering** | - Candidates in DB<br>- Admin Access | Filter: `CODING_CLEARED` | 1. Open Hiring Command Center<br>2. Select "Coding Cleared" from status filter | List should only show candidates with selected status. | List filtered correctly in real-time. | **PASSED** |
| 8 | **Fullscreen Security Protocol** | - Coding Interview active | - | 1. Enter Fullscreen mode<br>2. Attempt to exit via ESC key | System should detect violation and auto-submit the test. | Violation detected; test auto-submitted instantly. | **PASSED** |

## 4.2 RESULTS SUMMARY

The current technical architecture of **HireFlow AI** satisfies all critical validation criteria. The integration between the **Multi-Phase Arena** and the **HR Command Center** is irrefutable, with granular telemetry successfully persisting across the SQLite backend. Security protocols (Fullscreen) and Assessment Roadmap logic (Sequential unlocking) are fully operational.
