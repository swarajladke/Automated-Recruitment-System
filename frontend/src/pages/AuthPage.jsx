import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/common/UI';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(searchParams.get('mode') !== 'signup');
    
    // 1. Pre-fill from URL (Invitation Link)
    const urlEmail = searchParams.get('email');
    if (urlEmail) {
      setFormData(prev => ({ ...prev, email: urlEmail }));
    }
    
    // 2. Identity Bridge: Pre-fill from pending application (Fallback)
    const pendingApp = sessionStorage.getItem('pending_application');
    if (pendingApp && searchParams.get('mode') === 'signup') {
      const data = JSON.parse(pendingApp);
      setFormData(prev => ({ ...prev, name: data.name || '', email: data.email || prev.email }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        const res = await authService.login(formData);
        login(res.data);
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        await authService.register(formData);
        setIsLogin(true);
        navigate('/auth?mode=login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check if the backend is running.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '2rem' }}>
      <Card style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <ArrowLeft size={16} /> Back to home
        </button>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.4rem', borderRadius: '0.75rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => { setIsAdminMode(false); setIsLogin(true); }}
            style={{ 
              flex: 1, padding: '0.6rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700',
              background: !isAdminMode ? 'white' : 'transparent',
              color: !isAdminMode ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: !isAdminMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Candidate
          </button>
          <button 
            onClick={() => { setIsAdminMode(true); setIsLogin(true); }}
            style={{ 
              flex: 1, padding: '0.6rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700',
              background: isAdminMode ? 'white' : 'transparent',
              color: isAdminMode ? 'var(--text-main)' : 'var(--text-muted)',
              boxShadow: isAdminMode ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Recruiter
          </button>
        </div>
        
        <h2 style={{ marginBottom: '0.5rem' }}>
          {isAdminMode ? 'Recruiter Access' : isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isAdminMode 
            ? 'Sign in to the HireFlow Command Center' 
            : isLogin 
              ? 'Enter your credentials to access your dashboard' 
              : 'Join us and start your recruitment journey'}
        </p>

        {error && <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid #fecaca' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required 
                placeholder="you@example.com"
                value={formData.email}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', outline: 'none' }} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <Button type="submit" style={{ width: '100%', marginBottom: '1.5rem' }}>
            {isAdminMode ? 'Admin Sign In' : isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {!isAdminMode && (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => navigate(isLogin ? '/auth?mode=signup' : '/auth?mode=login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600' }}
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        )}
        
        {isAdminMode && (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Authorized HR personnel only. <br/>
            Contact system admin for access recovery.
          </p>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
