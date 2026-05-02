

import React, { useState, useEffect } from 'react';
import { apiCall, fmtDate, STATUS_COLORS } from './api';
import { Glass, Empty, PageHeader, StatusBadge, Spinner } from './components';

export default function MyTasksPage({ token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTasks(); }, [token]);

  async function loadTasks() {
    try {
      const d = await apiCall('/tasks/assigned-to-me', 'GET', null, token);
      setTasks(Array.isArray(d) ? d : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }

  async function toggleTaskStatus(task) {
    const statusCycle = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    const current = task.status;
    const nextStatus = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];

    try {
      await apiCall(`/tasks/${task.id}`, 'PUT', {
        title: task.title,
        description: task.description || '',
        assignedToUserId: task.assignedToUserId,
        dueDate: task.dueDate || null,
        status: nextStatus,
      }, token);
      loadTasks();
    } catch (e) {
      alert('Failed to update: ' + e.message);
    }
  }

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <PageHeader title="My Tasks 👤" sub="All tasks currently assigned to you" />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
          <Spinner /> <span style={{ marginLeft: 10 }}>Loading your tasks…</span>
        </div>
      ) : tasks.length === 0 ? (
        <Glass>
          <Empty icon="🎉" title="All clear!" sub="You have no tasks assigned to you right now" />
        </Glass>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map((t, i) => (
            <Glass
              key={t.id}
              style={{
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.2s',
                animation: `slideUp 0.3s ease ${i * 0.04}s both`,
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
            >
              {/* Status dot */}
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: STATUS_COLORS[t.status] || '#60a5fa',
                flexShrink: 0,
              }} />

              {/* Task info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#1e3a5f', fontSize: 15, marginBottom: 4 }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 13, color: '#4a7ab5', marginBottom: 4, lineHeight: 1.4 }}>
                  {t.description || 'No description'}
                  {t.assignedToUserName && (
                    <span style={{ marginLeft: 8, color: '#7dd3fc' }}>· 👤 {t.assignedToUserName}</span>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <StatusBadge status={t.status} />

              {/* Due date */}
              <div style={{
                fontSize: 12,
                color: t.isOverdue ? '#ef4444' : '#60a5fa',
                flexShrink: 0,
                fontWeight: t.isOverdue ? 600 : 400,
                marginLeft: 8,
              }}>
                📅 {fmtDate(t.dueDate)}{t.isOverdue && ' ⚠️'}
              </div>

              {/* Toggle status button */}
              <button
                onClick={() => toggleTaskStatus(t)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid rgba(59,130,246,0.3)',
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  marginLeft: 8,
                }}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(59,130,246,0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'rgba(59,130,246,0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {t.status === 'TODO'
                  ? '▶️ Start'
                  : t.status === 'IN_PROGRESS'
                  ? '✅ Done'
                  : '🔁 Reopen'}
              </button>
            </Glass>
          ))}
        </div>
      )}
    </div>
  );
}