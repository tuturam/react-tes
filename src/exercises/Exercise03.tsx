// ============================================================
// EXERCISE 03: Custom Hooks (Abstraction Mastery)
// Konsep: Custom hooks, hook composition, generics
// ============================================================

import { useEffect, useState } from 'react'

// ============================================================
// 📝 HOOK 1: useLocalStorage<T>
// Generic hook untuk persistent state di localStorage
// ============================================================

// TODO 1: Implementasi useLocalStorage
// - Menerima key (string) dan initialValue (T)
// - Return [storedValue, setValue] seperti useState
// - Saat setValue dipanggil, simpan ke localStorage juga
// - Saat init, baca dari localStorage dulu. Jika tidak ada, gunakan initialValue
// - Handle JSON parse error gracefully

function useLocalStorage<T>(_key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // 👇 IMPLEMENTASI DI SINI
  const getLocalStorage = () => {
    try {
      const local = localStorage.getItem(_key)
      return local?.length ? JSON.parse(local) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  }
  const [storedValue, setStoredValue] = useState<T>(() => getLocalStorage())

  const setValue = (_value: T | ((prev: T) => T)) => {
    // TODO: update state + localStorage
    setStoredValue((prev) => {
      const nextValue = typeof _value === "function"
        ? (_value as (p: T) => T)(prev)
        : _value
      // simpan ke state
      const stringify = JSON.stringify(nextValue)
      localStorage.setItem(_key, stringify)
      return nextValue
    })
  }

  return [storedValue, setValue]
}

// ============================================================
// 📝 HOOK 2: useDebounce<T>
// Generic hook untuk debounce any value
// ============================================================

// TODO 2: Implementasi useDebounce
// - Menerima value (T) dan delay (number) ms
// - Return debounced value yang hanya update setelah delay
// - Cleanup timeout di setiap perubahan value

function useDebounce<T>(value: T, _delay: number): T {
  // 👇 IMPLEMENTASI DI SINI
  const [debounceVal, setDebounceValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value)
    }, _delay);

    return () => clearTimeout(timer)
  }, [value, _delay])
  
  return debounceVal // ini salah, value seharusnya debounced
}

// ============================================================
// 📝 HOOK 3: useFetch<T>
// Generic hook untuk data fetching
// ============================================================

interface FetchState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

// TODO 3: Implementasi useFetch
// - Menerima url (string | null) — null berarti jangan fetch
// - Return { data, isLoading, error }
// - Fetch ulang setiap kali url berubah
// - Cleanup: abort jika url berubah sebelum selesai
// - Handle error gracefully

function useFetch<T>(_url: string | null): FetchState<T> {
  // 👇 IMPLEMENTASI DI SINI
  const [res, setRes] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null
  })
  
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    if (_url) {
      setRes((prev) => ({
        ...prev,
        error: null,
        isLoading: true,
        data: null
      }))
      const fetchData = async () => {
        try {
          const res = await fetch(_url, {signal})
          const result = await res.json()
          setRes((prev) => ({
            ...prev,
            data: result
          }))
        } catch (caughtError) {
          if (caughtError instanceof DOMException && caughtError.name === 'AbortError') {
            return
          }

          const message =
            caughtError instanceof Error
              ? caughtError.message
              : 'Terjadi kesalahan saat mengambil data'

          setRes((prev) => ({
            ...prev,
            error: message,
          }))
        }
        finally {
          setRes((prev) => ({
            ...prev,
            isLoading: false,
          }))
        }
      }
      fetchData()
    }
    else {
      setRes({
        data: null,
        isLoading: false,
        error: null
      })
    }
    return () => controller.abort()
  }, [_url])

  return res
}

// ============================================================
// 📝 COMPOSE HOOKS — Gunakan ketiga hook bersama
// ============================================================

// Mock data source
const API_BASE = 'https://jsonplaceholder.typicode.com'

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export default function Exercise03() {
  // TODO 4: Gunakan useLocalStorage untuk menyimpan search query
  const [searchQuery, setSearchQuery] = useLocalStorage<string>('ex03-search', '')

  // TODO 5: Gunakan useDebounce untuk debounce search query
  const debouncedQuery = useDebounce(searchQuery, 500)

  // TODO 6: Gunakan useFetch untuk fetch data berdasarkan debounced query
  const { data: posts, isLoading, error } = useFetch<Post[]>(
    debouncedQuery
      ? `${API_BASE}/posts?_limit=10&q=${encodeURIComponent(debouncedQuery)}`
      : null
  )

  // TODO 7: Gunakan useLocalStorage untuk menyimpan search history
  const [history, setHistory] = useLocalStorage<string[]>('ex03-history', [])

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (value && !history.includes(value)) {
      setHistory((prev) => [value, ...prev].slice(0, 5))
    }
  }

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 03</span>
        <h2 className="exercise-title">Custom Hooks — Abstraction Mastery</h2>
        <p className="exercise-description">
          Buat 3 custom hooks generic (<code className="inline-code">useLocalStorage</code>,{' '}
          <code className="inline-code">useDebounce</code>, <code className="inline-code">useFetch</code>)
          lalu compose bersama di satu komponen.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">Custom Hooks</span>
          <span className="tag tag-ts">Generics</span>
          <span className="tag tag-pattern">Hook Composition</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="section">
        <div className="section-title">
          <span className="icon">🔍</span> Persistent Search
        </div>
        <input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari posts... (tersimpan di localStorage)"
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
          Debounced value: "{debouncedQuery}" • {isLoading ? '⏳ Loading...' : `${posts?.length ?? 0} results`}
        </div>
      </div>

      {/* HISTORY */}
      {history.length > 0 && (
        <div className="section">
          <div className="section-title">
            <span className="icon">🕐</span> Search History (localStorage)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {history.map((h, i) => (
              <button
                key={i}
                className="btn"
                onClick={() => setSearchQuery(h)}
                style={{ fontSize: '0.78rem' }}
              >
                {h}
              </button>
            ))}
            <button className="btn" onClick={() => setHistory([])}>
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* RESULTS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📋</span> Results
        </div>
        {error && <div className="alert alert-warning">{error}</div>}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>⏳ Fetching...</div>
        )}
        {!isLoading && posts && posts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {posts.map((post) => (
              <div key={post.id} style={{
                padding: '12px 16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{post.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {post.body.slice(0, 120)}...
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && debouncedQuery && (!posts || posts.length === 0) && !error && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
            Tidak ada hasil
          </div>
        )}
      </div>

      {/* TASKS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📝</span> Yang Harus Dikerjakan
        </div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">useLocalStorage&lt;T&gt;</code> — read/write localStorage, handle parse errors</li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">useDebounce&lt;T&gt;</code> — delay value update, cleanup timeout</li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">useFetch&lt;T&gt;</code> — fetch data, loading/error, abort on URL change</li>
          <li><span className="task-check">☐</span> Verifikasi: search query persist setelah refresh halaman</li>
          <li><span className="task-check">☐</span> Verifikasi: search history persist setelah refresh</li>
          <li><span className="task-check">☐</span> Verifikasi: debounce bekerja (tidak fetch langsung saat ketik)</li>
        </ul>

        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>useLocalStorage</code>: init dengan lazy initializer <code>useState(() =&gt; {'...'} )</code></li>
            <li><code>useDebounce</code>: gunakan <code>useEffect</code> + <code>setTimeout</code> + cleanup</li>
            <li><code>useFetch</code>: gunakan <code>useEffect</code> + <code>AbortController</code> + <code>useState</code></li>
            <li>Generic <code>&lt;T&gt;</code> pada function signature memastikan type safety tanpa <code>any</code></li>
          </ul>
        </details>
      </div>
    </div>
  )
}
