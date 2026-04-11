// ============================================================
// EXERCISE 02: useEffect & Lifecycle Mastery
// Konsep: useEffect deps, cleanup, AbortController,
//         race conditions, Strict Mode awareness
// ============================================================

import { useState, useEffect } from 'react'

// ============================================================
// 📝 MOCK API — Jangan ubah bagian ini
// ============================================================

interface User {
  id: number
  name: string
  email: string
  company: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Ahmad Rizky', email: 'ahmad@mail.com', company: 'TechCorp' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti@mail.com', company: 'DataFlow' },
  { id: 3, name: 'Budi Santoso', email: 'budi@mail.com', company: 'WebDev Inc' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@mail.com', company: 'CloudBase' },
  { id: 5, name: 'Eko Prasetyo', email: 'eko@mail.com', company: 'AI Labs' },
  { id: 6, name: 'Fitri Handayani', email: 'fitri@mail.com', company: 'TechCorp' },
  { id: 7, name: 'Gilang Ramadhan', email: 'gilang@mail.com', company: 'DataFlow' },
  { id: 8, name: 'Hana Pertiwi', email: 'hana@mail.com', company: 'WebDev Inc' },
]

// Simulasi API call dengan delay random (untuk test race condition)
function mockFetchUsers(query: string, signal: AbortSignal): Promise<User[]> {
  return new Promise((resolve, reject) => {
    const delay = Math.random() * 1500 + 500 // 500-2000ms
    const timeout = setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      const filtered = MOCK_USERS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.company.toLowerCase().includes(query.toLowerCase())
      )
      resolve(filtered)
    }, delay)

    signal.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

// ============================================================
// 📝 KOMPONEN UTAMA — Implementasi di sini
// ============================================================

export default function Exercise02() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchCount, setFetchCount] = useState(0)

  // TODO 1: Implementasi useEffect dengan debounce + AbortController
  // Requirements:
  // - Debounce 300ms: jangan fetch langsung saat user ketik
  // - Gunakan AbortController untuk cancel request sebelumnya
  // - Handle race condition: jika user ketik "ab" lalu "abc",
  //   response "ab" yang datang belakangan TIDAK boleh overwrite "abc"
  // - Set loading state yang benar
  // - Handle AbortError (jangan tampilkan sebagai error)
  // - CLEANUP: clear timeout dan abort controller di cleanup function

  useEffect(() => {
    // 👇 IMPLEMENTASI DI SINI

    // Step 1: Jika query kosong, reset results dan return
    // Step 2: Buat AbortController
    // Step 3: Set timeout 300ms (debounce)
    // Step 4: Di dalam timeout, call mockFetchUsers(query, signal)
    // Step 5: Handle response — set results, loading, error
    // Step 6: Catch — jika AbortError, abaikan. Jika error lain, set error state
    // Step 7: Return cleanup function — clear timeout, abort controller

    if (!query) {
      setResults([])
      setError(null)
      return
    }
    const controller = new AbortController()
    const signal = controller.signal

    const debounceId = setTimeout(() => {
      setIsLoading(true)
      setError(null)
      mockFetchUsers(query, signal).then((users) => {
        setResults(users)
        setIsLoading(false)
        setFetchCount((c) => c + 1)
      }).catch((err) => {
        if (err.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          setError(err.message)
          setIsLoading(false)
        }
      })
    })

    return () => {
      clearTimeout(debounceId)
      controller.abort()
    }
  }, [query])

  // TODO 2: Jelaskan di komentar: mengapa useEffect dipanggil 2x
  // di Strict Mode? Apakah ini bug? Apa tujuannya?
  // Jawab:
  // strict mode 2x bukan karena bug, tapi untuk bantu develop re render
  //
  //

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 02</span>
        <h2 className="exercise-title">useEffect & Lifecycle Mastery</h2>
        <p className="exercise-description">
          Bangun Live Search dengan <code className="inline-code">useEffect</code>, debounce,
          dan <code className="inline-code">AbortController</code>. Pelajari cara handle race conditions
          dan mengapa Strict Mode menjalankan effect 2x.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">useEffect</span>
          <span className="tag tag-pattern">AbortController</span>
          <span className="tag tag-pattern">Debounce</span>
          <span className="tag tag-pattern">Race Condition</span>
          <span className="tag tag-pattern">Strict Mode</span>
        </div>
      </div>

      {/* SEARCH INPUT */}
      <div className="section">
        <div className="section-title">
          <span className="icon">🔍</span> Live Search
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari user berdasarkan nama, email, atau company..."
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'var(--bg-code)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.9rem',
            outline: 'none',
          }}
        />
        <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Fetch count: {fetchCount} • {isLoading ? '⏳ Loading...' : `${results.length} results`}
        </div>
      </div>

      {/* RESULTS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📋</span> Results
        </div>
        {error && (
          <div className="alert alert-warning">{error}</div>
        )}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1.5rem' }}>⏳</span>
            <p style={{ marginTop: 8, fontSize: '0.85rem' }}>Searching...</p>
          </div>
        )}
        {!isLoading && !error && results.length === 0 && query && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <p style={{ marginTop: 8, fontSize: '0.85rem' }}>Tidak ada hasil untuk "{query}"</p>
          </div>
        )}
        {!isLoading && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((user) => (
              <div
                key={user.id}
                style={{
                  padding: '12px 16px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
                <span
                  style={{
                    padding: '3px 10px',
                    background: 'var(--accent-glow)',
                    borderRadius: 50,
                    fontSize: '0.72rem',
                    color: 'var(--accent-primary)',
                    fontWeight: 600,
                  }}
                >
                  {user.company}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TASKS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📝</span> Yang Harus Dikerjakan
        </div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">useEffect</code> dengan debounce 300ms</li>
          <li><span className="task-check">☐</span> Gunakan <code className="inline-code">AbortController</code> untuk cancel request sebelumnya</li>
          <li><span className="task-check">☐</span> Handle race condition — response lama tidak boleh overwrite response baru</li>
          <li><span className="task-check">☐</span> Set loading/error state dengan benar</li>
          <li><span className="task-check">☐</span> Handle <code className="inline-code">AbortError</code> secara silent (jangan tampilkan sebagai error)</li>
          <li><span className="task-check">☐</span> Cleanup function: clear timeout + abort controller</li>
          <li><span className="task-check">☐</span> Jawab pertanyaan tentang Strict Mode di komentar</li>
        </ul>

        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>const controller = new AbortController()</code> lalu pass <code>controller.signal</code> ke fetch</li>
            <li>Cleanup return: <code>{'return () => { clearTimeout(id); controller.abort() }'}</code></li>
            <li>Race condition solved: karena cleanup abort request lama setiap kali dependency berubah</li>
            <li>Strict Mode re-runs effects untuk detect impure effects — bukan bug, tapi feature untuk quality assurance</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
