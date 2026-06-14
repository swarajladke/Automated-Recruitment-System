import React from 'react';
import { FileText, TrendingUp, XCircle, Clock } from 'lucide-react';
import { Card, Button } from '../common/UI';

export const AssessmentTile = ({ title, description, icon, status, isActive, isDone, onAction }) => (
  <Card style={{ padding: '1.5rem', opacity: isActive || isDone ? 1 : 0.6, border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
    <div style={{ marginBottom: '1rem', background: '#f8fafc', width: '45px', height: '45px', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <h5 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>{title}</h5>
    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.4' }}>{description}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
      <span style={{ 
        fontSize: '0.65rem', 
        fontWeight: '800', 
        textTransform: 'uppercase', 
        color: isDone ? '#10b981' : isActive ? 'var(--primary)' : '#94a3b8' 
      }}>
        {status === 'Locked' ? 'Available after MCQ completion' : status}
      </span>
      <Button 
        onClick={onAction} 
        disabled={!isActive && !isDone} 
        style={{ 
          padding: '0.4rem 0.75rem', 
          fontSize: '0.75rem', 
          borderRadius: '0.5rem',
          background: isDone ? '#ecfdf5' : '',
          color: isDone ? '#059669' : '',
          border: isDone ? '1px solid #d1fae5' : ''
        }}
        variant={isActive ? 'primary' : 'outline'}
      >
        {isDone ? 'View Score' : isActive ? 'Start Now' : 'Locked'}
      </Button>
    </div>
  </Card>
);

export const StatusBanner = ({ status, resumeInsight }) => {
  const isRejected = status === 'REJECTED';
  const getBannerContent = () => {
    if (isRejected && resumeInsight?.match_score < 60) {
      return resumeInsight.summary || "Your application did not meet the automated screening criteria for this role.";
    }
    switch(status) {
      case 'APPLIED': return "Next Step: Complete the MCQ assessment to unlock the AI interview stage.";
      case 'MCQ_CLEARED': return "Great job! You've cleared the MCQ. Please schedule your AI Interview.";
      case 'AI_CLEARED': return "The coding interview stage is being coordinated. Stand by for details.";
      case 'CODING_CLEARED': return "Pending HR Review - Waiting for final selection decision.";
      case 'SELECTED': return "Congratulations! You've received an offer. Check your email.";
      case 'REJECTED': return "Thank you for your time. We've decided to move forward with other candidates.";
      default: return "";
    }
  };

  return (
    <Card style={{ 
      padding: '1.5rem', 
      background: isRejected ? '#fef2f2' : '#f0f9ff',
      border: `1px solid ${isRejected ? '#fecaca' : '#bae6fd'}`,
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    }}>
      <div style={{ background: isRejected ? '#fee2e2' : '#dbeafe', padding: '0.75rem', borderRadius: '0.5rem' }}>
        {isRejected ? <XCircle color="#ef4444" /> : <Clock color="#3b82f6" />}
      </div>
      <div>
        <h5 style={{ color: isRejected ? '#991b1b' : '#1e3a8a', marginBottom: '0.25rem' }}>
          {isRejected ? 'Application Update' : 'Next Step'}
        </h5>
        <p style={{ fontSize: '0.9rem', color: isRejected ? '#b91c1c' : '#1d4ed8', lineHeight: 1.4 }}>
          {getBannerContent()}
        </p>
      </div>
    </Card>
  );
};
