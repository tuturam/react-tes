// ============================================================
// EXERCISE 04: Context + Provider Pattern
// Konsep: createContext, useContext, provider pattern,
//         state colocation, lifting state up
// ============================================================

import { createContext, useContext, useReducer, useEffect, type ReactNode, useState } from 'react'

// ============================================================
// 📝 PART 1: THEME CONTEXT
// ============================================================

// TODO 1: Definisikan types untuk ThemeContext
type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

// TODO 2: Buat ThemeContext dengan createContext
// JANGAN gunakan `as any` — gunakan type yang benar
// Pertanyaan: apa perbedaan createContext(undefined) vs createContext(null)?
const ThemeContext = createContext<ThemeContextType | null>(null) // 👈 ini pattern yang benar? pikirkan.

// TODO 3: Buat custom hook useTheme yang throw error jika dipakai di luar provider
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  // 👇 IMPLEMENTASI: throw error jika null
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// TODO 4: Implementasi ThemeProvider
function ThemeProvider({ children }: { children: ReactNode }) {
  // 👇 IMPLEMENTASI: state management untuk theme
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light'
  })
  // Bonus: simpan preference ke localStorage
  const _theme: Theme = theme
  const _toggleTheme = () => {
    // TODO: toggle antara 'dark' dan 'light'
    setTheme((prev) => {
      const nextTime = prev === 'dark' ? 'light' : 'dark'

      localStorage.setItem('theme', nextTime)
      return nextTime
    })
  }

  return (
    <ThemeContext.Provider value={{ theme: _theme, toggleTheme: _toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================================
// 📝 PART 2: NOTIFICATION CONTEXT
// ============================================================

interface Notification {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  createdAt: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (message: string, type: Notification['type']) => void
  removeNotification: (id: string) => void
}

// TODO 5: Definisikan Action type untuk notification reducer
type NotificationAction = 
  | { type: 'ADD', payload: Notification } 
  | { type: 'REMOVE', payload: { id: string } } 
  // 👈 GANTI: discriminated union ADD | REMOVE

// TODO 6: Implementasi notificationReducer
function notificationReducer(state: Notification[], action: NotificationAction): Notification[] {
  console.log(action) // hapus setelah implementasi
  switch (action.type) {
    case 'ADD': 
      return [...state, action.payload]
    case 'REMOVE':
      return state.filter((state) => state.id !== action.payload.id)
    default:
      return state
  }
}

// TODO 7: Buat NotificationContext
const NotificationContext = createContext<NotificationContextType | null>(null)

function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

// TODO 8: Implementasi NotificationProvider
// - Auto-dismiss notification setelah 3 detik
// - Gunakan useEffect untuk auto-dismiss
function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, dispatch] = useReducer(notificationReducer, [])

  const addNotification = (_message: string, _type: Notification['type']) => {
    // TODO: dispatch ADD action
    console.log(dispatch) // hapus setelah implementasi
    dispatch({
      type: 'ADD',
      payload: {
        createdAt: Date.now(),
        id: crypto.randomUUID(),
        message: _message,
        type: 'success'
      }
    })
  }

  const removeNotification = (_id: string) => {
    // TODO: dispatch REMOVE action
    dispatch({
      type: 'REMOVE',
      payload: {
        id: _id,
      }
    })
  }

  useEffect(() => {
    // Array untuk simpan timeout IDs (buat bisa di-clear nanti)
    const timeoutIds: ReturnType<typeof setTimeout>[] = []
    
    // Loop setiap notifikasi
    notifications.forEach((notification) => {
      // Set timeout 3 detik
      const timeoutId = setTimeout(() => {
        removeNotification(notification.id)
      }, 3000) // 3000 ms = 3 detik
      
      timeoutIds.push(timeoutId)
    })

    // Cleanup function — clear semua timeout
    // Dipanggil saat: dependencies berubah ATAU component unmount
    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
    }
  }, [notifications, removeNotification])

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

// ============================================================
// 📝 PART 3: KOMPONEN-KOMPONEN (nested deep)
// ============================================================

// Komponen ini DEEPLY NESTED — harus akses context tanpa prop drilling

function Header() {
  // TODO 10: Consume ThemeContext di sini
  const _theme = useTheme()

  return (
    <div style={{
      padding: '12px 16px',
      background: 'var(--bg-tertiary)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    }}>
      <span style={{ fontWeight: 600 }}>App Header</span>
      <button className="btn" onClick={_theme.toggleTheme}>
        {_theme.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode
      </button>
    </div>
  )
}

function NotificationPanel() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`alert alert-${n.type === 'success' ? 'success' : n.type === 'error' ? 'warning' : 'info'}`}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{n.message}</span>
          <button
            onClick={() => removeNotification(n.id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

function ActionButtons() {
  const { addNotification } = useNotifications()

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button className="btn" onClick={() => addNotification('Berhasil menyimpan!', 'success')}>
        ✅ Success
      </button>
      <button className="btn" onClick={() => addNotification('Terjadi error!', 'error')}>
        ❌ Error
      </button>
      <button className="btn" onClick={() => addNotification('Informasi penting', 'info')}>
        ℹ️ Info
      </button>
    </div>
  )
}

// ============================================================
// 📝 PART 4: STATE COLOCATION CHALLENGE
// ============================================================

// TODO 11: Diberikan kode di bawah, tentukan:
// - Mana state yang seharusnya di-colocate (keep lokal)?
// - Mana state yang perlu di-lift up?
// - Mana state yang perlu Context?

// Jawab di komentar:
// parentCount → ???
// childInput → ???
// theme → ???
// notifications → ???

function ColocationDemo() {
  // State ini ada di parent. Apakah ini tempat yang benar?
  const [parentCount, setParentCount] = useState(0)

  return (
    <div className="section" style={{ marginTop: 12 }}>
      <div className="section-title">
        <span className="icon">🎯</span> State Colocation Challenge
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
        Analisis: di mana seharusnya setiap state berada? Tulis jawaban di komentar kode.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn" onClick={() => setParentCount(c => c + 1)}>
          Parent Count: {parentCount}
        </button>
        <ChildWithInput />
      </div>
    </div>
  )
}

function ChildWithInput() {
  // State ini hanya dipakai oleh child ini sendiri
  const [childInput, setChildInput] = useState('')
  return (
    <input
      value={childInput}
      onChange={(e) => setChildInput(e.target.value)}
      placeholder="Child-only input"
      style={{
        padding: '8px 12px',
        background: 'var(--bg-code)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.82rem',
        outline: 'none',
      }}
    />
  )
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

export default function Exercise04() {
  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 04</span>
        <h2 className="exercise-title">Context & Provider Pattern</h2>
        <p className="exercise-description">
          Bangun Theme + Notification system menggunakan{' '}
          <code className="inline-code">createContext</code> dan nested providers.
          Pelajari state colocation vs lifting state vs Context.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">createContext</span>
          <span className="tag tag-hook">useContext</span>
          <span className="tag tag-pattern">Provider Pattern</span>
          <span className="tag tag-pattern">State Colocation</span>
        </div>
      </div>

      {/* DEMO AREA — wrapped in providers */}
      <div className="section">
        <div className="section-title">
          <span className="icon">🎨</span> Demo Area
        </div>
        <ThemeProvider>
          <NotificationProvider>
            <Header />
            <NotificationPanel />
            <ActionButtons />
          </NotificationProvider>
        </ThemeProvider>
      </div>

      <ColocationDemo />

      {/* TASKS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📝</span> Yang Harus Dikerjakan
        </div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">ThemeProvider</code> — state + toggle + localStorage persistence</li>
          <li><span className="task-check">☐</span> Definisikan <code className="inline-code">NotificationAction</code> discriminated union</li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">notificationReducer</code></li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">NotificationProvider</code> dengan auto-dismiss (3 detik)</li>
          <li><span className="task-check">☐</span> Jawab pertanyaan State Colocation di komentar</li>
          <li><span className="task-check">☐</span> Pastikan TIDAK ada <code className="inline-code">any</code> type di seluruh file</li>
        </ul>

        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li>Pattern terbaik: <code>createContext&lt;T | null&gt;(null)</code> + custom hook yang throw jika null</li>
            <li>Auto-dismiss: <code>useEffect</code> yang set timeout untuk setiap notification, cleanup semua timeout</li>
            <li>State colocation: jika state hanya dipakai 1 komponen, taruh di komponen itu (jangan lift up)</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
