// ============================================================
// EXERCISE 06: Refs & Imperative Handle
// Konsep: useRef, forwardRef, useImperativeHandle, useId, flushSync
// ============================================================

import { useState, useRef, forwardRef, useImperativeHandle, useId, type Ref } from 'react'
import { flushSync } from 'react-dom'

// ============================================================
// 📝 PART 1: Custom Video Player dengan forwardRef + useImperativeHandle
// ============================================================

// TODO 1: Definisikan interface untuk imperative API yang di-expose
interface VideoPlayerHandle {
  play: () => void
  pause: () => void
  seekTo: (time: number) => void
  getCurrentTime: () => number
}

// TODO 2: Implementasi VideoPlayer dengan forwardRef + useImperativeHandle
// - forwardRef untuk menerima ref dari parent
// - useImperativeHandle untuk expose custom API (bukan raw DOM element)
// - useRef internal untuk akses <video> element
// - useRef untuk track playback position TANPA re-render

const VideoPlayer = forwardRef(function VideoPlayer(
  _props: { src?: string },
  ref: Ref<VideoPlayerHandle>
) {
  const videoRef = useRef<HTMLVideoElement>(null)
  // useRef untuk mutable value tanpa re-render
  const _positionRef = useRef(0)

  // TODO 3: Implementasi useImperativeHandle
  useImperativeHandle(ref, () => ({
    play: () => {
      // 👇 IMPLEMENTASI
    },
    pause: () => {
      // 👇 IMPLEMENTASI
    },
    seekTo: (_time: number) => {
      // 👇 IMPLEMENTASI
    },
    getCurrentTime: () => {
      // 👇 IMPLEMENTASI
      return 0
    },
  }))

  return (
    <div style={{ background: 'var(--bg-code)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', display: 'block' }}
        src={_props.src || 'https://www.w3schools.com/html/mov_bbb.mp4'}
      />
    </div>
  )
})

// ============================================================
// 📝 PART 2: useId untuk accessible IDs
// ============================================================

// TODO 4: Gunakan useId untuk generate IDs unik
// Kenapa useId, bukan Math.random()? Jawab di komentar:
//
//

function AccessibleForm() {
  const id = useId()
  // TODO: gunakan id untuk htmlFor dan id pada input fields

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label htmlFor={`${id}-name`} style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
          Full Name
        </label>
        <input id={`${id}-name`} type="text" placeholder="John Doe" aria-describedby={`${id}-name-hint`}
          style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}
        />
        <p id={`${id}-name-hint`} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
          Used for your profile display
        </p>
      </div>
      <div>
        <label htmlFor={`${id}-email`} style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
          Email Address
        </label>
        <input id={`${id}-email`} type="email" placeholder="john@example.com" aria-labelledby={`${id}-email`}
          style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', outline: 'none' }}
        />
      </div>
    </div>
  )
}

// ============================================================
// 📝 PART 3: flushSync demo
// ============================================================

function FlushSyncDemo() {
  const [items, setItems] = useState<string[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  // TODO 5: Tanpa flushSync, scroll tidak ke posisi terbaru karena setState async.
  // Gunakan flushSync untuk force synchronous update lalu scroll.
  const addItem = () => {
    const newItem = `Item ${items.length + 1}`

    // ❌ TANPA flushSync: setState async, scroll terjadi SEBELUM DOM update
    // setItems(prev => [...prev, newItem])
    // listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })

    // ✅ DENGAN flushSync: setState synchronous, DOM updated, BARU scroll
    // TODO: implementasi dengan flushSync
    flushSync(() => {
      setItems(prev => [...prev, newItem])
    })
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={addItem}>Add Item + Scroll</button>
      <div ref={listRef} style={{ maxHeight: 150, overflowY: 'auto', marginTop: 12, background: 'var(--bg-code)', borderRadius: 'var(--radius-sm)', padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '6px 10px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.82rem' }}>{item}</div>
        ))}
        {items.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: 16 }}>Click button to add items</div>}
      </div>
    </div>
  )
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

export default function Exercise06() {
  const playerRef = useRef<VideoPlayerHandle>(null)

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 06</span>
        <h2 className="exercise-title">Refs & Imperative Handle</h2>
        <p className="exercise-description">
          Bangun custom Video Player dengan <code className="inline-code">forwardRef</code> +{' '}
          <code className="inline-code">useImperativeHandle</code>. Pelajari <code className="inline-code">useId</code> dan{' '}
          <code className="inline-code">flushSync</code>.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">useRef</span><span className="tag tag-hook">forwardRef</span>
          <span className="tag tag-hook">useImperativeHandle</span><span className="tag tag-hook">useId</span>
          <span className="tag tag-hook">flushSync</span>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">🎬</span> Video Player (Imperative API)</div>
        <VideoPlayer ref={playerRef} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn" onClick={() => playerRef.current?.play()}>▶ Play</button>
          <button className="btn" onClick={() => playerRef.current?.pause()}>⏸ Pause</button>
          <button className="btn" onClick={() => playerRef.current?.seekTo(0)}>⏮ Start</button>
          <button className="btn" onClick={() => alert(`Time: ${playerRef.current?.getCurrentTime()}s`)}>⏱ Time</button>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">🆔</span> useId — Accessible Forms</div>
        <AccessibleForm />
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">⚡</span> flushSync Demo</div>
        <FlushSyncDemo />
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">useImperativeHandle</code> di VideoPlayer</li>
          <li><span className="task-check">☐</span> Gunakan <code className="inline-code">useRef</code> untuk track position tanpa re-render</li>
          <li><span className="task-check">☐</span> Jawab: kenapa <code className="inline-code">useId</code> bukan <code className="inline-code">Math.random()</code>?</li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">flushSync</code> untuk synchronous scroll</li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>useImperativeHandle</code> arg kedua return object dengan methods</li>
            <li><code>useId</code> is SSR-safe dan deterministic, <code>Math.random()</code> mismatch di hydration</li>
            <li><code>flushSync</code> force React to flush DOM updates synchronously</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
