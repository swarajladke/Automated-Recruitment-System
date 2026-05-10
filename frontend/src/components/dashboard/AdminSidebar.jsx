import React from 'react';
import { LayoutDashboard, Users, PieChart, Settings, LogOut, Search, Shield, MessageSquare, Briefcase } from 'lucide-react';
import { Card } from '../common/UI';

const AdminSidebar = ({ onLogout, activeView, onViewChange }) => {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '260px' }}>
      <Card style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', border: 'none' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1rem', marginBottom: '1rem', display: 'inline-block' }}>
          <Shield size={32} color="#60a5fa" />
        </div>
        <h4 style={{ color: 'white', marginBottom: '0.25rem' }}>Admin Panel</h4>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Recruitment Controller</p>
      </Card>

      <Card style={{ padding: '1.25rem', flex: 1 }}>
        <h5 style={{ marginBottom: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Main Menu</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <AdminMenuButton 
            icon={<LayoutDashboard size={18} />} 
            label="Overview" 
            active={activeView === 'overview'} 
            onClick={() => onViewChange('overview')}
          />
          <AdminMenuButton 
            icon={<MessageSquare size={18} />} 
            label="Messages" 
            active={activeView === 'messages'} 
            onClick={() => onViewChange('messages')}
          />
          <AdminMenuButton 
            icon={<Users size={18} />} 
            label="Candidates" 
            active={activeView === 'candidates'} 
            onClick={() => onViewChange('candidates')}
          />
          <AdminMenuButton 
            icon={<PieChart size={18} />} 
            label="MCQ Manager" 
            active={activeView === 'mcq_manager'}
            onClick={() => onViewChange('mcq_manager')}
          />
          <AdminMenuButton 
            icon={<Briefcase size={18} />} 
            label="Job Manager" 
            active={activeView === 'job_manager'}
            onClick={() => onViewChange('job_manager')}
          />
          <AdminMenuButton 
            icon={<PieChart size={18} />} 
            label="Hiring Reports" 
            active={activeView === 'reports'}
            onClick={() => onViewChange('reports')}
          />
          <AdminMenuButton 
            icon={<Settings size={18} />} 
            label="System Settings" 
            active={activeView === 'settings'}
            onClick={() => onViewChange('settings')}
          />
          
          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <div style={{ margin: '0.5rem 0', height: '1px', background: 'var(--border)' }}></div>
            <button 
              onClick={onLogout}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                padding: '0.75rem', 
                borderRadius: '0.5rem', 
                border: 'none', 
                background: 'none', 
                color: '#ef4444', 
                fontWeight: '600', 
                width: '100%', 
                textAlign: 'left',
                cursor: 'pointer' 
              }}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </Card>
    </aside>
  );
};

const AdminMenuButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem', 
      borderRadius: '0.5rem', 
      border: 'none', 
      background: active ? '#eff6ff' : 'none', 
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? '700' : '500',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer'
    }}
  >
    {icon} {label}
  </button>
);

export default AdminSidebar;
