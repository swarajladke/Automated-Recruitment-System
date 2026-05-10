import React from 'react';

export const Card = ({ children, style, className = '' }) => (
  <div 
    className={`card ${className}`} 
    style={{ ...style }}
  >
    {children}
  </div>
);

export const Button = ({ children, onClick, type = 'button', variant = 'primary', style, disabled }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-outline';
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={className} 
      style={{ ...style }}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const Spinner = () => (
  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '1rem' }}>
    <div className="spinner" style={{ 
      width: '40px', 
      height: '40px', 
      border: '4px solid #f3f3f3', 
      borderTop: '4px solid var(--primary)', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite' 
    }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);
