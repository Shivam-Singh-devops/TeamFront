import * as React from 'react';
const { useState, useEffect } = React;
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { taskApi } from './api';
import { Glass, PageHeader } from './components';

function StatCard({ icon, val, label, color, delay = 0 }) {
  return (
    <Glass style={{ padding: 22, position: 'relative', overflow: 'hidden', animation: `slideUp 0.4s ease ${delay}s both`, background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{val}</div>
      <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ position: 'absolute', bottom: -18, right: -18, width: 62, height: 62, borderRadius: '50%', background: color, opacity: 0.25 }} />
    </Glass>
  );
}

const TOOLTIP_STYLE = { background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: 12, fontFamily: "'Inter', sans-serif", fontSize: 13 };

export default function DashboardPage({ token, projects }) {
  const [stats, setStats] = useState(null);
  const [allStats, setAllStats] = useState([]);

  useEffect(() => {
    async function load() {
      if (!projects.length) { setStats({ totalTasks: 0, completedTasks: 0, inProgressTasks: 0, todoTasks: 0, overdueTasks: 0, teamMembers: 0 }); return; }
      const results = await Promise.all(
        projects.map(p => taskApi.stats(p.id, token).catch(() => null))
      );
      const valid = results.filter(Boolean);
      setAllStats(valid);
      const merged = valid.reduce((acc, s) => ({
        totalTasks: acc.totalTasks + (s.totalTasks || 0),
        completedTasks: acc.completedTasks + (s.completedTasks || 0),
        inProgressTasks: acc.inProgressTasks + (s.inProgressTasks || 0),
        todoTasks: acc.todoTasks + (s.todoTasks || 0),
        overdueTasks: acc.overdueTasks + (s.overdueTasks || 0),
        teamMembers: Math.max(acc.teamMembers, s.teamMembers || 0),
      }), { totalTasks: 0, completedTasks: 0, inProgressTasks: 0, todoTasks: 0, overdueTasks: 0, teamMembers: 0 });
      setStats(merged);
    }
    load();
  }, [projects, token]);

  const pieData = stats ? [
    { name: 'To Do', value: stats.todoTasks, color: '#60a5fa' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#fbbf24' },
    { name: 'Completed', value: stats.completedTasks, color: '#34d399' },
    { name: 'Overdue', value: stats.overdueTasks, color: '#f87171' },
  ].filter(d => d.value > 0) : [];

  const barData = projects.slice(0, 6).map((p, i) => {
    const s = allStats[i] || {};
    return {
      name: p.name?.length > 12 ? p.name.slice(0, 12) + '…' : p.name,
      'To Do': s.todoTasks || 0,
      'In Progress': s.inProgressTasks || 0,
      'Done': s.completedTasks || 0,
    };
  });

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <PageHeader title="Dashboard 🏠" sub="Here's what's happening across all your projects" />

      {/* Stat cards */}
      <div className="dashboard-stat-grid">
        <Glass className="dashboard-stat-card" style={{ padding: 18, position: 'relative', overflow: 'hidden', animation: 'slideUp 0.4s ease 0s both', background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="dashboard-stat-icon">📁</div>
          <div className="dashboard-stat-value">{projects.length}</div>
          <div className="dashboard-stat-label">Total Projects</div>
        </Glass>
        <Glass className="dashboard-stat-card" style={{ padding: 18, position: 'relative', overflow: 'hidden', animation: 'slideUp 0.4s ease 0.05s both', background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="dashboard-stat-icon">✅</div>
          <div className="dashboard-stat-value">{stats?.completedTasks ?? '…'}</div>
          <div className="dashboard-stat-label">Completed</div>
        </Glass>
        <Glass className="dashboard-stat-card" style={{ padding: 18, position: 'relative', overflow: 'hidden', animation: 'slideUp 0.4s ease 0.1s both', background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="dashboard-stat-icon">⚡</div>
          <div className="dashboard-stat-value">{stats?.inProgressTasks ?? '…'}</div>
          <div className="dashboard-stat-label">In Progress</div>
        </Glass>
        <Glass className="dashboard-stat-card" style={{ padding: 18, position: 'relative', overflow: 'hidden', animation: 'slideUp 0.4s ease 0.15s both', background: 'linear-gradient(180deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="dashboard-stat-icon">👥</div>
          <div className="dashboard-stat-value">{stats?.teamMembers ?? '…'}</div>
          <div className="dashboard-stat-label">Team Members</div>
        </Glass>
      </div>

      {/* Charts */}
      <div className="dashboard-charts-grid">
        <Glass className="dashboard-chart-card">
          <div className="dashboard-chart-title">📊 Task Distribution</div>
          {pieData.length > 0 ? (
            <div className="dashboard-pie-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: 13, fontFamily: "'Inter', sans-serif" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#60a5fa', fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>No task data yet
            </div>
          )}
        </Glass>

        <Glass className="dashboard-chart-card">
          <div className="dashboard-chart-title">📈 Tasks by Project</div>
          {barData.length > 0 ? (
            <div style={{ flex: 1, minHeight: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barSize={16} margin={{ top: 12, right: 18, left: 10, bottom: 28 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#4a7ab5' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#4a7ab5' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontFamily: "'Inter', sans-serif" }} />
                  <Bar dataKey="To Do" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="In Progress" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Done" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#60a5fa', fontSize: 14 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>No data yet
            </div>
          )}
        </Glass>
      </div>

      {/* Project progress */}
      <Glass style={{ padding: 24 }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: '#1e3a5f', marginBottom: 20 }}>🗂️ Project Progress</div>
        {projects.length === 0 ? (
          <div style={{ color: '#60a5fa', fontSize: 14 }}>No projects yet. Create one to get started!</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {projects.map((p, i) => {
              const s = allStats[i] || {};
              const pct = s.totalTasks ? Math.round((s.completedTasks / s.totalTasks) * 100) : 0;
              return (
                <div key={p.id} style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(255,255,255,0.5)' }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 14, color: '#1e3a5f', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(59,130,246,0.15)', marginBottom: 6, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg,#3b82f6,#34d399)', width: `${pct}%`, transition: 'width 0.8s ease' }} />
                  </div>
                  <div style={{ fontSize: 12, color: '#4a7ab5' }}>{pct}% complete · {s.totalTasks || 0} tasks</div>
                </div>
              );
            })}
          </div>
        )}
      </Glass>
    </div>
  );
}
