// ============================================================
// EXERCISE 01: State Management Mastery
// Konsep: useState, useReducer, TypeScript discriminated unions,
//         keys & reconciliation
// ============================================================

import { useReducer, useState } from 'react'

// ============================================================
// 📝 TIPE DATA — Lengkapi type definitions di bawah
// ============================================================

type TaskStatus = 'todo' | 'in-progress' | 'done'

interface Task {
  id: string
  title: string
  status: TaskStatus
}

interface TaskCardProps {
  task: Task
  onMove: (task: Task) => void
  onDelete: (taskId: string) => void
}

// TODO 1: Definisikan Action type menggunakan discriminated union
// Harus support: ADD_TASK, MOVE_TASK, DELETE_TASK
// Contoh pattern:
//   type Action =
//     | { type: 'ADD_TASK'; payload: ... }
//     | { type: 'MOVE_TASK'; payload: ... }
//     | ...

type Action = 
  | {type: 'ADD_TASK'; payload: Task}
  | {type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus }}
  | {type: 'DELETE_TASK'; payload: { taskId: string }}
  | {type: 'UPDATE_TITLE'; payload: { taskId: string; newTitle: string } }

function getNextStatus(status: TaskStatus): TaskStatus {
  if (status === 'todo') return 'in-progress'
  if (status === 'in-progress') return 'done'
  return 'todo'
}

function TaskCard({ task, onMove, onDelete }: TaskCardProps) {
  // Local draft sengaja tidak disimpan di reducer agar efek reconciliation terlihat jelas.
  const [draftNote, setDraftNote] = useState(`catatan: ${task.title}`)

  return (
    <div
      style={{
        padding: '10px 12px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.85rem',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <strong>{task.title}</strong>

      <input
        value={draftNote}
        onChange={(e) => setDraftNote(e.target.value)}
        placeholder="Catatan lokal (khusus komponen ini)"
        style={{
          width: '100%',
          padding: '6px 8px',
          background: 'var(--bg-code)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.78rem',
        }}
      />

      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={() => onMove(task)}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          Move →
        </button>
        <button
          onClick={() => onDelete(task.id)}
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ============================================================
// 📝 REDUCER — Implementasi reducer function
// ============================================================

// TODO 2: Implementasi reducer yang handle semua action types
// Ingat: reducer harus PURE function, return state baru (immutable)
function taskReducer(state: Task[], action: Action): Task[] {
  // 👇 IMPLEMENTASI DI SINI
  switch (action.type) {
    case 'ADD_TASK':
      return [...state, action.payload]
    case 'MOVE_TASK':
      return state.map(task => 
        task.id === action.payload.taskId ? { ...task, status: action.payload.newStatus } : task
      )
    case 'DELETE_TASK':
      return state.filter(task => task.id !== action.payload.taskId)
    case 'UPDATE_TITLE':
      return state.map(task => 
        task.id === action.payload.taskId ? { ...task, title: action.payload.newTitle } : task
      )
    default:
      return state
  }
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

export default function Exercise01() {
  // TODO 3: Setup useReducer dengan taskReducer
  const [tasks, dispatch] = useReducer(taskReducer, [] as Task[])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [useIndexKey, setUseIndexKey] = useState(true)

  // TODO 4: Implementasi handleAddTask
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return
    // 👇 DISPATCH ADD_TASK action di sini
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: crypto.randomUUID(),
        title: newTaskTitle,
        status: 'todo'
      }
    })
    setNewTaskTitle('')
  }

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: 'todo', label: '📋 Todo', color: '#818cf8' },
    { status: 'in-progress', label: '🔄 In Progress', color: '#fbbf24' },
    { status: 'done', label: '✅ Done', color: '#34d399' },
  ]

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 01</span>
        <h2 className="exercise-title">State Management Mastery</h2>
        <p className="exercise-description">
          Bangun Kanban Board mini menggunakan <code className="inline-code">useReducer</code> dengan
          TypeScript discriminated unions. Pelajari mengapa <code className="inline-code">key</code> penting
          dalam reconciliation React.
        </p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-hook">useState</span>
          <span className="tag tag-hook">useReducer</span>
          <span className="tag tag-ts">Discriminated Unions</span>
          <span className="tag tag-pattern">Keys & Reconciliation</span>
        </div>
      </div>

      {/* TASK INPUT */}
      <div className="section">
        <div className="section-title">
          <span className="icon">➕</span> Tambah Task Baru
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Ketik task baru..."
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--bg-code)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
          <button className="btn btn-primary" onClick={handleAddTask}>
            Tambah
          </button>
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
            <input
              type="checkbox"
              checked={useIndexKey}
              onChange={(e) => setUseIndexKey(e.target.checked)}
            />
            Gunakan key=index (mode buggy)
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Matikan checkbox untuk pakai key=id (mode benar)
          </span>
        </div>
      </div>

      {/* KANBAN COLUMNS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status)
          return (
            <div key={col.status} className="section" style={{ borderTop: `3px solid ${col.color}` }}>
              <div className="section-title">
                {col.label}
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {colTasks.length}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 80 }}>
                {colTasks.map((task, index) => (
                  <TaskCard
                    key={useIndexKey ? index : task.id}
                    task={task}
                    onMove={(currentTask) =>
                      dispatch({
                        type: 'MOVE_TASK',
                        payload: { taskId: currentTask.id, newStatus: getNextStatus(currentTask.status) },
                      })
                    }
                    onDelete={(taskId) => dispatch({ type: 'DELETE_TASK', payload: { taskId } })}
                  />
                ))}
                {colTasks.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textAlign: 'center', padding: 20 }}>
                    Kosong
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* CODE INSTRUCTIONS */}
      <div className="section">
        <div className="section-title">
          <span className="icon">📝</span> Yang Harus Dikerjakan
        </div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Definisikan <code className="inline-code">Action</code> type dengan discriminated union (ADD_TASK, MOVE_TASK, DELETE_TASK)</li>
          <li><span className="task-check">☐</span> Implementasi <code className="inline-code">taskReducer</code> — pure function, immutable state updates</li>
          <li><span className="task-check">☐</span> Wire up <code className="inline-code">dispatch</code> ke handleAddTask</li>
          <li><span className="task-check">☐</span> Tambahkan tombol Move (→ kolom berikutnya) dan Delete di setiap task</li>
          <li><span className="task-check">☐</span> Eksperimen: ganti <code className="inline-code">key=&#123;task.id&#125;</code> dengan <code className="inline-code">key=&#123;index&#125;</code>, amati perbedaan behavior saat reorder/delete</li>
        </ul>

        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li>Gunakan <code>crypto.randomUUID()</code> untuk generate unique ID</li>
            <li>Discriminated union: setiap action punya <code>type</code> literal yang berbeda</li>
            <li>Reducer harus return array baru, gunakan <code>.map()</code>, <code>.filter()</code>, spread operator</li>
            <li>Edit catatan lokal di beberapa card, lalu hapus atau pindah task. Bandingkan mode key=index vs key=id</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
