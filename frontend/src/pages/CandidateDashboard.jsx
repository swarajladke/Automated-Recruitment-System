import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, TrendingUp, ChevronRight, BookOpen, Code, XCircle, CheckCircle, X, Calendar, MessageSquare, Send } from 'lucide-react';

import { candidateService, messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { RECRUITMENT_STAGES } from '../constants';

import { Button, Card, Spinner } from '../components/common/UI';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { TimelineStepper, ScoreAnalytics } from '../components/dashboard/DashboardComponents';
import { AssessmentTile, StatusBanner } from '../components/dashboard/DashboardModules';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [statusData, setStatusData] = useState(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'messages'
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (loading) return; // Wait for session to load from localStorage

    if (!user || user.role !== 'candidate') {
      navigate('/auth?mode=login');
      return;
    }

    // Identity Bridge: Verify email matches before syncing
    const pendingApp = sessionStorage.getItem('pending_application');
    if (pendingApp) {
      const appData = JSON.parse(pendingApp);
      if (appData.email === user.email) {
        candidateService.apply({
          candidate_id: user.id,
          ...appData
        }).then(() => {
          sessionStorage.removeItem('pending_application');
          sessionStorage.setItem('just_synced', 'true');
          fetchStatus(user.id);
        });
      } else {
        // Mismatch - don't sync
        fetchStatus(user.id);
      }
    } else {
      fetchStatus(user.id);
    }
  }, [user, loading, navigate]);

  const fetchMessages = async () => {
    if (!user) return;
    try {
      const res = await messageService.getMessages(user.id);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await messageService.sendMessage({
        sender_id: user.id,
        receiver_id: 1, // Default Admin ID
        content: newMessage,
        sender_name: user.name,
        sender_role: 'candidate'
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const fetchStatus = async (id) => {
    try {
      const res = await candidateService.getStatus(id);
      setStatusData(res.data);
      if (res.data.applications?.length > 0 && !selectedApplicationId) {
        setSelectedApplicationId(res.data.applications[0].id);
      }
    } catch (err) {
      console.error("User not found in DB:", err);
      // SAFETY REDIRECT: If user session is invalid/wiped, logout
      if (err.response?.status === 404) {
        logout();
        navigate('/auth?mode=login');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resultModal, setResultModal] = useState(null);
  const [isScreening, setIsScreening] = useState(false);

  if (!statusData) return <div style={{ height: '100vh' }}><Spinner /></div>;

  const selectedApp = statusData.applications?.find(a => a.id === selectedApplicationId) || statusData.applications?.[0];

  if (!selectedApp) {
    // Should theoretically not happen if they applied
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <h2>No active applications found</h2>
        <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
      </div>
    );
  }

  const isRejected = selectedApp.status === 'REJECTED';
  const currentStageIndex = isRejected ? -1 :
    selectedApp.status === 'APPLIED' ? 0 :
      selectedApp.status === 'MCQ_CLEARED' ? 1 :
        selectedApp.status === 'AI_CLEARED' || selectedApp.status === 'INTERVIEW_SCHEDULED' ? 2 :
          selectedApp.status === 'CODING_CLEARED' ? 3 :
            selectedApp.status === 'SELECTED' ? 4 : 0;

  const calculateCompletion = () => {
    if (isRejected) return 10;
    if (selectedApp.status === 'SELECTED') return 100;
    const base = 20;
    const progress = currentStageIndex * 20;
    return base + progress;
  };

  const handleMenuClick = (type) => {
    if (type === 'resume') {
      setShowResumeModal(true);
    } else if (type === 'schedule') {
      if (selectedApp.interview_time) {
        setResultModal({ 
          title: 'Interview Confirmed', 
          feedback: `Your final interview for the ${selectedApp.applied_role} position is scheduled for: ${selectedApp.interview_time}. Please ensure you are in a quiet environment with a stable internet connection.`, 
          icon: <Calendar size={24} />, 
          color: '#10b981', 
          isInfo: true 
        });
      } else {
        setResultModal({ 
          title: 'Interview Schedule', 
          feedback: 'Your technical interview is currently being synchronized with our HR recruitment calendar. You will receive an email confirmation once the slot is finalized by our talent team.', 
          icon: <Calendar size={24} />, 
          color: '#3b82f6', 
          isInfo: true 
        });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '4rem', display: 'flex', flexDirection: 'column' }}>
      {/* Full Width Navbar */}
      <DashboardNavbar
        userName={statusData.name}
        userId={statusData.id}
        isFluid
        status={selectedApp.status}
      />

      <main style={{ flex: 1, padding: '2.5rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', gap: '2.5rem' }}>

          {/* Left Sidebar - Fixed Width */}
          <DashboardSidebar
            userName={statusData.name}
            onLogout={handleLogout}
            completion={calculateCompletion()}
            onMenuClick={handleMenuClick}
          />

          {/* Center Content - Fluid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Tab Switcher */}
            <div style={{ display: 'flex', gap: '1rem', background: '#fff', padding: '0.5rem', borderRadius: '1rem', border: '1px solid var(--border)', width: 'fit-content' }}>
              <button 
                onClick={() => setActiveTab('overview')}
                style={{ 
                  padding: '0.6rem 1.5rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
                  background: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'overview' ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('messages')}
                style={{ 
                  padding: '0.6rem 1.5rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
                  background: activeTab === 'messages' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'messages' ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <MessageSquare size={16} /> Messages
              </button>
            </div>

            {/* Application Selector (Only if multiple) */}
            {statusData.applications?.length > 1 && (
              <div style={{ background: '#fff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--primary)10', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>SWITCH APPLICATION</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800' }}>{selectedApp.applied_role}</div>
                  </div>
                </div>
                <select 
                  value={selectedApplicationId} 
                  onChange={(e) => setSelectedApplicationId(Number(e.target.value))}
                  style={{ padding: '0.6rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', cursor: 'pointer', fontWeight: '600' }}
                >
                  {statusData.applications.map(app => (
                    <option key={app.id} value={app.id}>{app.applied_role}</option>
                  ))}
                </select>
              </div>
            )}

            {activeTab === 'overview' ? (
              <>
                <WelcomeHero
                  userName={statusData.name}
                  currentStage={isRejected ? "Filtered" : RECRUITMENT_STAGES[currentStageIndex === -1 ? 0 : currentStageIndex]}
                  isRejected={isRejected}
                  status={selectedApp.status}
                />

                {selectedApp.status === 'INTERVIEW_SCHEDULED' && (
                  <FinalInterviewBanner 
                    time={selectedApp.interview_time} 
                    candidateId={statusData.id}
                    appId={selectedApp.id}
                    role={selectedApp.applied_role}
                  />
                )}

                <TimelineStepper
                  stages={RECRUITMENT_STAGES}
                  currentStageIndex={currentStageIndex}
                  isRejected={isRejected}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <AssessmentTile
                    title="MCQ Assessment"
                    description="General aptitude and domain knowledge test"
                    icon={<FileText color="#2563eb" />}
                    status={isRejected ? 'Filtered' : selectedApp.status === 'APPLIED' ? 'Active' : 'Completed'}
                    isActive={selectedApp.status === 'APPLIED' && !isRejected}
                    isDone={['MCQ_CLEARED', 'AI_CLEARED', 'CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)}
                    onAction={() => {
                      if (['MCQ_CLEARED', 'AI_CLEARED', 'CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)) {
                        setResultModal({ title: 'MCQ Assessment Results', score: selectedApp.scores.mcq, feedback: 'Strong aptitude and domain expertise demonstrated.', icon: <FileText size={24} />, color: '#2563eb' });
                      } else {
                        window.open(`http://localhost:5174?candidate_id=${statusData.id}&application_id=${selectedApp.id}&role=${encodeURIComponent(selectedApp.applied_role)}`, '_blank');
                      }
                    }}
                  />
                  <AssessmentTile
                    title="AI Behavioral Interview"
                    description="Voice-based AI evaluation of soft skills"
                    icon={<TrendingUp color="#8b5cf6" />}
                    status={isRejected ? 'Filtered' : selectedApp.status === 'MCQ_CLEARED' ? 'Active' : currentStageIndex < 1 ? 'Locked' : 'Completed'}
                    isActive={selectedApp.status === 'MCQ_CLEARED' && !isRejected}
                    isDone={['AI_CLEARED', 'CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)}
                    onAction={() => {
                      if (['AI_CLEARED', 'CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)) {
                        setResultModal({ title: 'AI Behavioral Results', score: selectedApp.scores.ai, feedback: 'Excellent communication skills and cultural fit.', icon: <TrendingUp size={24} />, color: '#8b5cf6' });
                      } else {
                        window.open(`http://localhost:3001?candidate_id=${statusData.id}&application_id=${selectedApp.id}&role=${encodeURIComponent(selectedApp.applied_role)}`, '_blank');
                      }
                    }}
                  />
                  <AssessmentTile
                    title="Coding Interview"
                    description="Live technical coding challenge"
                    icon={<Code color="#10b981" />}
                    status={isRejected ? 'Filtered' : ['AI_CLEARED', 'INTERVIEW_SCHEDULED'].includes(selectedApp.status) ? 'Active' : currentStageIndex < 2 ? 'Locked' : 'Completed'}
                    isActive={['AI_CLEARED', 'INTERVIEW_SCHEDULED'].includes(selectedApp.status) && !isRejected}
                    isDone={['CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)}
                    onAction={() => {
                      if (['CODING_CLEARED', 'SELECTED'].includes(selectedApp.status)) {
                        setResultModal({ title: 'Technical Interview Results', score: selectedApp.scores.coding, feedback: 'High-quality code production and architectural thinking.', icon: <Code size={24} />, color: '#10b981' });
                      } else {
                        window.open(`http://localhost:3002?candidate_id=${statusData.id}&application_id=${selectedApp.id}&role=${encodeURIComponent(selectedApp.applied_role)}`, '_blank');
                      }
                    }}
                  />
                </div>

                <StatusBanner status={selectedApp.status} resumeInsight={selectedApp.resume_insight} />

                <Card style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Application Progress</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Role: <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{selectedApp.applied_role}</span></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Applied Date</div>
                      <div style={{ fontSize: '1rem', fontWeight: '700' }}>{selectedApp.applied_date}</div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card style={{ height: '600px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={18} color="var(--primary)" /> HR Message Center
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>Chat directly with our talent acquisition team</p>
                </div>

                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#fff' }}>
                  {messages.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center' }}>
                      <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                      <p>No messages yet. Send a message to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        style={{ 
                          maxWidth: '80%',
                          alignSelf: msg.sender_role === 'candidate' ? 'flex-end' : 'flex-start',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem'
                        }}
                      >
                        <div style={{ 
                          padding: '0.75rem 1.25rem',
                          borderRadius: '1.25rem',
                          fontSize: '0.95rem',
                          background: msg.sender_role === 'candidate' ? 'var(--primary)' : '#f1f5f9',
                          color: msg.sender_role === 'candidate' ? 'white' : 'var(--text-main)',
                          borderBottomRightRadius: msg.sender_role === 'candidate' ? '0.25rem' : '1.25rem',
                          borderBottomLeftRadius: msg.sender_role === 'candidate' ? '1.25rem' : '0.25rem',
                        }}>
                          {msg.content}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: msg.sender_role === 'candidate' ? 'right' : 'left', padding: '0 0.5rem' }}>
                          {msg.sender_role === 'admin' ? 'HR Team' : 'You'} • {msg.timestamp}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    style={{ flex: 1, padding: '0.85rem 1.25rem', borderRadius: '2rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.95rem' }}
                  />
                  <Button type="submit" disabled={isSending || !newMessage.trim()} style={{ borderRadius: '2rem', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {isSending ? '...' : <><Send size={18} /> Send</>}
                  </Button>
                </form>
              </Card>
            )}
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ScoreAnalytics scores={selectedApp.scores} />
            <ApplicationLevelCard
              currentStageIndex={currentStageIndex}
              stages={RECRUITMENT_STAGES}
              isRejected={isRejected}
              status={selectedApp.status}
            />
          </aside>
        </div>
      </main>
      {/* Resume View Modal */}
      {showResumeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: '450px', width: '90%', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setShowResumeModal(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '1rem', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <FileText size={32} />
              </div>
              <h3 style={{ margin: 0 }}>Your Applied Resume</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Documents currently on file for this application</p>
            </div>

            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.6rem', fontWeight: '900', color: '#ef4444' }}>PDF</div>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedApp.resume_url || 'resume_v1.pdf'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original Submission</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => setShowResumeModal(false)}>
                Download Resume
              </Button>
              <Button variant="outline" style={{ width: '100%' }} onClick={() => setShowResumeModal(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Result View Modal */}
      {resultModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: '450px', width: '90%', padding: '2.5rem', position: 'relative', textAlign: 'center' }}>
            <button onClick={() => setResultModal(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>

            <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', background: `${resultModal.color}10`, color: resultModal.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              {resultModal.icon}
            </div>

            <h3 style={{ marginBottom: '0.5rem' }}>{resultModal.title}</h3>

            {!resultModal.isInfo && (
              <div style={{ margin: '2rem 0' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                  <svg style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke={resultModal.color} strokeWidth="12" strokeDasharray="339.292" strokeDashoffset={339.292 - (339.292 * resultModal.score) / 100} style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    {resultModal.score}%
                  </div>
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.7rem', fontWeight: '800', color: resultModal.color, textTransform: 'uppercase' }}>Performance Rating</div>
              </div>
            )}

            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'left' }}>AI Feedback</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0, textAlign: 'left' }}>
                {resultModal.feedback}
              </p>
            </div>

            <Button onClick={() => setResultModal(null)} style={{ width: '100%' }}>Close Report</Button>
          </Card>
        </div>
      )}
    </div>
  );
};

/* Internal Sub-components */

const WelcomeHero = ({ userName, currentStage, isRejected, status }) => {
  const isSelected = status === 'SELECTED';
  const isScheduled = status === 'INTERVIEW_SCHEDULED';

  return (
    <Card style={{
      background: isSelected
        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        : isRejected
          ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
          : isScheduled
            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      padding: '3rem',
      position: 'relative',
      overflow: 'hidden',
      border: 'none'
    }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{ marginBottom: '0.75rem', color: 'white', fontSize: '2.25rem' }}>
          {isSelected ? 'Congratulations!' : isRejected ? 'Application Status' : isScheduled ? 'Final Round Ready!' : `Welcome back, ${userName.split(' ')[0]}!`}
        </h1>
        <p style={{ opacity: 0.9, marginBottom: '2rem', maxWidth: '500px', fontSize: '1.1rem', lineHeight: '1.5' }}>
          {isSelected
            ? `Fantastic news, ${userName}! You have successfully cleared all rounds and have been selected for the position. We are thrilled to have you join our team!`
            : isRejected
              ? "Thank you for your interest. Unfortunately, your application didn't meet the criteria for this specific role."
              : isScheduled
                ? `Great news, ${userName}! Your final technical interview has been scheduled. Prepare your environment and join using the link below.`
                : `You are currently in the ${currentStage} stage. Complete the next step to move forward in the hiring process.`
          }
        </p>
        {!isRejected && !isSelected && !isScheduled && <Button variant="primary" style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '0.75rem 2rem', fontSize: '1rem', fontWeight: '700' }}>Review Status</Button>}
      </div>
      {isSelected ? <CheckCircle size={160} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} /> : isRejected ? <XCircle size={160} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} /> : <Briefcase size={160} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, transform: 'rotate(-15deg)' }} />}
    </Card>
  );
};

const ApplicationLevelCard = ({ currentStageIndex, stages, isRejected, status }) => {
  const stageNum = isRejected ? 0 : currentStageIndex + 1;
  const isSelected = status === 'SELECTED';

  return (
    <Card style={{ padding: '1.5rem' }}>
      <h4 style={{ marginBottom: '1.25rem' }}>Application Level</h4>
      <div style={{ background: isRejected ? '#fef2f2' : isSelected ? '#fffbeb' : '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: `1px solid ${isRejected ? '#fecaca' : isSelected ? '#fef3c7' : 'var(--border)'}` }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            background: isRejected ? '#ef4444' : isSelected ? '#f59e0b' : 'var(--primary)',
            padding: '0.6rem',
            borderRadius: '0.75rem',
            textAlign: 'center',
            minWidth: '55px',
            color: 'white'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: '900', opacity: 0.8 }}>LEVEL</div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{isSelected ? '5' : isRejected ? '!' : stageNum}</div>
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>
              {isSelected ? 'Hiring Complete' : isRejected ? 'Process Ended' : stages[currentStageIndex]}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {isSelected ? 'Welcome to the team!' : isRejected ? 'ATS Screening' : `Step ${stageNum} of 5`}
            </div>
          </div>
        </div>
        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{
            width: `${isSelected ? 100 : isRejected ? 10 : (stageNum / 5) * 100}%`,
            height: '100%',
            background: isRejected ? '#ef4444' : isSelected ? '#f59e0b' : 'var(--primary)',
            transition: 'width 1s ease'
          }}></div>
        </div>
      </div>
    </Card>
  );
};

const ResourceLink = ({ title }) => (
  <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', transition: 'padding 0.2s' }} onMouseEnter={e => e.currentTarget.style.paddingLeft = '0.5rem'} onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}>
    {title} <ChevronRight size={14} color="#94a3b8" />
  </a>
);

const FinalInterviewBanner = ({ time, candidateId, appId, role }) => (
  <Card style={{ 
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', 
    color: 'white', 
    padding: '2rem', 
    marginBottom: '2rem',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    animation: 'slideUp 0.5s ease-out'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '1rem' }}>
        <Calendar size={32} />
      </div>
      <div>
        <h3 style={{ color: 'white', marginBottom: '0.25rem' }}>Final Interview Scheduled!</h3>
        <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Your technical coding round is set for: <span style={{ fontWeight: '800' }}>{time}</span></p>
      </div>
    </div>
    <Button 
      onClick={() => window.open(`http://localhost:3001?candidate_id=${candidateId}&application_id=${appId}&role=candidate`, '_blank')}
      style={{ background: 'white', color: '#1d4ed8', border: 'none', padding: '0.75rem 1.5rem', fontWeight: '800', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
    >
      Join Interview Room
    </Button>
  </Card>
);

export default CandidateDashboard;
