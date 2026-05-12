import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Users, Code, Video, ArrowRight, Shield, 
  Zap, Globe, BarChart, MessageSquare, Star, Play,
  ClipboardCheck, UserCheck, Terminal, Rocket
} from 'lucide-react';
import { Button, Card } from '../components/common/UI';

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ background: 'white' }}>
      {/* Navbar */}
      <nav style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)', background: 'white', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', width: '36px', height: '36px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Rocket size={20} />
            </div>
            HireFlow <span style={{ color: 'var(--primary)' }}>AI</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              <Link to="/jobs" style={{ color: 'inherit', textDecoration: 'none' }}>Browse Jobs</Link>
              <a href="#pipeline" style={{ color: 'inherit', textDecoration: 'none' }}>Pipeline</a>
              <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/auth?mode=login">
                <Button variant="outline" style={{ padding: '0.6rem 1.25rem' }}>Login</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button style={{ padding: '0.6rem 1.25rem' }}>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '10rem 0 6rem', textAlign: 'center', background: 'radial-gradient(circle at top, #f0fdf4 0%, #ffffff 60%)' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: '800', marginBottom: '2.5rem', letterSpacing: '0.02em' }}>
            <Zap size={16} /> Integrated Multi-Stage Evaluation System
          </div>
          <h1 style={{ marginBottom: '2rem', maxWidth: '900px', margin: '0 auto 2rem', fontSize: '4.5rem', lineHeight: '1.05', letterSpacing: '-0.03em' }}>
            Automate Hiring from Test to <span style={{ color: 'var(--primary)' }}>Final Interview</span>
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', marginBottom: '3.5rem', maxWidth: '800px', margin: '0 auto 4rem', lineHeight: '1.6' }}>
            Evaluate, Interview, and Hire candidates with AI. HireFlow integrates <strong>MCQ testing</strong>, <strong>AI video interviews</strong>, and <strong>live coding evaluations</strong> into one seamless platform.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link to="/auth?mode=signup" style={{ textDecoration: 'none' }}>
              <Button style={{ fontSize: '1.2rem', padding: '1.25rem 3rem', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.2)' }}>
                Get Started Now <ArrowRight style={{ marginLeft: '0.5rem', display: 'inline' }} size={20} />
              </Button>
            </Link>
            <Link to="/jobs" style={{ textDecoration: 'none' }}>
              <Button variant="outline" style={{ fontSize: '1.2rem', padding: '1.25rem 3rem' }}>
                View Job Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* System Pipeline Section */}
      <section id="pipeline" style={{ padding: '4rem 0 8rem' }}>
        <div className="container">
          <div style={{ background: '#f8fafc', padding: '4rem', borderRadius: '3rem', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, #f8fafc 0%, var(--primary) 50%, #f8fafc 100%)' }}></div>
            <h3 style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.9rem' }}>The Recruitment Flow</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
              <FlowStep icon={<Users />} label="Apply" sub="Portal entry" active />
              <FlowLine />
              <FlowStep icon={<ClipboardCheck />} label="MCQ Test" sub="Auto-screening" active />
              <FlowLine />
              <FlowStep icon={<Video />} label="AI Interview" sub="Soft skills" active />
              <FlowLine />
              <FlowStep icon={<Terminal />} label="Coding" sub="Tech check" active />
              <FlowLine />
              <FlowStep icon={<UserCheck />} label="Hire" sub="Final offer" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '8rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '3rem' }}>Engineered for Precision</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>Our multi-stage system ensures only the top 1% reach your final decision board.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
            <FeatureCard 
              icon={<ClipboardCheck size={40} color="var(--primary)" />}
              title="Smart MCQ Assessment"
              desc="Adaptive question banks that change difficulty based on candidate performance in real-time."
            />
            <FeatureCard 
              icon={<Video size={40} color="#8b5cf6" />}
              title="AI-Powered Interviews"
              desc="Next-gen behavioral analysis using sentiment tracking to evaluate soft skills and confidence."
            />
            <FeatureCard 
              icon={<Terminal size={40} color="#10b981" />}
              title="Live Coding Evaluation"
              desc="Secure, cloud-based environments with real-time performance tracking and plagiarism detection."
            />
            <FeatureCard 
              icon={<Users size={40} color="#f59e0b" />}
              title="Unified Candidate Tracking"
              desc="A central command center for HR to monitor every stage of the candidate lifecycle."
            />
            <FeatureCard 
              icon={<BarChart size={40} color="#06b6d4" />}
              title="Real-Time Scoring"
              desc="Instant calculation of cross-domain scores, combining technical and behavioral data."
            />
            <FeatureCard 
              icon={<Shield size={40} color="#ef4444" />}
              title="Automated Decision System"
              desc="Smart filtering logic that automatically qualifies or rejects candidates based on your specific criteria."
            />
          </div>
        </div>
      </section>

      {/* Live Simulation Section */}
      <section style={{ padding: '12rem 0', background: 'radial-gradient(circle at bottom right, #f0fdf4 0%, #ffffff 70%)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '600px', height: '600px', background: 'var(--primary)', opacity: 0.04, filter: 'blur(120px)', borderRadius: '50%' }}></div>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '6rem', alignItems: 'center' }}>
            <div>
              <div style={{ background: 'linear-gradient(90deg, var(--primary) 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Full Automation</div>
              <h2 style={{ marginBottom: '2rem', fontSize: '3.5rem', lineHeight: '1.1' }}>Watch the <span style={{ color: 'var(--primary)' }}>Hiring Process</span> in Action</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3rem' }}>
                See how candidates move through MCQ tests, AI interviews, and coding evaluations in one seamless system.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FlowStepLabel icon={<ClipboardCheck size={18} />} text="Stage 1: MCQ Assessment" />
                <FlowStepLabel icon={<Video size={18} />} text="Stage 2: AI Interview" />
                <FlowStepLabel icon={<Terminal size={18} />} text="Stage 3: Coding Interview" />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-1.5rem', left: '0', background: 'var(--primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: '800', zIndex: 10 }}>LIVE DEMO</div>
              <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100%', height: '100%', background: '#ecfdf5', borderRadius: '2.5rem', transform: 'rotate(2deg)', zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 1, borderRadius: '2.5rem', overflow: 'hidden', boxShadow: '0 40px 80px -20px rgba(0, 0, 0, 0.25)', transition: 'all 0.5s ease' }} className="flow-image-container">
                <img 
                  src="/hiring-flow.png" 
                  alt="HireFlow Hiring Pipeline"
                  style={{ width: '85%', height: 'auto', display: 'block', margin: '0 auto', animation: 'float 6s ease-in-out infinite' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Advantages */}
      <section id="advantages" style={{ padding: '10rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '3rem' }}>The HireFlow Advantage</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Why top-tier HR teams are moving to integrated AI pipelines.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
            <AdvantageCard 
              title="Architectural Speed"
              text="Our 3-stage evaluation logic cuts down the recruitment cycle from weeks to under 48 hours."
              icon={<Rocket color="var(--primary)" />}
            />
            <AdvantageCard 
              title="Bias-Free Logic"
              text="Standardized AI evaluation ensures every candidate is judged purely on skill and sentiment parity."
              icon={<Shield color="var(--primary)" />}
            />
            <AdvantageCard 
              title="Extreme Scalability"
              text="Process 10,000+ candidates simultaneously without a single drop in evaluation quality."
              icon={<Globe color="var(--primary)" />}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '8rem 0', background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.4" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <StatItem value="3-Stage" label="Evaluation Pipeline" />
            <StatItem value="Automated" label="Candidate Filtering" />
            <StatItem value="Real-Time" label="Performance Analysis" />
            <StatItem value="End-to-End" label="Recruitment Flow" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '10rem 0' }}>
        <div className="container">
          <Card style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '6rem 4rem', textAlign: 'center', border: 'none', borderRadius: '3rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'var(--primary)', opacity: 0.1, filter: 'blur(120px)', borderRadius: '50%' }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: 'white', marginBottom: '2rem', fontSize: '3.5rem' }}>Start Building Your Smart Hiring Pipeline</h2>
              <p style={{ opacity: 0.7, marginBottom: '3.5rem', maxWidth: '700px', margin: '0 auto 3.5rem', fontSize: '1.3rem' }}>
                Join the future of recruitment. Deploy your own automated hiring ecosystem in minutes.
              </p>
              <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <Link to="/auth?mode=signup" style={{ textDecoration: 'none' }}>
                  <Button style={{ padding: '1.25rem 3.5rem', fontSize: '1.25rem' }}>Get Started</Button>
                </Link>
                <Button variant="outline" style={{ padding: '1.25rem 3.5rem', fontSize: '1.25rem', borderColor: 'white', color: 'white' }}>Launch Demo</Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 0', borderTop: '1px solid var(--border)', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'var(--primary)', width: '28px', height: '28px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><Rocket size={16} /></div>
                HireFlow AI
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>The world's most advanced end-to-end AI recruitment pipeline for modern HR teams.</p>
            </div>
            <FooterColumn title="System" links={['MCQ Module', 'AI Interviews', 'Coding Lab', 'Decision Engine']} />
            <FooterColumn title="Company" links={['About', 'Careers', 'Privacy', 'Security']} />
            <FooterColumn title="Social" links={['Twitter', 'LinkedIn', 'Github', 'Status']} />
          </div>
          <div style={{ paddingTop: '2.5rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            © 2026 HireFlow AI. All rights reserved. Precision recruitment for the AI era.
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .flow-image-container:hover { transform: scale(1.02); }
      `}</style>
      {/* Footer */}
      <footer style={{ padding: '6rem 0', background: 'white', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '4rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Rocket size={18} />
                </div>
                HireFlow <span style={{ color: 'var(--primary)' }}>AI</span>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>The future of intelligent hiring. Automate your recruitment pipeline from test to final selection.</p>
            </div>
            <div>
              <h5 style={{ marginBottom: '1.5rem' }}>Platform</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Link to="/jobs" style={{ color: 'inherit', textDecoration: 'none' }}>Browse Jobs</Link>
                <a href="#pipeline" style={{ color: 'inherit', textDecoration: 'none' }}>Pipeline</a>
                <a href="#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '1.5rem' }}>Employer</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <Link to="/auth?mode=login" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '700', color: 'var(--primary)' }}>Admin Portal Access</Link>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Post a Job</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Enterprise Solutions</a>
              </div>
            </div>
            <div>
              <h5 style={{ marginBottom: '1.5rem' }}>Company</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            &copy; 2026 HireFlow AI. All rights reserved. Professional Recruitment Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};

/* Components */

const FlowStep = ({ icon, label, sub, active }) => (
  <div style={{ textAlign: 'center', flex: 1, zIndex: 2 }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: active ? 'white' : '#f1f5f9', border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`, color: active ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: active ? '0 10px 20px rgba(16, 185, 129, 0.1)' : 'none' }}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{label}</div>
    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sub}</div>
  </div>
);

const FlowLine = () => (
  <div style={{ flex: 1, height: '2px', background: 'var(--border)', marginTop: '-2rem', margin: '0 1rem', position: 'relative', zIndex: 1 }}></div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <Card style={{ padding: '3rem', border: '1px solid #f1f5f9', transition: 'all 0.3s' }} className="feature-card">
    <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
    <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{desc}</p>
  </Card>
);

const AdvantageCard = ({ title, text, icon }) => (
  <Card style={{ padding: '2.5rem', textAlign: 'center', border: '1px solid #f1f5f9' }}>
    <div style={{ width: '50px', height: '50px', background: '#ecfdf5', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{title}</h4>
    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{text}</p>
  </Card>
);

const StatItem = ({ value, label }) => (
  <div>
    <div style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>{value}</div>
    <div style={{ fontSize: '1.1rem', fontWeight: '600', opacity: 0.8 }}>{label}</div>
  </div>
);

const FeatureItem = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-main)' }}>
    <div style={{ color: 'var(--primary)' }}>{icon}</div>
    {text}
  </div>
);

const FlowStepLabel = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
    {icon} {text}
  </div>
);

const FooterColumn = ({ title, links }) => (
  <div>
    <h5 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>{title}</h5>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {links.map(link => (
        <li key={link} style={{ marginBottom: '0.75rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.95rem' }}>{link}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default LandingPage;
