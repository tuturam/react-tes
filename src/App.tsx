import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Exercise01 from './exercises/Exercise01'
import Exercise02 from './exercises/Exercise02'
import Exercise03 from './exercises/Exercise03'
import Exercise04 from './exercises/Exercise04'
import Exercise05 from './exercises/Exercise05'
import Exercise06 from './exercises/Exercise06'
import Exercise07 from './exercises/Exercise07'
import Exercise08 from './exercises/Exercise08'
import Exercise09 from './exercises/Exercise09'
import Exercise10 from './exercises/Exercise10'
import Exercise11 from './exercises/Exercise11'
import Exercise12 from './exercises/Exercise12'

const exercises = [
  { num: '01', title: 'State Management', path: '/exercise/01' },
  { num: '02', title: 'useEffect & Lifecycle', path: '/exercise/02' },
  { num: '03', title: 'Custom Hooks', path: '/exercise/03' },
  { num: '04', title: 'Context & Providers', path: '/exercise/04' },
  { num: '05', title: 'Performance', path: '/exercise/05' },
  { num: '06', title: 'Refs & Imperative', path: '/exercise/06' },
  { num: '07', title: 'Composition & Generics', path: '/exercise/07' },
  { num: '08', title: 'Suspense & Portals', path: '/exercise/08' },
  { num: '09', title: 'Controlled Forms', path: '/exercise/09' },
  { num: '10', title: 'useSyncExternalStore', path: '/exercise/10' },
  { num: '11', title: 'React 19 Features', path: '/exercise/11' },
  { num: '12', title: 'Integration Challenge', path: '/exercise/12' },
]

export default function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>⚛️ React Skill Audit</h1>
          <p>12 Exercises • TypeScript • Bun</p>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span className="nav-number">🏠</span>
            Dashboard
          </NavLink>
          {exercises.map((ex) => (
            <NavLink
              key={ex.num}
              to={ex.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-number">{ex.num}</span>
              {ex.title}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/01" element={<Exercise01 />} />
          <Route path="/exercise/02" element={<Exercise02 />} />
          <Route path="/exercise/03" element={<Exercise03 />} />
          <Route path="/exercise/04" element={<Exercise04 />} />
          <Route path="/exercise/05" element={<Exercise05 />} />
          <Route path="/exercise/06" element={<Exercise06 />} />
          <Route path="/exercise/07" element={<Exercise07 />} />
          <Route path="/exercise/08" element={<Exercise08 />} />
          <Route path="/exercise/09" element={<Exercise09 />} />
          <Route path="/exercise/10" element={<Exercise10 />} />
          <Route path="/exercise/11" element={<Exercise11 />} />
          <Route path="/exercise/12" element={<Exercise12 />} />
        </Routes>
      </main>
    </div>
  )
}
