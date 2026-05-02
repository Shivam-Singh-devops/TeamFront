import * as React from 'react';
const { useState } = React;
import { apiCall } from './api';
import { Glass, Btn, Field, Input, Select, Alert, BgOrbs, Spinner } from './components';

export default function AuthPage({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'ADMIN' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit() {
    setErr(''); setMsg('');
    if (!form.email || !form.password) return setErr('Email and password are required.');
    setLoading(true);
    try {
      if (tab === 'register') {
        if (!form.name) return setErr('Name is required.');
        await apiCall('/auth/register', 'POST', form);
        setMsg('Registered successfully! Please login.');
        setTab('login');
      } else {
        const data = await apiCall('/auth/login', 'POST', { email: form.email, password: form.password });
        onLogin(data);
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const tabBtn = (id, label) => (
    <button onClick={() => { setTab(id); setErr(''); setMsg(''); }} style={{
      flex: 1, padding: '10px', border: 'none', borderRadius: 9, cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 14, transition: 'all 0.2s',
      background: tab === id ? 'rgba(255,255,255,0.8)' : 'transparent',
      color: tab === id ? '#1e3a5f' : '#4a7ab5',
      boxShadow: tab === id ? '0 2px 8px rgba(30,100,180,0.15)' : 'none',
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, position: 'relative' }}>
      <BgOrbs />
      <Glass style={{ padding: '48px 40px', width: '100%', maxWidth: 420, position: 'relative', zIndex: 1, animation: 'slideUp 0.5s ease' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8, color: '#fb923c' }}>TT</div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>
            Team<span style={{ color: '#fb923c' }}>Track</span>
          </h1>
          <p style={{ color: '#475569', fontSize: 15, marginTop: 6 }}>A playful tracker for teams that feels bright, bold, and fun.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.3)', borderRadius: 12, padding: 4 }}>
          {tabBtn('login', 'Login')}
          {tabBtn('register', 'Register')}
        </div>

        {err && <Alert type="error">{err}</Alert>}
        {msg && <Alert type="success">{msg}</Alert>}

        {tab === 'register' && (
          <Field label="Full Name">
            <Input placeholder="Shivam Singh" value={form.name} onChange={set('name')} />
          </Field>
        )}
        <Field label="Email">
          <Input type="email" placeholder="admin@gmail.com" value={form.email} onChange={set('email')} />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
        </Field>
        {tab === 'register' && (
          <Field label="Role">
            <Select value={form.role} onChange={set('role')}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </Field>
        )}

        <Btn onClick={submit} disabled={loading} style={{ width: '100%', padding: '14px', fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: '0.02em', borderRadius: 14 }}>
          {loading ? <Spinner /> : tab === 'login' ? 'Sign In →' : 'Create Account →'}
        </Btn>
      </Glass>
    </div>
  );
}
