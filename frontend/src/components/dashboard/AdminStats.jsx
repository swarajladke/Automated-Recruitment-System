import React from 'react';
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../common/UI';

const AdminStats = ({ stats }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
      <StatCard 
        title="Total Applications" 
        value={stats.total} 
        color="#2563eb" 
        icon={<Users size={24} />} 
        trend="+12% this week"
      />
      <StatCard 
        title="Selected" 
        value={stats.selected} 
        color="#10b981" 
        icon={<CheckCircle size={24} />} 
        trend="8% conversion"
      />
      <StatCard 
        title="Rejected" 
        value={stats.rejected} 
        color="#ef4444" 
        icon={<XCircle size={24} />} 
        trend="Manual review"
      />
      <StatCard 
        title="In Progress" 
        value={stats.inProcess} 
        color="#f59e0b" 
        icon={<Clock size={24} />} 
        trend="Awaiting action"
      />
    </div>
  );
};

const StatCard = ({ title, value, color, icon, trend }) => (
  <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ background: `${color}15`, color: color, padding: '0.75rem', borderRadius: '0.75rem' }}>
        {icon}
      </div>
      <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8' }}>Live</span>
    </div>
    <div style={{ marginTop: '0.5rem' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-muted)' }}>{title}</div>
    </div>
    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: color, fontWeight: '600' }}>
      {trend}
    </div>
  </Card>
);

export default AdminStats;
