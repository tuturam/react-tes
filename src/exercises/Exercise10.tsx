// ============================================================
// EXERCISE 10: useSyncExternalStore
// Konsep: useSyncExternalStore, external store pattern,
//         subscribe/getSnapshot, custom Redux-like store
// ============================================================

import { useSyncExternalStore, useCallback } from 'react'

// ============================================================
// 📝 PART 1: Buat custom store dari scratch
// ============================================================

// TODO 1: Implementasi createStore — mirip pattern Redux
// - getState(): return current state
// - setState(updater): update state + notify subscribers
// - subscribe(listener): add listener, return unsubscribe function
// - getSnapshot(): alias getState (for useSyncExternalStore)

interface Store<T> {
  getState: () => T
  setState: (updater: (prev: T) => T) => void
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => T
}

function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (updater) => {
      // TODO 2: Implementasi setState
      // - Update state dengan updater function
      // - Notify semua subscribers
      state = updater(state)
      listeners.forEach((l) => l())
    },
    subscribe: (listener) => {
      // TODO 3: Implementasi subscribe
      // - Add listener ke Set
      // - Return unsubscribe function
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => state,
  }
}

// ============================================================
// 📝 PART 2: Buat store instance
// ============================================================

interface AppState {
  count: number
  todos: { id: number; text: string; done: boolean }[]
  theme: 'dark' | 'light'
}

const appStore = createStore<AppState>({
  count: 0,
  todos: [
    { id: 1, text: 'Learn useSyncExternalStore', done: false },
    { id: 2, text: 'Build custom store', done: false },
    { id: 3, text: 'Implement selectors', done: true },
  ],
  theme: 'dark',
})

// ============================================================
// 📝 PART 3: Custom hook untuk akses store slice
// ============================================================

// TODO 4: Buat useStore hook DENGAN selector
// - Selector memilih SEBAGIAN state (slice)
// - Component hanya re-render jika slice berubah

function useStore<S>(selector: (state: AppState) => S): S {
  // TODO: gunakan useSyncExternalStore
  // getSnapshot harus return result dari selector
  const getSnapshot = useCallback(() => selector(appStore.getState()), [selector])
  return useSyncExternalStore(appStore.subscribe, getSnapshot)
}

// ============================================================
// 📝 PART 4: Komponen-komponen yang subscribe ke store
// ============================================================

function CounterWidget() {
  // TODO 5: Subscribe HANYA ke count — jangan re-render saat todos berubah
  const count = useStore((s) => s.count)

  return (
    <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800 }}>{count}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Counter (external store)</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <button className="btn" onClick={() => appStore.setState((s) => ({ ...s, count: s.count - 1 }))}>−</button>
        <button className="btn" onClick={() => appStore.setState((s) => ({ ...s, count: s.count + 1 }))}>+</button>
      </div>
    </div>
  )
}

function TodoWidget() {
  const todos = useStore((s) => s.todos)

  const toggleTodo = (id: number) => {
    appStore.setState((s) => ({
      ...s,
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }))
  }

  const addTodo = () => {
    const text = prompt('New todo:')
    if (!text) return
    appStore.setState((s) => ({
      ...s,
      todos: [...s.todos, { id: Date.now(), text, done: false }],
    }))
  }

  return (
    <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 10 }}>Todos (external store)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {todos.map((t) => (
          <div key={t.id} onClick={() => toggleTodo(t.id)}
            style={{ padding: '6px 10px', background: 'var(--bg-code)', borderRadius: 4, fontSize: '0.82rem', cursor: 'pointer', textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-muted)' : 'var(--text-primary)' }}>
            {t.done ? '✅' : '☐'} {t.text}
          </div>
        ))}
      </div>
      <button className="btn" onClick={addTodo} style={{ fontSize: '0.78rem' }}>+ Add Todo</button>
    </div>
  )
}

function ThemeWidget() {
  const theme = useStore((s) => s.theme)
  return (
    <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{theme === 'dark' ? '🌙' : '☀️'}</div>
      <button className="btn" onClick={() => appStore.setState((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }))}>
        Toggle Theme
      </button>
    </div>
  )
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

export default function Exercise10() {
  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 10</span>
        <h2 className="exercise-title">useSyncExternalStore</h2>
        <p className="exercise-description">
          Bangun custom Redux-like store dari scratch dan subscribe via{' '}
          <code className="inline-code">useSyncExternalStore</code>. Setiap widget hanya re-render saat slice-nya berubah.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">useSyncExternalStore</span>
          <span className="tag tag-pattern">External Store</span>
          <span className="tag tag-ts">Selectors</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <CounterWidget />
        <ThemeWidget />
      </div>
      <div style={{ marginTop: 16 }}>
        <TodoWidget />
      </div>

      <div className="section" style={{ marginTop: 20 }}>
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Review <code className="inline-code">createStore</code> — subscribe/getSnapshot pattern</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">useStore</code> hook dengan selector</li>
          <li><span className="task-check">☐</span> Test: ubah count, lihat apakah TodoWidget re-render (seharusnya TIDAK)</li>
          <li><span className="task-check">☐</span> Pertanyaan: apa masalah dengan selector yang return object baru tiap call? Jawab di komentar</li>
          <li><span className="task-check">☐</span> Challenge: tambah <code className="inline-code">getServerSnapshot</code> untuk SSR safety</li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>useSyncExternalStore(subscribe, getSnapshot)</code> — React subscribe ke store</li>
            <li>Selector return new object = infinite re-render! Gunakan primitive atau memoize</li>
            <li><code>getServerSnapshot</code> dipakai di SSR dimana external store belum ada</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
