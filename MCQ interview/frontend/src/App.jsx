import React, { useState, useEffect, useRef } from 'react';
import { User, Bell, ChevronLeft, ChevronRight, HelpCircle, Camera, ShieldCheck, Info, RotateCcw } from 'lucide-react';

const API_URL = 'http://localhost:5001';

function App() {
  const [step, setStep] = useState('instructions'); // instructions, test, result, integration_success
  const [candidateId, setCandidateId] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visited, setVisited] = useState(new Set([0]));
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isSending, setIsSending] = useState(false);
  const [role, setRole] = useState('General Assessment');

  useEffect(() => {
    // Capture candidate_id, application_id and role from URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('candidate_id');
    const appId = params.get('application_id');
    const roleParam = params.get('role');
    setCandidateId(id || 'Guest');
    setApplicationId(appId);
    setRole(roleParam || 'General Assessment');
    
    fetchQuestions(roleParam);
  }, []);

  const fetchQuestions = async (roleName) => {
    try {
      const url = roleName ? `${API_URL}/candidate/mcq?role=${encodeURIComponent(roleName)}` : `${API_URL}/candidate/mcq`;
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Permissions State
  const [cameraStatus, setCameraStatus] = useState('pending');
  const [agreed, setAgreed] = useState(false);
  const videoRef = useRef(null);
  const floatingVideoRef = useRef(null);
  const violationCountRef = useRef(0);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (step === 'test' && !result && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && step === 'test') {
      handleSubmit();
    }
  }, [timeLeft, step, result]);

  // Handle video stream attachment and heartbeat
  useEffect(() => {
    let heartbeat;
    if (cameraStatus === 'granted' && window.localStream) {
      if (videoRef.current) videoRef.current.srcObject = window.localStream;
      if (floatingVideoRef.current) floatingVideoRef.current.srcObject = window.localStream;

      // SILENT AI VISION HEARTBEAT (Every 5s for OpenCV)
      if (step === 'test' && !result) {
        heartbeat = setInterval(async () => {
          const video = floatingVideoRef.current;
          if (video && video.readyState === 4) {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0);
              const frameData = canvas.toDataURL("image/jpeg", 0.6);

              // TRANSMIT TO AI PROCTOR
              fetch(`${API_URL}/proctor/analyze-frame`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  candidate_id: candidateId,
                  application_id: applicationId,
                  frame: frameData
                })
              })
              .then(res => res.json())
              .then(data => {
                if (data.violation_detected) {
                  violationCountRef.current += 1;
                  const strikesLeft = 3 - violationCountRef.current;
                  
                  if (strikesLeft > 0) {
                    setToastMessage(`Proctoring Alert: ${data.reason}. Warnings remaining: ${strikesLeft}`);
                    setTimeout(() => setToastMessage(null), 5000);
                  } else {
                    setToastMessage(`Final Proctoring Violation: Auto-submitting exam.`);
                    handleSubmit(true, data.reason);
                  }
                }
              })
              .catch(err => console.error("MCQ Proctoring Sync Error:", err));
            }
          }
        }, 5000);
      }
    }
    return () => {
      if (heartbeat) clearInterval(heartbeat);
    };
  }, [cameraStatus, step, result, questions, answers]);

  // Fullscreen Enforcer
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && step === 'test' && !result) {
         handleSubmit(true, "Mandatory Fullscreen Exited.");
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [step, result, questions, answers]);

  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      window.localStream = stream;
      setCameraStatus('granted');
    } catch (err) {
      alert("Camera access is required for proctoring.");
    }
  };

  const handleSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const navigate = (idx) => {
    if (idx >= 0 && idx < questions.length) {
      setCurrentIdx(idx);
      setVisited(prev => new Set(prev).add(idx));
    }
  };

  const handleSubmit = (isAuto = false, customReason = null) => {
    if (!questions || questions.length === 0) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }

    if (isAuto) {
      setResult({
        total: questions.length,
        correct: 0,
        percentage: 0,
        status: 'FAIL',
        reason: customReason
      });
      setStep('result');
      // Auto-sync security fail
      fetch('http://localhost:5001/receive-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          application_id: applicationId,
          module: 'mcq',
          score: 0,
          violations_count: violationCountRef.current
        })
      }).catch(err => console.error(err));
      return;
    }
    
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    setResult({
      total: questions.length,
      correct: correctCount,
      percentage,
      status: percentage >= 60 ? 'PASS' : 'FAIL'
    });
    setStep('result');
  };

  const sendToHireFlow = async () => {
    setIsSending(true);
    try {
      await fetch('http://localhost:5001/receive-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate_id: candidateId,
          application_id: applicationId,
          module: 'mcq',
          score: result.percentage,
          violations_count: violationCountRef.current
        })
      });
      setStep('integration_success');
    } catch (err) {
      console.error("Integration failed", err);
      alert("Failed to sync score with HireFlow. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  // STEP 1: INSTRUCTIONS
  if (step === 'instructions') {
    return (
      <div className="instructions-wrapper">
        <div className="instruction-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 700 }}>HIREFLOW INTEGRATED</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Candidate ID: {candidateId}</span>
          </div>
          <h1 className="title-large">{role}</h1>
          <p className="subtitle">System check and instructions for your technical evaluation.</p>

          <div className="instruction-section">
            <h3 className="section-title"><Info size={20} color="#059669" /> Guidelines</h3>
            <ul className="instruction-list">
              <li>{questions.length} Questions | 10 Minutes Total duration.</li>
              <li>Calculators and external aids are strictly prohibited.</li>
              <li>Your session is being recorded via camera for proctoring.</li>
            </ul>
          </div>

          <div className="instruction-section">
            <h3 className="section-title"><ShieldCheck size={20} color="#059669" /> Proctoring Check</h3>
            <div className="permission-item">
              <div className="permission-info">
                <Camera size={20} />
                <div>
                  <div style={{fontWeight: 600}}>Webcam Permission</div>
                  <div style={{fontSize: '0.8rem', color: '#64748b'}}>Required for identity verification</div>
                </div>
              </div>
              <button 
                className={`status-badge ${cameraStatus}`} 
                onClick={cameraStatus === 'pending' ? requestCamera : null}
                style={{border: 'none', cursor: cameraStatus === 'pending' ? 'pointer' : 'default'}}
              >
                {cameraStatus === 'pending' ? 'Enable Camera' : 'Ready'}
              </button>
            </div>

            {cameraStatus === 'granted' && (
              <div className="camera-preview" style={{maxWidth: '400px'}}>
                <video ref={videoRef} autoPlay playsInline muted style={{transform: 'scaleX(-1)'}} />
              </div>
            )}
          </div>

          <div className="start-footer">
            <label className="checkbox-container">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span>I understand that this test is proctored and my video is being recorded.</span>
            </label>
            <button 
              className="btn-primary" 
              disabled={!agreed || cameraStatus !== 'granted'}
              onClick={async () => {
                try {
                  await document.documentElement.requestFullscreen();
                } catch (e) {
                  console.error("Fullscreen error:", e);
                }
                setStep('test');
              }}
            >
              Enter Test Environment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: RESULTS
  if (step === 'result' && result) {
    return (
      <div className="result-pane">
        <h1 style={{fontSize: '2rem', fontWeight: 800}}>Assessment Complete</h1>
        <div className="score-circle">
          <span className="score-big">{result.percentage}%</span>
          <span style={{fontSize: '0.8rem', color: '#64748b', fontWeight: 600}}>Overall Score</span>
        </div>
        <p style={{color: '#64748b', fontSize: '1.1rem', marginBottom: '1rem'}}>
          {result.status === 'PASS' ? 'Great job! You have cleared the requirements.' : 'Thank you for participating. You did not meet the pass criteria.'}
        </p>
        {result.reason && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontWeight: 600 }}>
            Security Violation Logged: {result.reason}
          </div>
        )}
        <button 
          className="btn-submit" 
          style={{padding: '1rem 3rem', minWidth: '250px'}} 
          onClick={sendToHireFlow}
          disabled={isSending}
        >
          {isSending ? 'Syncing...' : 'Submit to HireFlow'}
        </button>
      </div>
    );
  }

  // STEP 2.5: INTEGRATION SUCCESS
  if (step === 'integration_success') {
    return (
      <div className="result-pane">
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          Score successfully synced with HireFlow AI Controller
        </div>
        <h1 style={{fontSize: '2rem', fontWeight: 800}}>All Done!</h1>
        <p style={{color: '#64748b', fontSize: '1.1rem', marginTop: '1rem', marginBottom: '3rem'}}>
          Your MCQ results have been transmitted. You can now return to your dashboard to see the next steps.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button 
            className="btn-secondary" 
            style={{padding: '1rem 2rem'}} 
            onClick={() => window.close()}
          >
            Close Tab
          </button>
          <button 
            className="btn-submit" 
            style={{padding: '1rem 2rem'}} 
            onClick={() => window.location.href = 'http://localhost:5173/dashboard'}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // STEP 3: INDUSTRY TEST UI
  if (!questions || questions.length === 0) {
    return <div className="loading">No questions available. Please check backend.</div>;
  }
  const q = questions[currentIdx];

  return (
    <div className="app-wrapper">
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
          background: '#ef4444', color: 'white', padding: '1rem 2rem', borderRadius: '8px',
          fontWeight: 'bold', zIndex: 9999, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}>
          {toastMessage}
        </div>
      )}
      <header className="navbar">
        <div className="brand">RECRUIT.AI</div>
        <div className="nav-right">
          <div className="timer-display">{formatTime(timeLeft)}</div>
          <button className="btn-submit" onClick={handleSubmit}>Finish Test</button>
          <div style={{display: 'flex', gap: '1rem', borderLeft: '1px solid #e2e8f0', paddingLeft: '1.5rem'}}>
            <Bell size={20} color="#64748b" />
            <User size={20} color="#64748b" />
          </div>
        </div>
      </header>

      <main className="main-container">
        <div className="question-pane">
          <div className="pane-header">
            <span>QUESTION {currentIdx + 1} OF {questions.length}</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><HelpCircle size={16} /> Report Error</span>
          </div>

          <h2 className="question-title">{q.question}</h2>

          <div className="options-container">
            {q.options.map((opt, i) => (
              <button 
                key={i} 
                className={`option-btn ${answers[q.id] === opt ? 'active' : ''}`}
                onClick={() => handleSelect(q.id, opt)}
              >
                <div className="opt-label">{String.fromCharCode(65 + i)}</div>
                <div className="opt-content">{opt}</div>
              </button>
            ))}
          </div>

          <div className="pane-footer">
            <button className="btn-secondary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => handleSelect(q.id, null)}>
              <RotateCcw size={16} /> Clear Answer
            </button>
            <div style={{display: 'flex', gap: '0.75rem'}}>
              <button className="btn-secondary" disabled={currentIdx === 0} onClick={() => navigate(currentIdx - 1)}>Previous</button>
              <button className="btn-submit" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}} onClick={() => navigate(currentIdx + 1)} disabled={currentIdx === questions.length - 1}>
                Next Question <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <aside className="sidebar">
          <div className="side-card">
            <div className="side-title">Navigator</div>
            <div className="status-grid">
              <div className="status-item"><span className="dot" style={{background: '#059669'}}></span> Answered</div>
              <div className="status-item"><span className="dot" style={{background: '#f1f5f9'}}></span> Not Visited</div>
              <div className="status-item"><span className="dot" style={{background: '#cbd5e1'}}></span> Pending</div>
            </div>
            <div className="num-grid">
              {questions.map((_, i) => {
                let status = 'not-visited';
                if (answers[questions[i].id]) status = 'answered';
                else if (visited.has(i)) status = 'visited';
                
                return (
                  <button 
                    key={i} 
                    className={`num-btn ${status} ${currentIdx === i ? 'active' : ''}`}
                    onClick={() => navigate(i)}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="side-card">
            <div className="side-title">Proctoring Active</div>
            <p style={{fontSize: '0.75rem', color: '#64748b'}}>Your camera is monitoring for identity verification and suspicious activity.</p>
          </div>
        </aside>
      </main>

      <div className="floating-camera">
        <div className="rec-dot"></div>
        <video ref={floatingVideoRef} autoPlay playsInline muted />
      </div>
    </div>
  );
}

export default App;
