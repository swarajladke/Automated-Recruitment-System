import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

export const TimelineStepper = ({ stages, currentStageIndex, isRejected }) => {
  return (
    <div className="card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '1rem' }}>
        {stages.map((stage, index) => (
          <div key={stage} style={{ flex: 1, textAlign: 'center', zIndex: 1 }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: isRejected && index <= currentStageIndex ? '#fee2e2' : index <= currentStageIndex ? '#2563eb' : 'white',
              border: `2px solid ${isRejected && index <= currentStageIndex ? '#ef4444' : index <= currentStageIndex ? '#2563eb' : '#e2e8f0'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: index <= currentStageIndex ? 'white' : '#94a3b8',
              transition: 'all 0.3s ease'
            }}>
              {isRejected && index === currentStageIndex ? <XCircle size={18} /> : index < currentStageIndex ? <CheckCircle size={18} /> : index + 1}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: index <= currentStageIndex ? '700' : '500', color: index <= currentStageIndex ? 'var(--text-main)' : 'var(--text-muted)' }}>
              {stage}
            </span>
          </div>
        ))}
        {/* Connector Line */}
        <div style={{ position: 'absolute', top: '18px', left: '10%', right: '10%', height: '2px', background: '#e2e8f0', zIndex: 0 }}>
          <div style={{ width: `${(Math.max(0, currentStageIndex) / (stages.length - 1)) * 100}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
        </div>
      </div>
    </div>
  );
};

export const ScoreAnalytics = ({ scores }) => (
  <div className="card" style={{ padding: '1.5rem' }}>
    <h4 style={{ marginBottom: '1.25rem' }}>Performance Analytics</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ScoreBar label="MCQ Score" score={scores.mcq} color="#3b82f6" />
      <ScoreBar label="AI Interview" score={scores.ai} color="#8b5cf6" />
      <ScoreBar label="Coding Interview" score={scores.coding} color="#10b981" />
    </div>
  </div>
);

const ScoreBar = ({ label, score, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
      <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
      <span style={{ fontWeight: '700' }}>{score > 0 ? `${score}%` : 'Not Attempted'}</span>
    </div>
    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ width: `${score}%`, height: '100%', background: color, transition: 'width 1s ease' }}></div>
    </div>
  </div>
);
