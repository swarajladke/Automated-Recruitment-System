import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Rocket, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardNavbar = ({ userName, userId, isFluid = false, status }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Your resume has been successfully screened!", time: "2m ago" },
    { id: 2, text: status === 'REJECTED' ? "Application status update available." : "New assessment stage unlocked!", time: "1h ago" }
  ];

  return (
    <nav style={{ background: 'white', padding: '0.75rem 0', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div 
        className={isFluid ? '' : 'container'} 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: isFluid ? '0 3rem' : '' 
        }}
      >
        <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Rocket size={18} />
          </div>
          HireFlow <span style={{ color: 'var(--primary)' }}>AI</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Notifications - Only for logged in users */}
          {logout && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', position: 'relative', cursor: 'pointer', padding: '0.5rem' }}
              >
                <Bell size={20} />
                <span style={{ position: 'absolute', top: 5, right: 5, background: '#ef4444', width: '8px', height: '8px', borderRadius: '50%', border: '2px solid white' }}></span>
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: '100%', right: 0, width: '300px', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', marginTop: '0.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '700', fontSize: '0.9rem' }}>Notifications</div>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <div style={{ marginBottom: '0.2rem' }}>{n.text}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{n.time}</div>
                    </div>
                  ))}
                  <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', cursor: 'pointer' }}>View All</div>
                </div>
              )}
            </div>
          )}

          {logout && <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>}

          {/* User Menu / Sign In */}
          <div style={{ position: 'relative' }}>
            {userName !== "Guest" ? (
              <>
                <div 
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', transition: 'transform 0.2s' }}>
                    {userName.charAt(0)}
                  </div>
                </div>

                {showUserMenu && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, width: '200px', background: 'white', border: '1px solid var(--border)', borderRadius: '1rem', marginTop: '0.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>My Profile</div>
                    </div>
                    <div 
                      onClick={() => { logout(); navigate('/'); }}
                      style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#ef4444', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={16} />
                      <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>Sign Out</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button 
                onClick={() => navigate('/auth?mode=login')}
                style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
