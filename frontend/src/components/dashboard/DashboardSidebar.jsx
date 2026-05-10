import React from 'react';
import { User, Briefcase, FileText, Calendar, LogOut } from 'lucide-react';
import { Card } from '../common/UI';

const DashboardSidebar = ({ userName, onLogout, completion = 85, onMenuClick }) => {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Card style={{ padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <User size={40} color="var(--primary)" />
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#22c55e', width: '20px', height: '20px', borderRadius: '50%', border: '3px solid white' }}></div>
        </div>
        <h4 style={{ marginBottom: '0.25rem' }}>{userName}</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Active Candidate</p>
        
        <div style={{ textAlign: 'left', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Profile Completion</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${completion}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700' }}>{completion}%</span>
          </div>
        </div>
      </Card>

      <Card style={{ padding: '1.25rem' }}>
        <h5 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <MenuButton icon={<Briefcase size={18} />} label="My Applications" active onClick={() => onMenuClick('applications')} />
          <MenuButton icon={<FileText size={18} />} label="Resume / CV" onClick={() => onMenuClick('resume')} />
          <MenuButton icon={<Calendar size={18} />} label="Schedule" onClick={() => onMenuClick('schedule')} />
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
      </Card>
    </aside>
  );
};

const MenuButton = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem', 
      padding: '0.75rem', 
      borderRadius: '0.5rem', 
      border: 'none', 
      background: active ? '#ecfdf5' : 'none', 
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? '700' : '500',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => !active && (e.currentTarget.style.background = '#f8fafc')}
    onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'none')}
  >
    {icon} {label}
  </button>
);

export default DashboardSidebar;
