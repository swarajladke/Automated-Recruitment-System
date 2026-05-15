import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Clock, Filter, 
  ArrowRight, CheckCircle, ChevronRight, Rocket,
  Building, DollarSign, X, Upload, FileText, Phone, Award
} from 'lucide-react';
import { Button, Card } from '../components/common/UI';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';

import { candidateService } from '../services/api';
import { useAuth } from '../context/AuthContext';



const JobsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJob, setAppliedJob] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningStatus, setScreeningStatus] = useState(null); // 'PASS' or 'FAIL'
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const [appliedRoles, setAppliedRoles] = useState([]);
  
  React.useEffect(() => {
    fetchJobs();
    if (user && user.role === 'candidate') {
      fetchAppliedRoles();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const res = await candidateService.getJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchAppliedRoles = async () => {
    try {
      const res = await candidateService.getStatus(user.id);
      const roles = res.data.applications?.map(app => app.applied_role) || [];
      setAppliedRoles(roles);
    } catch (err) {
      console.error("Failed to fetch applied roles:", err);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    resume: null
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (job) => {
    if (user && user.role === 'admin') {
      alert("Admins cannot apply for jobs.");
      return;
    }
    if (appliedRoles.includes(job.title)) {
      alert("You have already applied for this position.");
      return;
    }
    setAppliedJob(job);
    setFormData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || ''
    }));
    setShowForm(true);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetails(true);
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    
    const applicationData = {
      role: appliedJob.title,
      name: user ? user.name : formData.name,
      email: user ? user.email : formData.email,
      phone: formData.phone,
      experience: formData.experience,
      resume_name: formData.resume ? formData.resume.name : 'resume.pdf'
    };

    try {
      let status = 'PASS';
      if (!user) {
        const res = await candidateService.guestApply(applicationData);
        status = res.data.status;
        
        // Identity Bridge: Store pending application to sync after signup
        if (status === 'PASS') {
          sessionStorage.setItem('pending_application', JSON.stringify(applicationData));
        }
      } else {
        const res = await candidateService.apply({ candidate_id: user.id, ...applicationData });
        // Handle backend ALREADY_APPLIED message if it somehow gets past frontend check
        if (res.data.status === 'ALREADY_APPLIED') {
          alert(res.data.message);
          setShowForm(false);
          return;
        }
      }

      setScreeningStatus(status);
      setShowForm(false);
      
      // Refresh applied roles
      if (user) fetchAppliedRoles();
      
      // Start Screening Animation
      setIsScreening(true);
      setTimeout(() => {
        setIsScreening(false);
        setShowSuccess(true);
      }, 5000);

    } catch (err) {
      if (err.response?.data?.status === 'ALREADY_APPLIED') {
        alert(err.response.data.message);
        setShowForm(false);
      } else {
        console.error("Application failed:", err);
        alert("System busy. Please try again later.");
      }
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <DashboardNavbar userName={user ? user.name : "Guest"} userId="Member" isFluid />

      {/* Hero Search Section */}
      <section style={{ padding: '6rem 0 4rem', background: 'white', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Find Your Next <span style={{ color: 'var(--primary)' }}>Career Move</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>Browse open positions and join the future of AI-driven companies.</p>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search by role, department, or keywords..."
              style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 3.5rem', borderRadius: '1.5rem', border: '1px solid var(--border)', fontSize: '1.1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>Showing {filteredJobs.length} Positions</div>
            <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <Filter size={16} /> Filters
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={() => handleApplyClick(job)} 
                onViewDetails={() => handleViewDetails(job)}
                isApplying={isApplying && appliedJob?.id === job.id}
                isApplied={appliedRoles.includes(job.title)}
                isAdmin={user?.role === 'admin'}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Job Details Modal */}
      {showDetails && selectedJob && (
        <div style={modalOverlayStyle}>
          <Card style={{ ...formCardStyle, maxWidth: '750px', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '130px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '2rem' }}>
              <button onClick={() => setShowDetails(false)} style={{ ...closeBtnStyle, color: 'white', position: 'absolute', top: '1.25rem', right: '1.25rem' }}><X /></button>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '800', padding: '0.3rem 0.75rem', borderRadius: '2rem', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'inline-block', border: '1px solid rgba(16, 185, 129, 0.3)' }}>{selectedJob.dept}</span>
              <h2 style={{ color: 'white', fontSize: '1.75rem' }}>{selectedJob.title}</h2>
            </div>
            
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--primary)" /> Role Description</h4>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                    We are looking for a highly motivated {selectedJob.title} to join our core team in the {selectedJob.dept} department.
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Award size={16} color="var(--primary)" /> Key Requirements</h4>
                  <ul style={{ color: 'var(--text-muted)', paddingLeft: '1.1rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <li>3+ years of professional experience in {selectedJob.dept}.</li>
                    <li>Strong proficiency in modern technical stacks.</li>
                    <li>Excellent communication and problem-solving skills.</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <DetailItem icon={<MapPin size={14} />} label="Location" value={selectedJob.location} />
                  <DetailItem icon={<Briefcase size={14} />} label="Type" value={selectedJob.type} />
                  <DetailItem icon={<DollarSign size={14} />} label="Salary" value={(!selectedJob.salary || selectedJob.salary === '-' || selectedJob.salary === 'null') ? 'Competitive' : selectedJob.salary} />
                </div>
                <div style={{ marginTop: 'auto' }}>
                  <Button style={{ width: '100%', padding: '0.85rem' }} onClick={() => { setShowDetails(false); handleApplyClick(selectedJob); }}>
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* AI Screening Loading Overlay */}
      {isScreening && (
        <div style={modalOverlayStyle}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div className="screening-pulse" style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid var(--primary)', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rocket size={40} className="rocket-animate" />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>HireFlow AI is analyzing your profile...</h2>
            <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Matching your skills with our technical requirements.</p>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showForm && (
        <div style={modalOverlayStyle}>
          <Card style={formCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Apply for {appliedJob?.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fill in your professional details to continue.</p>
              </div>
              <button onClick={() => setShowForm(false)} style={closeBtnStyle}><X /></button>
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={formGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    placeholder="Enter your full name"
                    style={{ ...inputStyle, background: 'white' }} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    placeholder="Enter your email"
                    style={{ ...inputStyle, background: 'white' }} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div style={formGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}><Phone size={14} /> Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    required 
                    style={inputStyle} 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}><Award size={14} /> Years of Experience</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 3" 
                    required 
                    style={inputStyle} 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  />
                </div>
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Resume / CV (PDF)</label>
                <div style={uploadBoxStyle}>
                  <input 
                    type="file" 
                    id="resume" 
                    accept=".pdf" 
                    style={{ display: 'none' }} 
                    onChange={(e) => setFormData({...formData, resume: e.target.files[0]})}
                  />
                  <label htmlFor="resume" style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                    <Upload size={32} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
                    <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                      {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF up to 10MB</div>
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <Button variant="outline" type="button" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</Button>
                <Button style={{ flex: 2 }} type="submit" disabled={isApplying}>
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Success/Rejection Modal Overlay */}
      {showSuccess && (
        <div style={modalOverlayStyle}>
          <Card style={{ maxWidth: '500px', width: '100%', padding: '3rem', textAlign: 'center', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ width: '80px', height: '80px', background: screeningStatus === 'PASS' ? '#ecfdf5' : '#fef2f2', color: screeningStatus === 'PASS' ? 'var(--primary)' : '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
              {screeningStatus === 'PASS' ? <CheckCircle size={48} /> : <X size={48} />}
            </div>
            
            <h2 style={{ marginBottom: '1rem' }}>
              {screeningStatus === 'PASS' ? 'Application Received!' : 'Application Update'}
            </h2>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              {screeningStatus === 'PASS' 
                ? `Great news! Your profile is a strong match for ${appliedJob?.title}. We've also sent an invitation link to your email.`
                : `Thank you for your interest in ${appliedJob?.title}. After an AI review, we've decided to move forward with other candidates at this time.`
              }
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {screeningStatus === 'PASS' ? (
                <Button 
                  style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} 
                  onClick={() => {
                    if (!user) navigate(`/auth?mode=signup&email=${formData.email}`);
                    else navigate('/dashboard');
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Complete Signup to Track Status'} <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                </Button>
              ) : (
                <Button style={{ width: '100%', padding: '1rem' }} onClick={() => setShowSuccess(false)}>
                  Back to Job Listings
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      <style>{`
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .job-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08); border-color: var(--primary) !important; }
        .screening-pulse { animation: pulse 2s infinite; }
        .rocket-animate { animation: bounce 1s infinite alternate; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4); } 70% { box-shadow: 0 0 0 30px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); } }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{value}</div>
    </div>
  </div>
);

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
  zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
  animation: 'fadeIn 0.3s'
};

const formCardStyle = { maxWidth: '700px', width: '90%', padding: '3rem', position: 'relative' };
const closeBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' };
const formGridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' };
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid var(--border)', outline: 'none', fontSize: '0.95rem' };
const uploadBoxStyle = { border: '2px dashed var(--border)', borderRadius: '1rem', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f8fafc', transition: 'all 0.2s' };

const JobCard = ({ job, onApply, onViewDetails, isApplying, isApplied, isAdmin, navigate }) => (
  <Card style={{ padding: '2rem', transition: 'all 0.3s', border: '1px solid var(--border)' }} className="job-card">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ background: '#ecfdf5', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '800', padding: '0.3rem 0.75rem', borderRadius: '2rem', textTransform: 'uppercase' }}>{job.dept}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} /> {job.posted}
          </span>
        </div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>{job.title}</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <MapPin size={18} color="var(--primary)" /> {job.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <Briefcase size={18} color="var(--primary)" /> {job.type}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            <DollarSign size={18} color="var(--primary)" /> {(!job.salary || job.salary === '-' || job.salary === 'null') ? 'Competitive' : job.salary}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Button variant="outline" style={{ padding: '0.75rem 1.5rem' }} onClick={onViewDetails}>View Details</Button>
        {isAdmin ? (
          <Button 
            style={{ padding: '0.75rem 2rem', background: '#f8fafc', color: 'var(--text-main)', border: '1px solid var(--border)' }} 
            onClick={() => navigate('/admin')}
          >
            Manage Job
          </Button>
        ) : isApplied ? (
          <Button 
            disabled 
            style={{ padding: '0.75rem 2rem', background: '#ecfdf5', color: 'var(--primary)', border: '1px solid #d1fae5', cursor: 'not-allowed' }}
          >
            <CheckCircle size={16} style={{ marginRight: '0.5rem' }} /> Applied
          </Button>
        ) : (
          <Button style={{ padding: '0.75rem 2rem' }} onClick={onApply} disabled={isApplying}>
            {isApplying ? 'Applying...' : 'Quick Apply'}
          </Button>
        )}
      </div>
    </div>
  </Card>
);

export default JobsPage;
