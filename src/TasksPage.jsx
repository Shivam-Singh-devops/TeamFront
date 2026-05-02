import React, { useState, useEffect, useCallback } from 'react';
import { taskApi, projectApi, STATUS_COLORS, fmtDate } from './api';
import { Glass, Btn, Field, Input, Select, Modal, Alert, Empty, PageHeader, SectionHeader, StatusBadge, Spinner } from './components';

export default function TasksPage({ token, projects }) {
  const [selProject, setSelProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [isProjectAdmin, setIsProjectAdmin] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', assignedToUserId: '', dueDate: '', status: 'TODO' });
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [err, setErr] = useState('');

  const loadTasks = useCallback(async (pid) => {
    setTasksLoading(true);
    try {
      const [t, s, p] = await Promise.all([
        taskApi.list(pid, token),
        taskApi.stats(pid, token),
        projectApi.get(pid, token),
      ]);
      setTasks(Array.isArray(t) ? t : []);
      setStats(s);
      setProjectMembers(p.members || []);
      setIsProjectAdmin(p.canEdit || false);
    } catch { setTasks([]); setStats(null); setProjectMembers([]); setIsProjectAdmin(false); }
    finally { setTasksLoading(false); }
  }, [token]);

  useEffect(() => { if (selProject) loadTasks(selProject.id); }, [selProject, loadTasks]);

  const resetForm = () => setForm({ title: '', description: '', assignedToUserId: '', dueDate: '', status: 'TODO' });

  async function createTask() {
    if (!form.title.trim()) return setErr('Title is required.');
    if (!form.assignedToUserId || isNaN(Number(form.assignedToUserId))) return setErr('Valid assigned user ID is required.');
    setLoading(true); setErr('');
    try {
      const data = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        assignedToUserId: Number(form.assignedToUserId),
        dueDate: form.dueDate || null,
      };
      await taskApi.create(selProject.id, data, token);
      setShowCreate(false); resetForm(); loadTasks(selProject.id);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function updateTask() {
    if (!form.title.trim()) return setErr('Title is required.');
    setLoading(true); setErr('');
    try {
      const data = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        dueDate: form.dueDate || null,
      };

      // Only include assignedToUserId if user is admin or if it's different from current (indicating reassignment)
      if (isProjectAdmin || (form.assignedToUserId && Number(form.assignedToUserId) !== editTask.assignedToUserId)) {
        if (!form.assignedToUserId || isNaN(Number(form.assignedToUserId))) {
          return setErr('Valid assigned user ID is required.');
        }
        data.assignedToUserId = Number(form.assignedToUserId);
      }

      await taskApi.update(editTask.id, data, token);
      setEditTask(null); loadTasks(selProject.id);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function deleteTask(id) {
    if (!window.confirm('Delete this task?')) return;
    try { await taskApi.delete(id, token); loadTasks(selProject.id); }
    catch (e) { alert(e.message); }
  }

  async function toggleTaskStatus(taskId, currentStatus) {
    const statusCycle = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

    try {
      await taskApi.update(taskId, { status: nextStatus }, token);
      loadTasks(selProject.id);
    } catch (e) {
      alert('Failed to update task status: ' + e.message);
    }
  }

  function openEdit(t) {
    setEditTask(t);
    setForm({
      title: t.title,
      description: t.description || '',
      assignedToUserId: isProjectAdmin ? (t.assignedToUserId || '') : '',
      dueDate: t.dueDate ? t.dueDate.slice(0, 16) : '',
      status: t.status || 'TODO'
    });
    setErr('');
  }

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <PageHeader title="Tasks 📋" sub="Create and manage tasks across your projects" />

      {/* Project selector */}
      <Glass style={{ padding: '16px 20px', marginBottom: 24 }}>
        <Field label="Select Project" >
          <Select value={selProject?.id || ''} onChange={e => { const p = projects.find(x => String(x.id) === e.target.value); setSelProject(p || null); setTasks([]); setStats(null); }}>
            <option value="">— Choose a project —</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </Field>
      </Glass>

      {selProject ? (
        <>
          {/* Mini stats */}
          {stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { l: 'Total', v: stats.totalTasks, c: '#3b82f6' },
                { l: 'To Do', v: stats.todoTasks, c: '#60a5fa' },
                { l: 'In Progress', v: stats.inProgressTasks, c: '#fbbf24' },
                { l: 'Completed', v: stats.completedTasks, c: '#34d399' },
              ].map((s, i) => (
                <Glass key={i} style={{ padding: '14px 18px' }}>
                  <div style={{ fontSize: 22, fontFamily: "'Syne', sans-serif", fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: '#4a7ab5', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>{s.l}</div>
                </Glass>
              ))}
            </div>
          )}

          <SectionHeader
            title={`Tasks in "${selProject.name}"`}
            action={<Btn size="sm" onClick={() => { setShowCreate(true); resetForm(); setErr(''); }} style={{ borderRadius: 11 }}>+ Add Task</Btn>}
          />

          {tasksLoading ? (
            <div style={{ textAlign: 'center', padding: 48, color: '#60a5fa' }}>
              <Spinner /> <span style={{ marginLeft: 10 }}>Loading tasks…</span>
            </div>
          ) : tasks.length === 0 ? (
            <Glass><Empty icon="📋" title="No tasks yet" sub="Add your first task to this project" /></Glass>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tasks.map((t, i) => (
                <Glass key={t.id} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, transition: 'all 0.2s', animation: `slideUp 0.3s ease ${i * 0.04}s both` }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: STATUS_COLORS[t.status] || '#60a5fa', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: '#1e3a5f', fontSize: 15, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: 13, color: '#4a7ab5', marginBottom: 4, lineHeight: 1.4 }}>{t.description || 'No description'}</div>
                    <div style={{ fontSize: 12, color: '#60a5fa' }}>👤 {t.assignedPersonName}</div>
                  </div>
                  <StatusBadge status={t.status} />
                  <div style={{ fontSize: 12, color: t.isOverdue ? '#ef4444' : '#60a5fa', flexShrink: 0, fontWeight: t.isOverdue ? 600 : 400, marginLeft: 8 }}>
                    📅 {fmtDate(t.dueDate)}{t.isOverdue && ' (Overdue)'}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 8 }}>
                    <Btn variant="ghost" onClick={() => toggleTaskStatus(t.id, t.status)} size="sm" style={{ padding: '8px 12px', borderRadius: 9 }}>
                      {t.status === 'TODO' ? '▶️' : t.status === 'IN_PROGRESS' ? '⏸️' : '✅'}
                    </Btn>
                    <Btn variant="ghost" onClick={() => openEdit(t)} size="sm" style={{ padding: '8px 12px', borderRadius: 9 }}>✏️</Btn>
                    <Btn variant="danger" onClick={() => deleteTask(t.id)} size="sm" style={{ padding: '8px 12px', borderRadius: 9 }}>🗑️</Btn>
                  </div>
                </Glass>
              ))}
            </div>
          )}
        </>
      ) : (
        projects.length > 0 && (
          <Glass><Empty icon="👆" title="Select a project" sub="Choose a project above to view and manage its tasks" /></Glass>
        )
      )}

      {/* Create / Edit Modal */}
      {(showCreate || editTask) && (
        <Modal title={editTask ? '✏️ Edit Task' : '✨ New Task'} onClose={() => { setShowCreate(false); setEditTask(null); }}>
          {err && <Alert>{err}</Alert>}
          <Field label="Title"><Input placeholder="Design Homepage" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></Field>
          <Field label="Description"><Input placeholder="Task details…" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></Field>
          {(showCreate || (editTask && isProjectAdmin)) && (
            <Field label="Assigned To (User ID)">
              <Input type="number" placeholder="Enter user ID" value={form.assignedToUserId} onChange={e => setForm(f => ({ ...f, assignedToUserId: e.target.value }))} />
              {projectMembers.length > 0 && (
                <div style={{ fontSize: 11, color: '#4a7ab5', marginTop: 4 }}>
                  Available members: {projectMembers.map(m => `${m.name} (ID needed)`).join(', ')}
                </div>
              )}
            </Field>
          )}
          <Field label="Due Date"><Input type="datetime-local" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></Field>
          {editTask && (
            <Field label="Status">
              <Select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </Field>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => { setShowCreate(false); setEditTask(null); }} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={editTask ? updateTask : createTask} disabled={loading} style={{ flex: 1 }}>
              {loading ? <Spinner /> : editTask ? 'Save Changes' : 'Create Task'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
