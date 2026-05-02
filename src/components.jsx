import React from 'react';

// Glass card
export function Glass({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.18))',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.55)',
      boxShadow: '0 20px 60px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.55)',
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Button
export function Btn({ children, onClick, variant = 'primary', disabled, style = {}, size = 'md' }) {
  const pad = size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 22px';
  const fs = size === 'sm' ? 13 : size === 'lg' ? 15 : 14;
  const variants = {
    primary: { background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', color: '#fff', boxShadow: '0 4px 15px rgba(59,130,246,0.4)', border: 'none' },
    ghost: { background: 'rgba(255,255,255,0.4)', color: '#2d5a8e', border: '1px solid rgba(255,255,255,0.6)' },
    danger: { background: 'rgba(239,68,68,0.12)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)' },
    success: { background: 'rgba(52,211,153,0.15)', color: '#059669', border: '1px solid rgba(52,211,153,0.3)' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: pad, borderRadius: 12, cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: fs,
      transition: 'all 0.2s', opacity: disabled ? 0.5 : 1,
      ...variants[variant], ...style,
    }}>
      {children}
    </button>
  );
}

// Input field wrapper
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#2d5a8e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

// Input
export function Input({ type = 'text', placeholder, value, onChange, style = {} }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={{
      width: '100%', padding: '11px 15px', borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.5)',
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1e3a5f', outline: 'none',
      transition: 'all 0.2s', ...style,
    }}
    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.background = 'rgba(255,255,255,0.7)'; }}
    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.5)'; }}
    />
  );
}

// Select
export function Select({ value, onChange, children, style = {} }) {
  return (
    <select value={value} onChange={onChange} style={{
      width: '100%', padding: '11px 15px', borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.5)',
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#1e3a5f', outline: 'none',
      appearance: 'none', cursor: 'pointer', ...style,
    }}>
      {children}
    </select>
  );
}

// Modal
export function Modal({ title, children, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,40,80,0.35)',
      backdropFilter: 'blur(6px)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      animation: 'fadeIn 0.2s ease',
    }}>
      <Glass style={{ padding: 32, width: '100%', maxWidth: 480, animation: 'slideUp 0.3s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 800, color: '#111827' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.4)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#4a7ab5' }}>✕</button>
        </div>
        {children}
      </Glass>
    </div>
  );
}

// Spinner
export function Spinner() {
  return <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block', verticalAlign: 'middle' }} />;
}

// Alert
export function Alert({ type = 'error', children }) {
  const styles = {
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', color: '#dc2626' },
    success: { bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)', color: '#059669' },
  };
  const s = styles[type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
      {type === 'error' ? '⚠️ ' : '✅ '}{children}
    </div>
  );
}

// Empty state
export function Empty({ icon, title, sub }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, color: '#111827', fontSize: 18, marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ color: '#60a5fa', fontSize: 13 }}>{sub}</div>}
    </div>
  );
}

// Background orbs
export function BgOrbs() {
  const orb = (w, h, bg, top, left, right, bottom, delay) => (
    <div style={{
      position: 'absolute', width: w, height: h, borderRadius: '50%',
      background: bg, filter: 'blur(60px)', opacity: 0.35,
      top, left, right, bottom,
      animation: `float 8s ease-in-out ${delay}s infinite`,
    }} />
  );
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {orb(400, 400, 'radial-gradient(#60a5fa,#3b82f6)', -100, -100, undefined, undefined, 0)}
      {orb(350, 350, 'radial-gradient(#a5b4fc,#818cf8)', '50%', undefined, -80, undefined, 3)}
      {orb(300, 300, 'radial-gradient(#7dd3fc,#38bdf8)', undefined, '30%', undefined, -80, 5)}
    </div>
  );
}

// Page header
export function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ color: '#4f46e5', fontSize: 15, fontWeight: 600 }}>{sub}</div>
    </div>
  );
}

// Section header
export function SectionHeader({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#111827' }}>{title}</div>
      {action}
    </div>
  );
}

// Status badge
export function StatusBadge({ status }) {
  const colors = { TODO: '#60a5fa', IN_PROGRESS: '#fbbf24', COMPLETED: '#34d399' };
  const c = colors[status] || '#60a5fa';
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', background: `${c}22`, color: c, border: `1px solid ${c}44`,
      whiteSpace: 'nowrap',
    }}>
      {status?.replace('_', ' ') || 'TODO'}
    </span>
  );
}
