

// import React, { useState, useEffect } from 'react';
// import { apiCall, fmtDate, STATUS_COLORS } from './api';
// import { Glass, Empty, PageHeader, StatusBadge, Spinner } from './components';

// export default function MyTasksPage({ token }) {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { loadTasks(); }, [token]);

//   async function loadTasks() {
//     try {
//       const d = await apiCall('/tasks/assigned-to-me', 'GET', null, token);
//       setTasks(Array.isArray(d) ? d : []);
//     } catch {
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function toggleTaskStatus(task) {
//     const statusCycle = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
//     const current = task.status;
//     const nextStatus = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];

//     try {
//       await apiCall(`/tasks/${task.id}`, 'PUT', {
//         title: task.title,
//         description: task.description || '',
//         assignedToUserId: task.assignedToUserId,
//         dueDate: task.dueDate || null,
//         status: nextStatus,
//       }, token);
//       loadTasks();
//     } catch (e) {
//       alert('Failed to update: ' + e.message);
//     }
//   }

//   return (
//     <div style={{ animation: 'slideUp 0.4s ease' }}>
//       <PageHeader title="My Tasks 👤" sub="All tasks currently assigned to you" />

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
//           <Spinner /> <span style={{ marginLeft: 10 }}>Loading your tasks…</span>
//         </div>
//       ) : tasks.length === 0 ? (
//         <Glass>
//           <Empty icon="🎉" title="All clear!" sub="You have no tasks assigned to you right now" />
//         </Glass>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {tasks.map((t, i) => (
//             <Glass
//               key={t.id}
//               style={{
//                 padding: '18px 20px',
//                 transition: 'all 0.2s',
//                 animation: `slideUp 0.3s ease ${i * 0.04}s both`,
//               }}
//               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//             >
//               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
//                 <div style={{
//                   width: 10, height: 10, borderRadius: '50%',
//                   background: STATUS_COLORS[t.status] || '#60a5fa',
//                   flexShrink: 0,
//                   marginTop: 3,
//                 }} />

//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <div style={{ fontWeight: 600, color: '#1e3a5f', fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>
//                     {t.title}
//                   </div>
//                   <div style={{ fontSize: 12, color: '#4a7ab5', lineHeight: 1.4, marginBottom: 2 }}>
//                     {t.description || 'No description'}
//                     {t.assignedToUserName && (
//                       <span style={{ marginLeft: 6, color: '#7dd3fc', fontWeight: 500 }}>· 👤 {t.assignedToUserName}</span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                   <StatusBadge status={t.status} />
//                   <div style={{
//                     fontSize: 11,
//                     color: t.isOverdue ? '#ef4444' : '#64748b',
//                     fontWeight: t.isOverdue ? 600 : 400,
//                   }}>
//                     📅 {fmtDate(t.dueDate)}{t.isOverdue && ' ⚠️'}
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => toggleTaskStatus(t)}
//                   style={{
//                     padding: '6px 12px',
//                     borderRadius: 8,
//                     border: '1px solid rgba(59,130,246,0.3)',
//                     background: 'rgba(59,130,246,0.1)',
//                     color: '#3b82f6',
//                     cursor: 'pointer',
//                     fontSize: 11,
//                     fontWeight: 600,
//                     transition: 'all 0.2s',
//                     flexShrink: 0,
//                     fontFamily: "'Inter', sans-serif",
//                   }}
//                   onMouseEnter={e => {
//                     e.target.style.background = 'rgba(59,130,246,0.2)';
//                     e.target.style.transform = 'scale(1.02)';
//                   }}
//                   onMouseLeave={e => {
//                     e.target.style.background = 'rgba(59,130,246,0.1)';
//                     e.target.style.transform = 'scale(1)';
//                   }}
//                 >
//                   {t.status === 'TODO'
//                     ? '▶️ Start'
//                     : t.status === 'IN_PROGRESS'
//                     ? '✅ Done'
//                     : '🔁 Reopen'}
//                 </button>
//               </div>
//             </Glass>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { apiCall, fmtDate, STATUS_COLORS } from './api';
// import { Glass, Empty, PageHeader, StatusBadge, Spinner } from './components';

// export default function MyTasksPage({ token }) {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { loadTasks(); }, [token]);

//   async function loadTasks() {
//     try {
//       const d = await apiCall('/tasks/assigned-to-me', 'GET', null, token);
//       setTasks(Array.isArray(d) ? d : []);
//     } catch {
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function toggleTaskStatus(task) {
//     const statusCycle = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
//     const current = task.status;
//     const nextStatus = statusCycle[(statusCycle.indexOf(current) + 1) % statusCycle.length];

//     try {
//       await apiCall(`/tasks/${task.id}`, 'PUT', {
//         title: task.title,
//         description: task.description || '',
//         assignedToUserId: task.assignedToUserId,
//         dueDate: task.dueDate || null,
//         status: nextStatus,
//       }, token);
//       loadTasks();
//     } catch (e) {
//       alert('Failed to update: ' + e.message);
//     }
//   }

//   return (
//     <div style={{ animation: 'slideUp 0.4s ease' }}>
//       <PageHeader title="My Tasks 👤" sub="All tasks currently assigned to you" />

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
//           <Spinner /> <span style={{ marginLeft: 10 }}>Loading your tasks…</span>
//         </div>
//       ) : tasks.length === 0 ? (
//         <Glass>
//           <Empty icon="🎉" title="All clear!" sub="You have no tasks assigned to you right now" />
//         </Glass>
//       ) : (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           {tasks.map((t, i) => (
//             <Glass
//               key={t.id}
//               style={{
//                 padding: '22px 22px 18px',
//                 transition: 'all 0.2s',
//                 animation: `slideUp 0.3s ease ${i * 0.04}s both`,
//               }}
//               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
//               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//             >
//               <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
//                 <div style={{ flex: 1, minWidth: 0, minHeight: 60 }}>
//                   <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 15, marginBottom: 6, lineHeight: 1.35 }}>{t.title}</div>
//                   <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>{t.description || 'No description'}</div>
//                 </div>

//                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 140 }}>
//                   <StatusBadge status={t.status} />
//                   <div style={{ fontSize: 12, color: t.isOverdue ? '#b91c1c' : '#475569', fontWeight: t.isOverdue ? 700 : 500, textAlign: 'right' }}>
//                     📅 {fmtDate(t.dueDate)}{t.isOverdue ? ' ⚠️' : ''}
//                   </div>
//                 </div>
//               </div>

//               <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
//                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', color: '#2563eb', fontSize: 12 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'rgba(37,99,235,0.08)' }}>
//                     👤 {t.assignedToUserName || 'Unassigned'}
//                   </div>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'rgba(148,163,184,0.12)', color: '#475569' }}>
//                     {t.status === 'TODO' ? 'To Do' : t.status === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
//                   </div>
//                 </div>

//                 <button
//                   onClick={() => toggleTaskStatus(t)}
//                   style={{
//                     padding: '8px 14px',
//                     borderRadius: 10,
//                     border: '1px solid rgba(59,130,246,0.3)',
//                     background: 'rgba(59,130,246,0.1)',
//                     color: '#3b82f6',
//                     cursor: 'pointer',
//                     fontSize: 12,
//                     fontWeight: 600,
//                     transition: 'all 0.2s',
//                     flexShrink: 0,
//                     fontFamily: "'Inter', sans-serif",
//                   }}
//                   onMouseEnter={e => {
//                     e.target.style.background = 'rgba(59,130,246,0.2)';
//                     e.target.style.transform = 'scale(1.02)';
//                   }}
//                   onMouseLeave={e => {
//                     e.target.style.background = 'rgba(59,130,246,0.1)';
//                     e.target.style.transform = 'scale(1)';
//                   }}
//                 >
//                   {t.status === 'TODO'
//                     ? '▶️ Start'
//                     : t.status === 'IN_PROGRESS'
//                     ? '✅ Done'
//                     : '🔁 Reopen'}
//                 </button>
//               </div>
//             </Glass>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { apiCall, fmtDate, STATUS_COLORS } from './api';
import { Glass, Empty, PageHeader, StatusBadge, Spinner } from './components';

export default function MyTasksPage({ token }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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
    setUpdatingId(task.id);
    try {
      await apiCall(`/tasks/${task.id}`, 'PUT', {
        title: task.title,
        description: task.description || '',
        assignedToUserId: task.assignedToUserId,
        dueDate: task.dueDate || null,
        status: nextStatus,
      }, token);
      await loadTasks();
    } catch (e) {
      alert('Failed to update: ' + e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const btnLabel = (status) => {
    if (status === 'TODO') return '▶️ Start Task';
    if (status === 'IN_PROGRESS') return '✅ Mark Done';
    return '🔁 Reopen';
  };

  const btnColor = (status) => {
    if (status === 'TODO') return { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.4)', color: '#2563eb' };
    if (status === 'IN_PROGRESS') return { bg: 'rgba(52,211,153,0.15)', border: 'rgba(52,211,153,0.4)', color: '#059669' };
    return { bg: 'rgba(251,191,36,0.15)', border: 'rgba(251,191,36,0.4)', color: '#d97706' };
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease', padding: '0 4px' }}>
      <PageHeader title="My Tasks 👤" sub="All tasks currently assigned to you" />

      {/* Summary bar */}
      {tasks.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', count: tasks.length, color: '#3b82f6' },
            { label: 'To Do', count: tasks.filter(t => t.status === 'TODO').length, color: '#60a5fa' },
            { label: 'In Progress', count: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#fbbf24' },
            { label: 'Done', count: tasks.filter(t => t.status === 'COMPLETED').length, color: '#34d399' },
          ].map((s, i) => (
            <div key={i} style={{
              flex: '1 1 60px',
              background: 'rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: 14,
              padding: '10px 14px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Syne', sans-serif" }}>{s.count}</div>
              <div style={{ fontSize: 11, color: '#4a7ab5', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
          <Spinner /> <span style={{ marginLeft: 10 }}>Loading your tasks…</span>
        </div>
      ) : tasks.length === 0 ? (
        <Glass>
          <Empty icon="🎉" title="All clear!" sub="You have no tasks assigned to you right now" />
        </Glass>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.map((t, i) => {
            const colors = btnColor(t.status);
            const isUpdating = updatingId === t.id;
            return (
              <Glass
                key={t.id}
                style={{
                  padding: '18px 20px',
                  borderRadius: 18,
                  animation: `slideUp 0.3s ease ${i * 0.05}s both`,
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {/* Top row: dot + title + badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: STATUS_COLORS[t.status] || '#60a5fa',
                    flexShrink: 0, marginTop: 5,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 700, color: '#1e3a5f', fontSize: 16,
                      lineHeight: 1.4, wordBreak: 'break-word',
                      fontFamily: "'Syne', sans-serif",
                    }}>
                      {t.title}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <StatusBadge status={t.status} />
                  </div>
                </div>

                {/* Description */}
                {t.description && (
                  <div style={{
                    fontSize: 13, color: '#4a7ab5', lineHeight: 1.6,
                    marginBottom: 12, marginLeft: 22,
                    wordBreak: 'break-word',
                  }}>
                    {t.description}
                  </div>
                )}

                {/* Meta: assigned name + due date */}
                <div style={{
                  display: 'flex', gap: 8, flexWrap: 'wrap',
                  marginBottom: 14, marginLeft: 22,
                }}>
                  {t.assignedToUserName && (
                    <div style={{
                      fontSize: 12, color: '#2d5a8e', fontWeight: 500,
                      background: 'rgba(59,130,246,0.1)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      borderRadius: 20, padding: '4px 12px',
                    }}>
                      👤 {t.assignedToUserName}
                    </div>
                  )}
                  <div style={{
                    fontSize: 12,
                    color: t.isOverdue ? '#ef4444' : '#4a7ab5',
                    fontWeight: t.isOverdue ? 600 : 400,
                    background: t.isOverdue ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
                    border: `1px solid ${t.isOverdue ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.2)'}`,
                    borderRadius: 20, padding: '4px 12px',
                  }}>
                    📅 {fmtDate(t.dueDate)}{t.isOverdue ? ' ⚠️ Overdue' : ''}
                  </div>
                </div>

                {/* Full-width action button */}
                <div style={{ marginLeft: 22 }}>
                  <button
                    onClick={() => toggleTaskStatus(t)}
                    disabled={isUpdating}
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: 12,
                      border: `1px solid ${colors.border}`,
                      background: colors.bg,
                      color: colors.color,
                      cursor: isUpdating ? 'not-allowed' : 'pointer',
                      fontSize: 14,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      fontFamily: "'DM Sans', sans-serif",
                      opacity: isUpdating ? 0.6 : 1,
                    }}
                    onMouseEnter={e => { if (!isUpdating) e.currentTarget.style.opacity = '0.8'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = isUpdating ? '0.6' : '1'; }}
                  >
                    {isUpdating ? '⏳ Updating…' : btnLabel(t.status)}
                  </button>
                </div>
              </Glass>
            );
          })}
        </div>
      )}
    </div>
  );
}