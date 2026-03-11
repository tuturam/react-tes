import { Link } from 'react-router-dom'

const exercises = [
  { num: '01', title: 'State Management Mastery', desc: 'useState, useReducer, discriminated unions, keys & reconciliation', path: '/exercise/01', difficulty: 2 },
  { num: '02', title: 'useEffect & Lifecycle', desc: 'Effect cleanup, AbortController, race conditions, Strict Mode', path: '/exercise/02', difficulty: 2 },
  { num: '03', title: 'Custom Hooks', desc: 'Hook composition, generics, useLocalStorage, useDebounce, useFetch', path: '/exercise/03', difficulty: 3 },
  { num: '04', title: 'Context & Providers', desc: 'createContext, Provider pattern, state colocation, lifting state', path: '/exercise/04', difficulty: 3 },
  { num: '05', title: 'Performance Optimization', desc: 'React.memo, useMemo, useCallback, useDeferredValue', path: '/exercise/05', difficulty: 3 },
  { num: '06', title: 'Refs & Imperative Handle', desc: 'useRef, forwardRef, useImperativeHandle, useId, flushSync', path: '/exercise/06', difficulty: 3 },
  { num: '07', title: 'Composition & Generics', desc: 'Generic components, compound pattern, HOC, React.Children', path: '/exercise/07', difficulty: 4 },
  { num: '08', title: 'Suspense & Portals', desc: 'React.lazy, Suspense, ErrorBoundary, useTransition, createPortal', path: '/exercise/08', difficulty: 4 },
  { num: '09', title: 'Controlled Forms', desc: 'Multi-step forms, validation, TypeScript utility types', path: '/exercise/09', difficulty: 3 },
  { num: '10', title: 'useSyncExternalStore', desc: 'External store subscription, custom Redux-like store', path: '/exercise/10', difficulty: 4 },
  { num: '11', title: 'React 19 Features', desc: 'use(), useActionState, useFormStatus, useOptimistic', path: '/exercise/11', difficulty: 4 },
  { num: '12', title: 'Integration Challenge', desc: 'Semua konsep digabung — mini Task Manager app', path: '/exercise/12', difficulty: 5 },
]

function DifficultyDots({ level }: { level: number }) {
  return (
    <div className="difficulty" style={{ marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`difficulty-dot ${i <= level ? 'filled' : ''} ${level >= 4 ? 'hard' : level >= 3 ? 'medium' : ''}`}
        />
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>React Skill Audit</h1>
        <p>
          12 latihan mendalam untuk mengaudit pemahamanmu tentang seluruh core
          React API, patterns, dan TypeScript. Kerjakan dari awal sampai akhir.
        </p>
      </div>
      <div className="exercise-grid">
        {exercises.map((ex) => (
          <Link key={ex.num} to={ex.path} className="exercise-card">
            <div className="card-number">EXERCISE {ex.num}</div>
            <h3>{ex.title}</h3>
            <p>{ex.desc}</p>
            <DifficultyDots level={ex.difficulty} />
          </Link>
        ))}
      </div>
    </div>
  )
}
