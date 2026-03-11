// ============================================================
// EXERCISE 12: Full Integration Challenge
// Konsep: SEMUA konsep React digabung dalam satu mini-app
// ============================================================
// Ini adalah exercise TERBERAT. Kamu harus build mini Task Manager
// yang menggabungkan semua konsep dari Exercise 1-11.
//
// INSTRUKSI: File ini berisi KERANGKA saja.
// Tugasmu: implementasi SELURUH fungsionalitas dari scratch.
// ============================================================

export default function Exercise12() {
  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 12 — FINAL</span>
        <h2 className="exercise-title">🏆 Integration Challenge: Task Manager</h2>
        <p className="exercise-description">
          Bangun <strong>mini Task Manager App</strong> dari scratch yang menggabungkan <strong>semua</strong> konsep
          dari Exercise 1-11. Ini adalah tes terakhir — selesaikan tanpa melihat exercise sebelumnya.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">All Hooks</span>
          <span className="tag tag-pattern">All Patterns</span>
          <span className="tag tag-ts">TypeScript Strict</span>
          <span className="tag tag-react19">React 19</span>
          <span className="tag tag-perf">Performance</span>
        </div>
      </div>

      {/* REQUIREMENTS */}
      <div className="section">
        <div className="section-title"><span className="icon">📋</span> Requirements</div>
        <ul className="task-list">
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Global State (Ex 1, 4, 10):</strong> Buat <code className="inline-code">TaskContext</code> dengan{' '}
              <code className="inline-code">useReducer</code>. Actions: ADD, TOGGLE, DELETE, EDIT, FILTER.
              Discriminated union actions. Atau gunakan external store pattern (useSyncExternalStore).
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Persistence (Ex 3):</strong> Custom <code className="inline-code">useLocalStorage</code> hook
              untuk persist tasks. Tasks harus survive page refresh.
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Add Task Form (Ex 9, 11):</strong> Controlled form dengan validation.
              Gunakan <code className="inline-code">useActionState</code> untuk form submission.
              Optimistic update saat menambah task.
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Performance (Ex 5):</strong> TaskList wajib dioptimasi.{' '}
              <code className="inline-code">React.memo</code> pada TaskItem.{' '}
              <code className="inline-code">useCallback</code> pada handlers.{' '}
              <code className="inline-code">useDeferredValue</code> untuk search filter.
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Error Boundary (Ex 8):</strong> Wrap content area dengan ErrorBoundary.
              Jika satu bagian crash, sisanya tetap berjalan.
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Modal Portal (Ex 8):</strong> Delete confirmation modal via{' '}
              <code className="inline-code">createPortal</code>.
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>Accessible IDs (Ex 6):</strong> Gunakan <code className="inline-code">useId</code>{' '}
              untuk semua form fields (htmlFor, aria-labelledby).
            </div>
          </li>
          <li>
            <span className="task-check">☐</span>
            <div>
              <strong>TypeScript Strict:</strong> Zero <code className="inline-code">any</code>.
              Gunakan proper types, generics, utility types, discriminated unions.
            </div>
          </li>
        </ul>
      </div>

      {/* ARCHITECTURE GUIDE */}
      <div className="section">
        <div className="section-title"><span className="icon">🏗️</span> Suggested Architecture</div>
        <div className="code-block">
          <div className="code-header"><span className="filename">Architecture</span></div>
          <pre>{`// Types
interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

type Action =
  | { type: 'ADD'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'TOGGLE'; payload: { id: string } }
  | { type: 'DELETE'; payload: { id: string } }
  | { type: 'EDIT'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'SET'; payload: Task[] }

// Component Tree:
// <ErrorBoundary>
//   <TaskProvider>         ← Context + useReducer
//     <TaskHeader />       ← Title + Stats
//     <TaskForm />         ← Add task (useActionState + useOptimistic)
//     <TaskFilters />      ← Filter by status/priority
//     <TaskList />         ← React.memo + useDeferredValue
//       <TaskItem />       ← React.memo + useCallback handlers
//     <DeleteModal />      ← createPortal
//   </TaskProvider>
// </ErrorBoundary>`}</pre>
        </div>
      </div>

      {/* SANDBOX */}
      <div className="section">
        <div className="section-title"><span className="icon">🔨</span> Build Area</div>
        <div className="sandbox">
          <div className="sandbox-label">Your App Goes Here</div>
          <div className="sandbox-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Implementasi Task Manager App di file ini.<br />
              Mulai dari bawah import, build semua komponen di atas.
            </p>
          </div>
        </div>
      </div>

      {/* SCORING */}
      <div className="section">
        <div className="section-title"><span className="icon">⭐</span> Scoring Guide</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {[
            { score: '1-3', label: 'Pemula', desc: 'Bisa buat basic CRUD tapi tanpa patterns' },
            { score: '4-5', label: 'Menengah', desc: 'Context + hooks, tapi belum optimized' },
            { score: '6-7', label: 'Mahir', desc: 'Full patterns, performance, TypeScript strict' },
            { score: '8-10', label: 'Expert', desc: 'React 19, zero any, architecture clean' },
          ].map((s) => (
            <div key={s.score} style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 }}>{s.score}: {s.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <details className="hint-box">
        <summary>💡 Final Hints</summary>
        <ul>
          <li>Mulai dari types & reducer dulu — itu fondasinya</li>
          <li>Buat Context + Provider, lalu wire ke komponen satu per satu</li>
          <li>Optimize terakhir — jangan premature optimize</li>
          <li>Test dengan React DevTools Profiler untuk verify re-render counts</li>
        </ul>
      </details>
    </div>
  )
}
