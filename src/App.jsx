import React, { useState, useEffect, useCallback } from 'react';
import { apiCall } from './api';
import { BgOrbs } from './components';
import AuthPage from './AuthPage';
import DashboardPage from './DashboardPage';
import ProjectsPage from './ProjectsPage';
import TasksPage from './TasksPage';
import MyTasksPage from './MyTasksPage';

const NAV = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'projects',  label: 'Projects' },
  { id: 'tasks',     label: 'Tasks' },
  { id: 'mytasks',   label: 'My Tasks' },
];

export default function App() {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ph_auth') || 'null'); } catch { return null; }
  });
  const [page, setPage] = useState('dashboard');
  const [projects, setProjects] = useState([]);

  const loadProjects = useCallback(async () => {
    if (!auth?.token) return;
    try { const d = await apiCall('/projects', 'GET', null, auth.token); setProjects(Array.isArray(d) ? d : []); }
    catch { setProjects([]); }
  }, [auth]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  function handleLogin(data) {
    localStorage.setItem('ph_auth', JSON.stringify(data));
    setAuth(data);
  }

  function handleLogout() {
    localStorage.removeItem('ph_auth');
    setAuth(null);
    setProjects([]);
  }

  if (!auth) return <AuthPage onLogin={handleLogin} />;

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <BgOrbs />
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        {/* Sidebar */}
        <div style={{
          width: 280, minHeight: '100vh', padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 8,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(249,115,22,0.18)', boxShadow: '8px 0 40px rgba(248,113,64,0.08)', flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: '12px 16px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 12, background: 'linear-gradient(135deg,#fb923c,#f97316)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em' }}>
              TT
            </div>
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#111827' }}>
                Team<span style={{ color: '#fb923c' }}>Track</span>
              </div>
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.18em', marginTop: 2 }}>
                Team workflow
              </div>
            </div>
          </div>

          {/* Nav items */}
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
              borderRadius: 18, cursor: 'pointer', transition: 'all 0.25s',
              color: page === n.id ? '#111827' : '#475569',
              fontWeight: page === n.id ? 700 : 600, fontSize: 15,
              border: '1px solid rgba(15,23,42,0.06)', fontFamily: "'Inter', sans-serif", width: '100%', textAlign: 'left',
              background: page === n.id ? 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(251,191,36,0.15))' : 'rgba(255,255,255,0.9)',
              boxShadow: page === n.id ? '0 12px 30px rgba(251,146,60,0.15)' : '0 8px 24px rgba(15,23,42,0.05)',
            }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: page === n.id ? 'linear-gradient(135deg,#fb923c,#f97316)' : '#dbeafe', boxShadow: page === n.id ? '0 0 10px rgba(251,146,60,0.25)' : 'none' }} />
              <span>{n.label}</span>
            </button>
          ))}

          <div style={{ flex: 1 }} />

          {/* User footer */}
          <div style={{ padding: 16, borderRadius: 16, background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.5)' }}>
            <div style={{ fontSize: 13, color: '#2d5a8e', fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {auth.email}
            </div>
            <div style={{ fontSize: 11, color: '#60a5fa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
              {auth.role}
            </div>
            <button onClick={handleLogout} style={{
              width: '100%', padding: 10, borderRadius: 12,
              border: '1px solid rgba(239,68,68,0.18)', background: 'rgba(239,68,68,0.08)',
              color: '#dc2626', cursor: 'pointer', fontFamily: "'Inter', sans-serif",
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s',
            }}
              onMouseEnter={e => e.target.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.target.style.background = 'rgba(239,68,68,0.08)'}
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 28, overflowY: 'auto', maxHeight: '100vh' }}>
          {page === 'dashboard' && <DashboardPage token={auth.token} projects={projects} />}
          {page === 'projects'  && <ProjectsPage  token={auth.token} projects={projects} onRefresh={loadProjects} />}
          {page === 'tasks'     && <TasksPage      token={auth.token} projects={projects} />}
          {page === 'mytasks'   && <MyTasksPage    token={auth.token} />}
        </div>
      </div>
    </div>
  );
}
