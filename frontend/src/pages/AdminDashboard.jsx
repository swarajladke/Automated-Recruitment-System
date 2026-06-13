import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, RefreshCw, Filter, MoreVertical, 
  Download, ExternalLink, UserCheck, UserX,
  ChevronRight, X, Briefcase, Sparkles, MessageSquare, Send, PieChart
} from 'lucide-react';

import { adminService, messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';

import { Button, Card, Spinner } from '../components/common/UI';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import AdminSidebar from '../components/dashboard/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeChatCandidate, setActiveChatCandidate] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = React.useRef(null);
  const globalChatEndRef = React.useRef(null);

  // MCQ Manager State
  const [mcqs, setMcqs] = useState([]);
  const [isAddingMcq, setIsAddingMcq] = useState(false);
  const [newMcq, setNewMcq] = useState({
    role: '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: ''
  });

  // Coding Manager State
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [newCodingQ, setNewCodingQ] = useState({
    role: '',
    title: '',
    description: '',
    difficulty: 'Medium',
    starter_code: '',
    time_limit_mins: 30,
    test_cases: [{ input: '', expected_output: '' }]
  });

  // Job Manager State
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    dept: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '',
    description: '',
    requirements: ''
  });

  // Settings State
  const [platformSettings, setPlatformSettings] = useState({
    autoScreening: true,
    emailNotifications: true,
    aiThreshold: 75,
    maintenanceMode: false
  });

  // Scheduling State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewTime, setInterviewTime] = useState('');
  const [schedulingCandidate, setSchedulingCandidate] = useState(null);

  const handleScheduleInterview = async () => {
    if (!interviewTime) return alert("Please enter a time");
    try {
      await adminService.scheduleInterview({ 
        application_id: schedulingCandidate.application_id, 
        interview_time: interviewTime 
      });
      setShowScheduleModal(false);
      setInterviewTime('');
      fetchCandidates();
      alert("Final Technical Round scheduled and candidate notified!");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/auth?mode=login');
      return;
    }
    fetchCandidates();
    fetchMcqs();
    fetchCodingQuestions();
    fetchJobs();
  }, [user, authLoading, navigate]);

  const fetchMcqs = async () => {
    try {
      const res = await adminService.getMCQs();
      setMcqs(res.data);
    } catch (err) {
      console.error("Failed to fetch MCQs:", err);
    }
  };

  const fetchCodingQuestions = async () => {
    try {
      const res = await adminService.getCodingQuestions();
      setCodingQuestions(res.data);
    } catch (err) { console.error('Failed to fetch coding questions:', err); }
  };

  const handleAddMcq = async (e) => {
    e.preventDefault();
    if (!newMcq.role || !newMcq.question || !newMcq.correct_answer || newMcq.options.some(o => !o)) {
      alert("Please select a role and fill all fields and options.");
      return;
    }

    try {
      await adminService.addMCQ(newMcq);
      setNewMcq({
        role: '',
        question: '',
        options: ['', '', '', ''],
        correct_answer: ''
      });
      fetchMcqs();
      alert("Question added successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMcq = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await adminService.deleteMCQ(id);
      fetchMcqs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCodingQuestion = async (e) => {
    e.preventDefault();
    if (!newCodingQ.role || !newCodingQ.title || !newCodingQ.description) {
      alert('Please fill in the role, title, and problem description.');
      return;
    }
    const validTestCases = newCodingQ.test_cases.filter(tc => tc.input.trim() && tc.expected_output.trim());
    if (validTestCases.length === 0) {
      alert('Please add at least one complete test case.');
      return;
    }
    try {
      await adminService.addCodingQuestion({ ...newCodingQ, test_cases: validTestCases });
      setNewCodingQ({ role: '', title: '', description: '', difficulty: 'Medium', starter_code: '', time_limit_mins: 30, test_cases: [{ input: '', expected_output: '' }] });
      fetchCodingQuestions();
      alert('Coding question added successfully!');
    } catch (err) { console.error(err); }
  };

  const handleDeleteCodingQuestion = async (id) => {
    if (!window.confirm('Delete this coding question?')) return;
    try {
      await adminService.deleteCodingQuestion(id);
      fetchCodingQuestions();
    } catch (err) {
      console.error(err);
    }
  };

  const addTestCaseRow = () => setNewCodingQ(prev => ({ ...prev, test_cases: [...prev.test_cases, { input: '', expected_output: '' }] }));
  const removeTestCaseRow = (i) => setNewCodingQ(prev => ({ ...prev, test_cases: prev.test_cases.filter((_, idx) => idx !== i) }));
  const updateTestCase = (i, field, val) => setNewCodingQ(prev => { const tc = [...prev.test_cases]; tc[i] = { ...tc[i], [field]: val }; return { ...prev, test_cases: tc }; });

  const fetchJobs = async () => {
    try {
      const res = await adminService.getAdminJobs();
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.salary) {
      alert("Please enter a job title and salary range.");
      return;
    }

    try {
      await adminService.addJob(newJob);
      setNewJob({
        title: '',
        dept: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        salary: '',
        description: '',
        requirements: ''
      });
      fetchJobs();
      alert("Job posted successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Delete this job posting?")) return;
    try {
      await adminService.deleteJob(id);
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    const target = selectedCandidate || activeChatCandidate;
    if (!target) return;
    try {
      const res = await messageService.getMessages(target.id);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    let interval;
    if (selectedCandidate || activeChatCandidate) {
      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    } else {
      setMessages([]);
    }
    return () => clearInterval(interval);
  }, [selectedCandidate, activeChatCandidate]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (globalChatEndRef.current) {
      globalChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const target = selectedCandidate || activeChatCandidate;
    if (!newMessage.trim() || isSending || !target) return;

    setIsSending(true);
    try {
      await messageService.sendMessage({
        sender_id: user.id,
        receiver_id: target.id,
        content: newMessage,
        sender_name: "HR Team",
        sender_role: 'admin'
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllCandidates();
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, status) => {
    try {
      // In the backend it's /admin/update-status which is updateCandidateStatus in api.js
      await adminService.updateCandidateStatus({ application_id: appId, status });
      fetchCandidates();
      setSelectedCandidate(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pipeline = {
    applied: candidates.filter(c => c.status !== 'REJECTED').length,
    mcq: candidates.filter(c => ['MCQ_CLEARED', 'AI_CLEARED', 'INTERVIEW_SCHEDULED', 'CODING_CLEARED', 'SELECTED'].includes(c.status)).length,
    ai: candidates.filter(c => ['AI_CLEARED', 'INTERVIEW_SCHEDULED', 'CODING_CLEARED', 'SELECTED'].includes(c.status)).length,
    coding: candidates.filter(c => ['CODING_CLEARED', 'SELECTED'].includes(c.status)).length,
    selected: candidates.filter(c => c.status === 'SELECTED').length,
  };

  const filteredCandidates = candidates.filter(c => {
    const nameMatch = c.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;
    const matchesFilter = filterStatus === 'ALL' || c.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <DashboardNavbar userName="Admin User" userId="HR" isFluid />

      <div style={{ display: 'flex', flex: 1 }}>
        <div style={{ width: '280px', padding: '2rem 1.5rem', background: '#f8fafc', borderRight: '1px solid var(--border)' }}>
          <AdminSidebar onLogout={handleLogout} activeView={activeView} onViewChange={setActiveView} />
        </div>

        <main style={{ flex: 1, padding: '2.5rem 3rem' }}>
          {(activeView === 'overview' || activeView === 'candidates') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>Hiring Command Center</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Monitor your multi-stage AI recruitment funnel in real-time.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Download size={18} /> Export Results
                  </Button>
                  <Button onClick={fetchCandidates} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <RefreshCw size={18} className={loading ? 'spin' : ''} /> Sync Data
                  </Button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                <PipelineCard label="Applied" count={pipeline.applied} color="#94a3b8" />
                <PipelineCard label="MCQ Passed" count={pipeline.mcq} color="#3b82f6" />
                <PipelineCard label="AI Cleared" count={pipeline.ai} color="#8b5cf6" />
                <PipelineCard label="Coding Cleared" count={pipeline.coding} color="#10b981" />
                <PipelineCard label="Selected" count={pipeline.selected} color="#059669" isFinal />
              </div>

              <Card style={{ padding: '0', overflow: 'hidden', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                      <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        placeholder="Search candidates..."
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.9rem' }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Status:</span>
                      <select 
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'white', fontWeight: '600', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="ALL">All Stages</option>
                        <option value="APPLIED">Applied</option>
                        <option value="MCQ_CLEARED">MCQ Passed</option>
                        <option value="AI_CLEARED">AI Cleared</option>
                        <option value="CODING_CLEARED">Coding Cleared</option>
                        <option value="SELECTED">Selected</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                        <th style={thStyle}>Candidate</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>MCQ</th>
                        <th style={thStyle}>AI Interview</th>
                        <th style={thStyle}>Coding</th>
                        <th style={thStyle}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" style={{ padding: '6rem' }}><Spinner /></td></tr>
                      ) : filteredCandidates.map(c => (
                        <tr key={c.application_id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{c.name?.charAt(0)}</div>
                              <div>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{c.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.applied_role}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 1.5rem' }}><StatusBadge status={c.status} /></td>
                          <td style={tdScoreStyle(c.scores.mcq)}>{c.scores.mcq}%</td>
                          <td style={tdScoreStyle(c.scores.ai)}>{c.scores.ai}%</td>
                          <td style={tdScoreStyle(c.scores.coding)}>{c.scores.coding}%</td>
                          <td style={{ padding: '1.25rem 1.5rem' }}>
                            <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setSelectedCandidate(c)}>
                              Review Profile
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {activeView === 'messages' && (
            <div style={{ height: 'calc(100vh - 150px)', display: 'flex', gap: '2rem' }}>
              <Card style={{ width: '350px', padding: '0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Inquiries</h3>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {candidates.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveChatCandidate(c)}
                      style={{ 
                        padding: '1.25rem 1.5rem', 
                        cursor: 'pointer', 
                        borderBottom: '1px solid #f1f5f9',
                        background: activeChatCandidate?.id === c.id ? '#eff6ff' : 'transparent',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{c.name?.charAt(0)}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.applied_role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column' }}>
                {activeChatCandidate ? (
                  <>
                    <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={20} color="var(--primary)" /></div>
                      <div>
                        <div style={{ fontWeight: '700' }}>Chat with {activeChatCandidate.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Status: {activeChatCandidate.status}</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {messages.map(msg => (
                        <div key={msg.id} style={{ alignSelf: msg.sender_role === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                          <div style={{ 
                            padding: '0.75rem 1.25rem', 
                            borderRadius: '1.25rem', 
                            background: msg.sender_role === 'admin' ? 'var(--primary)' : '#f1f5f9',
                            color: msg.sender_role === 'admin' ? 'white' : 'var(--text-main)',
                            borderBottomRightRadius: msg.sender_role === 'admin' ? '0.2rem' : '1.25rem',
                            borderBottomLeftRadius: msg.sender_role === 'admin' ? '1.25rem' : '0.2rem',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                          }}>
                            {msg.content}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: msg.sender_role === 'admin' ? 'right' : 'left' }}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))}
                      <div ref={globalChatEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                      <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message here..."
                        style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', outline: 'none' }}
                      />
                      <Button type="submit" style={{ padding: '1rem 2rem' }} disabled={!newMessage.trim() || isSending}>
                        <Send size={18} />
                      </Button>
                    </form>
                  </>
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <MessageSquare size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                    <h3 style={{ fontWeight: '700' }}>Select a candidate to start chatting</h3>
                    <p style={{ fontSize: '0.9rem' }}>Choose from the list on the left to view conversation history.</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeView === 'mcq_manager' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>MCQ Assessment Manager</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Create and manage custom qualification exams for each role.</p>
                </div>
                <Button onClick={() => adminService.initDefaultMCQs().then(fetchMcqs)} variant="outline">
                  Load Default Questions
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                {/* Add Question Form */}
                <Card style={{ padding: '2rem', height: 'fit-content' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="var(--primary)" /> Add New Question
                  </h3>
                  <form onSubmit={handleAddMcq} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Job Role</label>
                      <select 
                        value={newMcq.role}
                        onChange={(e) => setNewMcq({...newMcq, role: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      >
                        <option value="" disabled>Select Job Role...</option>
                        {jobs.length === 0 ? (
                          <option disabled>No active jobs available</option>
                        ) : (
                          jobs.map((job) => (
                            <option key={job.id} value={job.title}>{job.title}</option>
                          ))
                        )}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Question Text</label>
                      <textarea 
                        value={newMcq.question}
                        onChange={(e) => setNewMcq({...newMcq, question: e.target.value})}
                        placeholder="Enter the question here..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {newMcq.options.map((opt, i) => (
                        <div key={i}>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>Option {i+1}</label>
                          <input 
                            type="text" 
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...newMcq.options];
                              newOpts[i] = e.target.value;
                              setNewMcq({...newMcq, options: newOpts});
                            }}
                            placeholder={`Option ${i+1}`}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Correct Answer</label>
                      <select 
                        value={newMcq.correct_answer}
                        onChange={(e) => setNewMcq({...newMcq, correct_answer: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', background: '#ecfdf5', fontWeight: '700' }}
                      >
                        <option value="">Select correct option...</option>
                        {newMcq.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                      </select>
                    </div>

                    <Button type="submit" style={{ marginTop: '1rem' }}>Save Question to Bank</Button>
                  </form>
                </Card>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Active Question Bank ({mcqs.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '700px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {mcqs.length === 0 ? (
                      <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No questions found. Add one on the left or load defaults.
                      </Card>
                    ) : (
                      mcqs.map((q) => (
                        <Card key={q.id} style={{ padding: '1.5rem', position: 'relative' }}>
                          <button 
                            onClick={() => handleDeleteMcq(q.id)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <X size={18} />
                          </button>
                          <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{q.role}</div>
                          <div style={{ fontWeight: '700', fontSize: '1rem', marginBottom: '1rem', paddingRight: '2rem' }}>{q.question}</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {q.options.map((opt, i) => (
                              <div key={i} style={{ 
                                padding: '0.5rem 0.75rem', 
                                borderRadius: '0.5rem', 
                                fontSize: '0.8rem', 
                                border: '1px solid var(--border)',
                                background: opt === q.correct_answer ? '#d1fae5' : '#f8fafc',
                                color: opt === q.correct_answer ? '#065f46' : 'var(--text-main)',
                                fontWeight: opt === q.correct_answer ? '700' : '400'
                              }}>
                                {opt}
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'coding_manager' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>Coding Challenge Manager</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Create and manage technical coding problems with custom test cases.</p>
                </div>
                <Button onClick={() => adminService.initDefaultCodingQuestions().then(fetchCodingQuestions)} variant="outline">
                  Load Default Problems
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem', alignItems: 'start' }}>
                {/* Add Coding Question Form */}
                <Card style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="var(--primary)" /> Add New Problem
                  </h3>
                  <form onSubmit={handleAddCodingQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    {/* Role */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Target Job Role</label>
                      <select
                        value={newCodingQ.role}
                        onChange={e => setNewCodingQ({ ...newCodingQ, role: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      >
                        <option value="" disabled>Select Job Role...</option>
                        {jobs.length === 0 ? (
                          <option disabled>No active jobs available</option>
                        ) : (
                          jobs.map(job => <option key={job.id} value={job.title}>{job.title}</option>)
                        )}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Problem Title</label>
                      <input
                        type="text"
                        value={newCodingQ.title}
                        onChange={e => setNewCodingQ({ ...newCodingQ, title: e.target.value })}
                        placeholder="e.g. Two Sum, Valid Parentheses..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      />
                    </div>

                    {/* Difficulty + Time */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Difficulty</label>
                        <select
                          value={newCodingQ.difficulty}
                          onChange={e => setNewCodingQ({ ...newCodingQ, difficulty: e.target.value })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                        >
                          <option>Easy</option>
                          <option>Medium</option>
                          <option>Hard</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Time Limit (mins)</label>
                        <input
                          type="number"
                          min="5" max="120"
                          value={newCodingQ.time_limit_mins}
                          onChange={e => setNewCodingQ({ ...newCodingQ, time_limit_mins: parseInt(e.target.value) || 30 })}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Problem Description</label>
                      <textarea
                        value={newCodingQ.description}
                        onChange={e => setNewCodingQ({ ...newCodingQ, description: e.target.value })}
                        placeholder="Describe the problem clearly with examples..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', minHeight: '110px', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                    </div>

                    {/* Starter Code */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Starter Code (optional)</label>
                      <textarea
                        value={newCodingQ.starter_code}
                        onChange={e => setNewCodingQ({ ...newCodingQ, starter_code: e.target.value })}
                        placeholder="def solution(nums):\n    pass"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', minHeight: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '0.85rem', background: '#f8fafc' }}
                      />
                    </div>

                    {/* Test Cases */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>Test Cases</label>
                        <button type="button" onClick={addTestCaseRow} style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Case</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {newCodingQ.test_cases.map((tc, i) => (
                          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={tc.input}
                              onChange={e => updateTestCase(i, 'input', e.target.value)}
                              placeholder={`Input ${i + 1}`}
                              style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}
                            />
                            <input
                              type="text"
                              value={tc.expected_output}
                              onChange={e => updateTestCase(i, 'expected_output', e.target.value)}
                              placeholder={`Expected Output ${i + 1}`}
                              style={{ padding: '0.6rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.82rem', fontFamily: 'monospace' }}
                            />
                            {newCodingQ.test_cases.length > 1 && (
                              <button type="button" onClick={() => removeTestCaseRow(i)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}>
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button type="submit" style={{ marginTop: '0.5rem' }}>Save Problem to Bank</Button>
                  </form>
                </Card>

                {/* Questions List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Active Problem Bank ({codingQuestions.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '780px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {codingQuestions.length === 0 ? (
                      <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No problems yet. Add one on the left or load defaults.
                      </Card>
                    ) : (
                      codingQuestions.map(q => (
                        <Card key={q.id} style={{ padding: '1.5rem', position: 'relative' }}>
                          <button
                            onClick={() => handleDeleteCodingQuestion(q.id)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                          >
                            <X size={18} />
                          </button>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>{q.role}</span>
                            <span style={{
                              fontSize: '0.7rem', fontWeight: '700', padding: '0.15rem 0.6rem', borderRadius: '99px',
                              background: q.difficulty === 'Easy' ? '#d1fae5' : q.difficulty === 'Hard' ? '#fee2e2' : '#fef9c3',
                              color: q.difficulty === 'Easy' ? '#065f46' : q.difficulty === 'Hard' ? '#991b1b' : '#92400e'
                            }}>{q.difficulty}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto', paddingRight: '2rem' }}>⏱ {q.time_limit_mins} mins</span>
                          </div>
                          <div style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '0.5rem' }}>{q.title}</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{q.description.length > 200 ? q.description.slice(0, 200) + '...' : q.description}</div>
                          {q.starter_code && (
                            <pre style={{ background: '#f1f5f9', borderRadius: '0.5rem', padding: '0.75rem', fontSize: '0.78rem', overflowX: 'auto', marginBottom: '1rem' }}>{q.starter_code}</pre>
                          )}
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TEST CASES ({q.test_cases?.length || 0})</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {(q.test_cases || []).map((tc, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                                  <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '0.4rem', padding: '0.4rem 0.6rem' }}>In: {tc.input}</div>
                                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#065f46' }}>Out: {tc.expected_output}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'job_manager' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>Job Posting Manager</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your active vacancies and attract top talent.</p>
                </div>
                <Button onClick={() => adminService.initDefaultJobs().then(fetchJobs)} variant="outline">
                  Load Sample Jobs
                </Button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2rem' }}>
                <Card style={{ padding: '2rem', height: 'fit-content' }}>
                  <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Briefcase size={20} color="var(--primary)" /> Post New Opening
                  </h3>
                  <form onSubmit={handleAddJob} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Job Title</label>
                      <input 
                        type="text" 
                        value={newJob.title}
                        onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                        placeholder="e.g. Senior Frontend Developer"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Department</label>
                        <select 
                          value={newJob.dept}
                          onChange={(e) => setNewJob({...newJob, dept: e.target.value})}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                        >
                          <option>Engineering</option>
                          <option>Design</option>
                          <option>AI Labs</option>
                          <option>Product</option>
                          <option>HR</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
                        <select 
                          value={newJob.type}
                          onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                        >
                          <option>Full-time</option>
                          <option>Part-time</option>
                          <option>Contract</option>
                          <option>Internship</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Location</label>
                      <input 
                        type="text" 
                        value={newJob.location}
                        onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                        placeholder="Remote or City, Country"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Salary Range</label>
                      <input 
                        type="text" 
                        value={newJob.salary}
                        onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                        placeholder="e.g. $120k - $160k"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Role Description</label>
                      <textarea 
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                        placeholder="We are looking for a highly motivated..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', minHeight: '80px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Key Requirements (One per line)</label>
                      <textarea 
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                        placeholder="3+ years of experience...\nStrong proficiency in..."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', resize: 'vertical', minHeight: '80px' }}
                      />
                    </div>
                    <Button type="submit" style={{ marginTop: '1rem' }}>Publish Job Opening</Button>
                  </form>
                </Card>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Active Postings ({jobs.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {jobs.length === 0 ? (
                      <Card style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No active jobs. Click 'Load Samples' or create one on the left.
                      </Card>
                    ) : (
                      jobs.map((job) => (
                        <Card key={job.id} style={{ padding: '1.5rem', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ background: '#ecfdf5', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>{job.dept}</span>
                                <span style={{ background: '#f1f5f9', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: '800', padding: '0.2rem 0.6rem', borderRadius: '2rem' }}>{job.type}</span>
                              </div>
                              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{job.title}</h4>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{job.location} • {job.salary}</div>
                            </div>
                            <Button 
                              variant="outline" 
                              style={{ color: '#ef4444', borderColor: '#ef4444', padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'reports' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>Hiring Analytics</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Insights and performance metrics for your recruitment funnel.</p>
                </div>
                <PieChart size={40} color="var(--primary)" style={{ opacity: 0.2 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                <Card style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Conversion Rate</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', marginBottom: '0.5rem' }}>24.8%</div>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: '700' }}>↑ 12% from last month</div>
                </Card>
                <Card style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Avg. Time to Hire</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '0.5rem' }}>14 Days</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Industry average: 22 days</div>
                </Card>
                <Card style={{ padding: '2rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Total Pipeline Value</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#8b5cf6', marginBottom: '0.5rem' }}>{candidates.length}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active applicants across all roles</div>
                </Card>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <Card style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '2rem' }}>Candidate Distribution by Role</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {['Senior Frontend Developer', 'AI Research Scientist', 'Full Stack Engineer'].map(role => {
                      const count = candidates.filter(c => c.applied_role === role).length;
                      const percentage = candidates.length > 0 ? (count / candidates.length) * 100 : 0;
                      return (
                        <div key={role}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span style={{ fontWeight: '700' }}>{role}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{count} Candidates</span>
                          </div>
                          <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percentage}%`, background: 'var(--primary)', borderRadius: '4px' }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card>

                <Card style={{ padding: '2rem', background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                  <RefreshCw size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                  <h3 style={{ color: 'white', marginBottom: '1rem' }}>AI Efficiency Score</h3>
                  <div style={{ fontSize: '3rem', fontWeight: '900' }}>92%</div>
                  <p style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '1rem' }}>Your recruitment automation is currently saving 45 hours per week.</p>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <div>
                <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', fontWeight: '800' }}>System Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Configure platform automation and administrative preferences.</p>
              </div>

              <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Sparkles size={20} color="var(--primary)" /> AI Screening Configuration</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700' }}>Automated ATS Screening</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Instantly analyze and filter candidates upon application.</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={platformSettings.autoScreening}
                        onChange={(e) => setPlatformSettings({...platformSettings, autoScreening: e.target.checked})}
                        style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: '700' }}>AI Match Threshold</div>
                        <div style={{ fontWeight: '800', color: 'var(--primary)' }}>{platformSettings.aiThreshold}%</div>
                      </div>
                      <input 
                        type="range" 
                        min="50" max="95" step="5"
                        value={platformSettings.aiThreshold}
                        onChange={(e) => setPlatformSettings({...platformSettings, aiThreshold: e.target.value})}
                        style={{ width: '100%', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <span>Leniant (50%)</span>
                        <span>Strict (95%)</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card style={{ padding: '2rem' }}>
                  <h3 style={{ marginBottom: '2rem' }}>Communications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '700' }}>Email Notifications</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send automated interview invites and status updates.</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={platformSettings.emailNotifications}
                        onChange={(e) => setPlatformSettings({...platformSettings, emailNotifications: e.target.checked})}
                        style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </Card>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button style={{ padding: '1rem 3rem' }} onClick={() => alert("Settings saved successfully!")}>Save Changes</Button>
                  <Button variant="outline">Reset to Defaults</Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {selectedCandidate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
            <button onClick={() => setSelectedCandidate(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X /></button>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', alignItems: 'center' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '15px', background: '#ecfdf5', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800' }}>{selectedCandidate.name?.charAt(0)}</div>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>{selectedCandidate.name}</h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{selectedCandidate.email}</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', fontWeight: '800' }}>Assessment Results</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <ScoreMini label="MCQ" score={selectedCandidate.scores.mcq} />
                <ScoreMini label="AI Video" score={selectedCandidate.scores.ai} />
                <ScoreMini label="Coding" score={selectedCandidate.scores.coding} />
              </div>

              {selectedCandidate.scores.coding_details && (
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Questions Solved</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedCandidate.scores.coding_details.solved} / 2</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Test Cases Passed</div>
                    <div style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{selectedCandidate.scores.coding_details.test_cases} Total</div>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', border: '1px solid #d1fae5' }}>
              <div style={{ fontSize: '0.8rem', color: '#059669', marginBottom: '1.25rem', textTransform: 'uppercase', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} /> AI Resume Insights
              </div>
              {selectedCandidate.resume_insight ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontSize: '2rem', fontWeight: '900', color: '#065f46', lineHeight: 1 }}>{selectedCandidate.resume_insight.match_score}%</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', marginTop: '0.25rem' }}>Job Match Score</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end', maxWidth: '60%' }}>
                      {selectedCandidate.resume_insight.skills?.map(skill => (
                        <span key={skill} style={{ padding: '0.25rem 0.6rem', background: '#fff', border: '1px solid #d1fae5', color: '#065f46', borderRadius: '2rem', fontSize: '0.65rem', fontWeight: '800' }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                    "{selectedCandidate.resume_insight.summary}"
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}>No resume analysis available.</div>
              )}
            </div>
            
            <div style={{ marginBottom: '2rem', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.85rem' }}>
                <MessageSquare size={16} color="var(--primary)" /> Chat with {selectedCandidate.name}
              </div>
              <div style={{ height: '200px', overflowY: 'auto', padding: '1rem', background: '#fff', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.length === 0 ? (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>No conversation history.</div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} style={{ alignSelf: msg.sender_role === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                      <div style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.85rem',
                        background: msg.sender_role === 'admin' ? 'var(--primary)' : '#f1f5f9',
                        color: msg.sender_role === 'admin' ? 'white' : 'var(--text-main)',
                        borderBottomRightRadius: msg.sender_role === 'admin' ? '0.2rem' : '1rem',
                        borderBottomLeftRadius: msg.sender_role === 'admin' ? '1rem' : '0.2rem',
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} style={{ padding: '0.75rem', background: '#f8fafc', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.85rem' }}
                />
                <button type="submit" disabled={isSending || !newMessage.trim()} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '50%', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </form>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedCandidate.status === 'AI_CLEARED' && (
                <Button 
                  onClick={() => {
                    setSchedulingCandidate(selectedCandidate);
                    setShowScheduleModal(true);
                  }}
                  style={{ background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
                >
                  Schedule Final Technical Round
                </Button>
              )}

              {selectedCandidate.status === 'INTERVIEW_SCHEDULED' && (
                <Button 
                  onClick={() => window.open(`http://localhost:3001?candidate_id=${selectedCandidate.id}&application_id=${selectedCandidate.application_id}&role=admin`, '_blank')}
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', border: 'none' }}
                >
                  Join Live Interview Room
                </Button>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  variant="primary" 
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}
                  disabled={selectedCandidate.status === 'REJECTED' || selectedCandidate.status === 'SELECTED'}
                  onClick={() => handleUpdateStatus(selectedCandidate.application_id, 'SELECTED')}
                >
                  <UserCheck size={20} /> Hire Candidate
                </Button>
                <Button 
                  variant="outline" 
                  style={{ flex: 1, borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  disabled={selectedCandidate.status === 'REJECTED' || selectedCandidate.status === 'SELECTED'}
                  onClick={() => handleUpdateStatus(selectedCandidate.application_id, 'REJECTED')}
                >
                  <UserX size={20} /> Reject
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showScheduleModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: '400px', width: '90%', padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Schedule Final Interview</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Set a date and time for the live technical coding round with {schedulingCandidate?.name}.</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Interview Date & Time</label>
              <input 
                type="text" 
                placeholder="e.g., May 24th, 2:00 PM"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button style={{ flex: 1 }} onClick={handleScheduleInterview}>Save Schedule</Button>
            </div>
          </Card>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

const PipelineCard = ({ label, count, color, isFinal }) => (
  <Card style={{ padding: '1.25rem', borderLeft: `4px solid ${color}`, textAlign: 'center' }}>
    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: isFinal ? '#059669' : 'var(--text-main)' }}>{count}</div>
  </Card>
);

const ScoreMini = ({ label, score }) => (
  <div>
    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: score >= 60 ? 'var(--primary)' : '#ef4444' }}>{score}%</div>
  </div>
);

const thStyle = { padding: '1.25rem 1.5rem', fontWeight: '800', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' };
const tdScoreStyle = (score) => ({ padding: '1.25rem 1.5rem', fontWeight: '800', fontSize: '0.95rem', color: score >= 80 ? '#10b981' : score >= 60 ? 'var(--primary)' : score > 0 ? '#ef4444' : '#cbd5e1' });

const StatusBadge = ({ status }) => {
  const getColors = () => {
    switch(status) {
      case 'SELECTED': return { bg: '#dcfce7', text: '#15803d', label: 'Selected' };
      case 'REJECTED': return { bg: '#fee2e2', text: '#b91c1c', label: 'Rejected' };
      case 'APPLIED': return { bg: '#f1f5f9', text: '#64748b', label: 'Applied' };
      case 'MCQ_CLEARED': return { bg: '#d1fae5', text: '#065f46', label: 'MCQ Passed' };
      case 'AI_CLEARED': return { bg: '#f0fdf4', text: '#15803d', label: 'AI Interviewed' };
      case 'INTERVIEW_SCHEDULED': return { bg: '#eff6ff', text: '#1d4ed8', label: 'Final Scheduled' };
      case 'CODING_CLEARED': return { bg: '#ecfdf5', text: '#059669', label: 'Coding Cleared' };
      default: return { bg: '#f1f5f9', text: '#64748b', label: status };
    }
  };
  const { bg, text, label } = getColors();
  return <span style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: '800', background: bg, color: text, border: `1px solid ${text}20` }}>{label}</span>;
};

export default AdminDashboard;
