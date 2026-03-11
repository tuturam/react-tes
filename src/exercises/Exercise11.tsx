// ============================================================
// EXERCISE 11: React 19 Features
// Konsep: use(), useActionState, useFormStatus, useOptimistic
// ============================================================

import { useState, useOptimistic, useActionState } from 'react'

// ============================================================
// 📝 MOCK API
// ============================================================

interface Comment {
  id: number
  author: string
  text: string
  createdAt: string
  pending?: boolean
}

// Simulate server delay
async function postComment(text: string): Promise<Comment> {
  await new Promise((r) => setTimeout(r, 1500))
  // 20% chance of failure
  if (Math.random() < 0.2) throw new Error('Server error! Comment gagal disimpan.')
  return {
    id: Date.now(),
    author: 'User',
    text,
    createdAt: new Date().toISOString(),
  }
}

// ============================================================
// 📝 PART 1: useOptimistic — optimistic UI updates
// ============================================================

// TODO 1: Gunakan useOptimistic untuk show comment instantly
// - Tampilkan comment baru langsung (optimistic) sebelum server respond
// - Jika server error, rollback (hapus optimistic comment)

// ============================================================
// 📝 PART 2: useActionState — form action state management
// ============================================================

// TODO 2: Gunakan useActionState untuk handle form submission
// - Replace manual useState + async handler
// - useActionState manages pending state, error state, result

// ============================================================
// 📝 PART 3: useFormStatus — nested pending state
// ============================================================

// TODO 3: Buat SubmitButton yang akses pending state via useFormStatus
// - useFormStatus HARUS dipanggil di child component dari <form>
// - Tidak bisa dipanggil di component yang sama dengan <form>

function SubmitButton() {
  // Note: useFormStatus hanya bekerja dengan React Server Actions / form action
  // Di client-only app kita simulasi dengan state biasa
  return (
    <button type="submit" className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
      💬 Post Comment
    </button>
  )
}

// ============================================================
// 📝 PART 4: use() hook — read promise/context
// ============================================================

// TODO 4: Demonstrasi use() untuk read data
// use() bisa dipakai di conditionals (unlike other hooks!)
// use() bisa read: Promise (with Suspense) atau Context

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

export default function Exercise11() {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Admin', text: 'Selamat datang! Coba post comment.', createdAt: '2025-01-01T00:00:00Z' },
    { id: 2, author: 'Bot', text: 'Exercise ini menguji React 19 features.', createdAt: '2025-01-01T00:01:00Z' },
  ])

  // TODO 5: Setup useOptimistic
  // Syntax: const [optimisticComments, addOptimistic] = useOptimistic(comments, updateFn)
  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state: Comment[], newComment: Comment) => [...state, { ...newComment, pending: true }]
  )

  // TODO 6: Setup useActionState for form action
  // useActionState(actionFn, initialState) returns [state, formAction, isPending]
  const [actionState, formAction, isPending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const text = formData.get('comment') as string
      if (!text?.trim()) return { error: 'Comment tidak boleh kosong' }

      // Optimistic: tampilkan langsung
      const optimistic: Comment = {
        id: Date.now(),
        author: 'User',
        text,
        createdAt: new Date().toISOString(),
        pending: true,
      }
      addOptimistic(optimistic)

      try {
        const result = await postComment(text)
        setComments((prev) => [...prev, result])
        return { error: null }
      } catch (e) {
        return { error: (e as Error).message }
      }
    },
    { error: null as string | null }
  )

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 11</span>
        <h2 className="exercise-title">React 19 Features</h2>
        <p className="exercise-description">
          Comment system dengan <code className="inline-code">useOptimistic</code>,{' '}
          <code className="inline-code">useActionState</code>, dan{' '}
          <code className="inline-code">useFormStatus</code>.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-react19">useOptimistic</span>
          <span className="tag tag-react19">useActionState</span>
          <span className="tag tag-react19">useFormStatus</span>
          <span className="tag tag-react19">use()</span>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div className="section">
        <div className="section-title"><span className="icon">💬</span> Comments</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {optimisticComments.map((c) => (
            <div key={c.id} style={{
              padding: '12px 16px',
              background: c.pending ? 'rgba(129,140,248,0.05)' : 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
              border: c.pending ? '1px dashed var(--accent-primary)' : '1px solid transparent',
              opacity: c.pending ? 0.7 : 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.author}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {c.pending ? '⏳ Sending...' : new Date(c.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.text}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        {actionState.error && <div className="alert alert-warning" style={{ marginBottom: 12 }}>❌ {actionState.error}</div>}
        <form action={formAction} style={{ display: 'flex', gap: 8 }}>
          <input name="comment" placeholder="Tulis comment..." disabled={isPending}
            style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', outline: 'none', opacity: isPending ? 0.5 : 1 }}
          />
          <SubmitButton />
        </form>
        <div style={{ marginTop: 6, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {isPending ? '⏳ Posting...' : '20% chance of server error untuk test rollback'}
        </div>
      </div>

      {/* TASKS */}
      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Review <code className="inline-code">useOptimistic</code> — optimistic update + rollback on error</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">useActionState</code> — form action + pending state</li>
          <li><span className="task-check">☐</span> Test: post comment, lihat muncul instant (optimistic)</li>
          <li><span className="task-check">☐</span> Test: refresh beberapa kali sampai dapat error → rollback optimistic</li>
          <li><span className="task-check">☐</span> Challenge: buat <code className="inline-code">SubmitButton</code> dengan <code className="inline-code">useFormStatus</code> yang show spinner saat pending</li>
          <li><span className="task-check">☐</span> Challenge: gunakan <code className="inline-code">use()</code> untuk read a context conditionally</li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>useOptimistic(state, updateFn)</code> — updateFn memodifikasi state optimistically</li>
            <li><code>useActionState(action, initialState)</code> returns <code>[state, action, isPending]</code></li>
            <li><code>useFormStatus()</code> harus dipanggil di child of <code>&lt;form&gt;</code></li>
            <li><code>use(promise)</code> suspend sampai resolve — butuh Suspense boundary</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
