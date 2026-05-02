import React, { useState, useEffect } from 'react';
import { apiCall, fmtDate, STATUS_COLORS } from './api';
import { Glass, Empty, PageHeader, StatusBadge, Spinner } from './components';

export default function MyTasksPage({ token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCall('/tasks/assigned-to-me', 'GET', null, token)
      .then(d => setTasks(Array.isArray(d) ? d : []))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <PageHeader title="My Tasks 👤" sub="All tasks currently assigned to you" />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
          <Spinner /> <span style={{ marginLeft: 10 }}>Loading your tasks…</span>
        </div>
      ) : tasks.length === 0 ? (
        <Glass><Empty icon="🎉" title="All clear!" sub="You have no tasks assigned to you right now" /></Glass>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map((t, i) => (
            <Glass key={t.id} style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s', animation: `slideUp 0.3s ease ${i * 0.04}s both` }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS_COLORS[t.status] || '#60a5fa', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#1e3a5f', fontSize: 14, marginBottom: 2 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: '#4a7ab5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description || 'No description'}</div>
              </div>
              <StatusBadge status={t.status} />
              <div style={{ fontSize: 11, color: '#60a5fa', flexShrink: 0 }}>📅 {fmtDate(t.dueDate)}</div>
            </Glass>
          ))}
        </div>
      )}
    </div>
  );
}
