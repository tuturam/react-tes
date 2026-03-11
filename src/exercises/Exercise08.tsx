// ============================================================
// EXERCISE 08: Suspense, Lazy Loading, Error Boundaries, Portals
// Konsep: React.lazy, Suspense, ErrorBoundary, useTransition, createPortal
// ============================================================

import { useState, useTransition, Component, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

// ============================================================
// 📝 PART 1: Error Boundary (Class Component — satu-satunya kasus wajib class)
// ============================================================

// TODO 1: Implementasi ErrorBoundary class component
// React TIDAK punya hook equivalent — ini HARUS class component

interface ErrorBoundaryProps { children: ReactNode; fallback?: ReactNode }
interface ErrorBoundaryState { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // TODO 2: Implementasi static getDerivedStateFromError
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 👇 IMPLEMENTASI
    return { hasError: true, error }
  }

  // TODO 3: Implementasi componentDidCatch untuk logging
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="alert alert-warning">
          <strong>⚠️ Error:</strong> {this.state.error?.message}
          <button className="btn" style={{ marginLeft: 12, fontSize: '0.72rem', padding: '3px 8px' }}
            onClick={() => this.setState({ hasError: false, error: null })}>
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ============================================================
// 📝 PART 2: Lazy Loading + Suspense + useTransition
// ============================================================

// TODO 4: Gunakan React.lazy untuk lazy load komponen berat
// Untuk exercise ini kita simulasi dengan komponen biasa + delay

// Simulated "heavy" tab components
function AnalyticsTab() {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📊 Analytics Dashboard</h3>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={{ padding: '10px', marginBottom: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
          Metric {i + 1}: {Math.floor(Math.random() * 1000)}
        </div>
      ))}
    </div>
  )
}

function ReportsTab() {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>📝 Reports</h3>
      {['Q1 Revenue', 'Q2 Growth', 'Q3 Forecast'].map((r) => (
        <div key={r} style={{ padding: '10px', marginBottom: 6, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>{r}</div>
      ))}
    </div>
  )
}

// Component yang intentionally throws
function BuggyTab(): ReactNode {
  // TODO 5: Component ini sengaja throw error setelah render
  // Error Boundary harus catch ini
  const [shouldThrow, setShouldThrow] = useState(false)
  if (shouldThrow) throw new Error('BuggyTab crashed! 💥')
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: '1rem', marginBottom: 12 }}>💣 Buggy Tab</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        Click the button to crash this tab. Error Boundary should catch it.
      </p>
      <button className="btn" onClick={() => setShouldThrow(true)}>💥 Crash This Tab</button>
    </div>
  )
}

// ============================================================
// 📝 PART 3: createPortal — Modal
// ============================================================

// TODO 6: Implementasi Modal menggunakan createPortal
function Modal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: ReactNode }) {
  if (!isOpen) return null

  // TODO: gunakan createPortal untuk render di luar React tree
  return createPortal(
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, maxWidth: 480, width: '90%', boxShadow: 'var(--shadow-lg)' }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Modal via Portal</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

const tabs = [
  { id: 'analytics', label: '📊 Analytics' },
  { id: 'reports', label: '📝 Reports' },
  { id: 'buggy', label: '💣 Buggy' },
]

export default function Exercise08() {
  const [activeTab, setActiveTab] = useState('analytics')
  const [isPending, startTransition] = useTransition()
  const [modalOpen, setModalOpen] = useState(false)

  // TODO 7: Gunakan useTransition untuk smooth tab switch
  const handleTabChange = (tabId: string) => {
    // ❌ Tanpa transition: UI freeze saat render heavy tab
    // setActiveTab(tabId)

    // ✅ Dengan transition: UI tetap responsive
    startTransition(() => {
      setActiveTab(tabId)
    })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics': return <AnalyticsTab />
      case 'reports': return <ReportsTab />
      case 'buggy': return <BuggyTab />
      default: return null
    }
  }

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 08</span>
        <h2 className="exercise-title">Suspense, Error Boundaries & Portals</h2>
        <p className="exercise-description">
          Error Boundary class component, <code className="inline-code">useTransition</code> untuk smooth transitions,
          dan <code className="inline-code">createPortal</code> untuk modal.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-pattern">ErrorBoundary</span><span className="tag tag-hook">useTransition</span>
          <span className="tag tag-hook">createPortal</span><span className="tag tag-hook">Suspense</span>
        </div>
      </div>

      {/* TAB DASHBOARD */}
      <div className="section">
        <div className="section-title"><span className="icon">📑</span> Tab Dashboard</div>
        <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              style={{ padding: '8px 16px', background: activeTab === tab.id ? 'var(--accent-glow)' : 'transparent', color: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--text-muted)', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-sans)', opacity: isPending ? 0.6 : 1 }}>
              {tab.label}
            </button>
          ))}
        </div>
        {isPending && <div className="alert alert-info">⏳ Loading tab...</div>}
        <ErrorBoundary key={activeTab}>
          {renderTabContent()}
        </ErrorBoundary>
      </div>

      {/* PORTAL MODAL */}
      <div className="section">
        <div className="section-title"><span className="icon">🌀</span> Portal Modal</div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
          Modal di-render ke <code className="inline-code">document.body</code> via <code className="inline-code">createPortal</code>,
          tapi tetap part of React tree (events bubble up).
        </p>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>Open Modal</button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            Modal ini di-render di luar parent DOM hierarchy via <code className="inline-code">createPortal</code>.
            Inspect DOM untuk buktikan bahwa element ini ada di <code className="inline-code">document.body</code>.
          </p>
        </Modal>
      </div>

      {/* TASKS */}
      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Review Error Boundary — <code className="inline-code">getDerivedStateFromError</code> + <code className="inline-code">componentDidCatch</code></li>
          <li><span className="task-check">☐</span> Test: crash Buggy Tab, lalu Retry. Tab lain tetap jalan.</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">useTransition</code> — isPending + startTransition</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">createPortal</code> — inspect DOM tree</li>
          <li><span className="task-check">☐</span> Pertanyaan: kenapa ErrorBoundary HARUS class component?</li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li>ErrorBoundary butuh <code>getDerivedStateFromError</code> — no hook equivalent</li>
            <li><code>useTransition</code>: mark state update sebagai non-urgent</li>
            <li>Portal: DOM di luar, tapi React event bubbling tetap ke parent</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
