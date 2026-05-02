import * as React from 'react';
const { useState } = React;
import { projectApi } from './api';
import { Glass, Btn, Field, Input, Modal, Alert, Empty, PageHeader, SectionHeader, Spinner } from './components';

export default function ProjectsPage({ token, projects, onRefresh }) {
  const [showCreate, setShowCreate] = useState(false);
  const [showMember, setShowMember] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState({});
  const [form, setForm] = useState({ name: '', description: '' });
  const [memberEmail, setMemberEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function loadProjectDetails(id) {
    if (projectDetails[id]) return projectDetails[id];
    try {
      const details = await projectApi.get(id, token);
      setProjectDetails(prev => ({ ...prev, [id]: details }));
      return details;
    } catch (e) {
      console.error('Failed to load project details:', e);
      return null;
    }
  }

  async function createProject() {
    if (!form.name.trim()) return setErr('Project name is required.');
    setLoading(true); setErr('');
    try {
      await projectApi.create({ name: form.name.trim(), description: form.description.trim() || null }, token);
      setShowCreate(false); setForm({ name: '', description: '' }); onRefresh();
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  async function deleteProject(id) {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try { await projectApi.delete(id, token); onRefresh(); }
    catch (e) { alert(e.message); }
  }

  async function addMember() {
    if (!memberEmail.trim()) return setErr('Email is required.');
    setLoading(true); setErr('');
    try {
      await projectApi.addMember(showMember, { email: memberEmail.trim() }, token);
      setShowMember(null); setMemberEmail(''); onRefresh();
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ animation: 'slideUp 0.4s ease' }}>
      <PageHeader title="Projects 📁" sub="All your projects in one place" />
      <SectionHeader
        title={`All Projects (${projects.length})`}
        action={<Btn onClick={() => { setShowCreate(true); setErr(''); }} size="sm" style={{ borderRadius: 11 }}>+ New Project</Btn>}
      />

      {projects.length === 0 ? (
        <Glass><Empty icon="📁" title="No projects yet" sub="Create your first project to get started" /></Glass>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {projects.map((p, i) => (
            <Glass key={p.id} style={{ padding: 22, cursor: 'default', transition: 'all 0.25s', animation: `slideUp 0.4s ease ${i * 0.05}s both` }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#1e3a5f', marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: '#4a7ab5', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {p.description || 'No description provided.'}
              </div>
              <div style={{ marginBottom: 14, minHeight: 28 }}>
                <div style={{ fontSize: 11, color: '#60a5fa', marginBottom: 6 }}>Creator: {p.creatorEmail}</div>
                <div style={{ fontSize: 11, color: '#4a7ab5' }}>Created: {new Date(p.createdDate).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Btn variant="ghost" onClick={() => { setShowDetails(p.id); loadProjectDetails(p.id); }} size="sm" style={{ flex: 1, borderRadius: 10 }}>👁️ View</Btn>
                {p.canEdit && <Btn variant="ghost" onClick={() => { setShowMember(p.id); setErr(''); }} size="sm" style={{ borderRadius: 10 }}>👤 Add Member</Btn>}
                {p.canEdit && <Btn variant="danger" onClick={() => deleteProject(p.id)} size="sm" style={{ borderRadius: 10 }}>🗑️</Btn>}
              </div>
            </Glass>
          ))}
        </div>
      )}

      {showCreate && (
        <Modal title="✨ New Project" onClose={() => setShowCreate(false)}>
          {err && <Alert>{err}</Alert>}
          <Field label="Project Name">
            <Input placeholder="Website Redesign" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Description">
            <Input placeholder="What's this project about?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowCreate(false)} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={createProject} disabled={loading} style={{ flex: 1 }}>{loading ? <Spinner /> : 'Create Project'}</Btn>
          </div>
        </Modal>
      )}

      {showDetails && (
        <Modal title="📁 Project Details" onClose={() => setShowDetails(null)}>
          {projectDetails[showDetails] ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e3a5f', marginBottom: 8 }}>{projectDetails[showDetails].name}</div>
                <div style={{ color: '#4a7ab5', marginBottom: 12 }}>{projectDetails[showDetails].description || 'No description'}</div>
                <div style={{ fontSize: 12, color: '#60a5fa' }}>Created: {new Date(projectDetails[showDetails].createdDate).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: '#60a5fa' }}>Creator: {projectDetails[showDetails].creatorEmail}</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#1e3a5f', marginBottom: 8 }}>Team Members ({projectDetails[showDetails].members.length})</div>
                {projectDetails[showDetails].members.length === 0 ? (
                  <div style={{ color: '#4a7ab5', fontSize: 13 }}>No members yet</div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {projectDetails[showDetails].members.map((m, j) => (
                      <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 20, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', fontSize: 12, color: '#1d4ed8', fontWeight: 500 }}>
                        👤 {m.name} ({m.email}) - {m.role}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Spinner /> <span style={{ marginLeft: 10 }}>Loading details…</span>
            </div>
          )}
        </Modal>
      )}

      {showMember && (
        <Modal title="👤 Add Member" onClose={() => { setShowMember(null); setErr(''); }}>
          {err && <Alert>{err}</Alert>}
          <Field label="Member Email">
            <Input type="email" placeholder="john@gmail.com" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} />
          </Field>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Btn variant="ghost" onClick={() => setShowMember(null)} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={addMember} disabled={loading} style={{ flex: 1 }}>{loading ? <Spinner /> : 'Add Member'}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
