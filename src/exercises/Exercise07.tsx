// ============================================================
// EXERCISE 07: Component Composition & TypeScript Generics
// Konsep: Generic components, compound components,
//         HOC, React.Children, cloneElement, polymorphic as
// ============================================================

import { useState, createContext, useContext, Children, cloneElement, isValidElement, type ReactNode, type ReactElement, type ComponentPropsWithoutRef, type ElementType } from 'react'

// ============================================================
// 📝 PART 1: Generic DataTable<T>
// ============================================================

// TODO 1: Definisikan ColumnDef<T> — config untuk setiap kolom
interface ColumnDef<T> {
  key: keyof T & string
  header: string
  render?: (value: T[keyof T], item: T) => ReactNode  // render prop
}

// TODO 2: Definisikan props untuk DataTable — harus generic!
interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onSort?: (key: keyof T & string) => void
  sortKey?: keyof T & string
  sortDir?: 'asc' | 'desc'
}

// TODO 3: Implementasi generic DataTable component
function DataTable<T extends Record<string, unknown>>({
  data, columns, onSort, sortKey, sortDir,
}: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} onClick={() => onSort?.(col.key)}
                style={{ padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: onSort ? 'pointer' : 'default', userSelect: 'none', fontWeight: 600 }}>
                {col.header} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '10px 14px' }}>
                  {/* TODO 4: Gunakan col.render jika ada, otherwise tampilkan value langsung */}
                  {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================
// 📝 PART 2: Compound Components — Tabs
// ============================================================

// TODO 5: Buat Tabs compound component menggunakan Context
interface TabsContextType { activeTab: string; setActiveTab: (tab: string) => void }
const TabsContext = createContext<TabsContextType | null>(null)

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  )
}

function TabList({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
      {children}
    </div>
  )
}

function Tab({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tab must be used within Tabs')
  const isActive = ctx.activeTab === value
  return (
    <button onClick={() => ctx.setActiveTab(value)}
      style={{ padding: '8px 16px', background: isActive ? 'var(--accent-glow)' : 'transparent', color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)', border: 'none', borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.82rem' }}>
      {children}
    </button>
  )
}

function TabPanel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabPanel must be used within Tabs')
  if (ctx.activeTab !== value) return null
  return <div>{children}</div>
}

// ============================================================
// 📝 PART 3: React.Children + cloneElement
// ============================================================

// TODO 6: Buat ButtonGroup yang inject variant prop ke semua child buttons
function ButtonGroup({ variant = 'default', children }: { variant?: string; children: ReactNode }) {
  // TODO: gunakan Children.map + cloneElement untuk inject variant prop
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // cloneElement untuk inject props ke children
          return cloneElement(child as ReactElement<{ variant?: string }>, { variant })
        }
        return child
      })}
    </div>
  )
}

function GroupButton({ children, variant: _v }: { children: ReactNode; variant?: string }) {
  return <button className="btn" style={{ fontSize: '0.78rem' }}>{children}</button>
}

// ============================================================
// 📝 PART 4: HOC (Higher-Order Component)
// ============================================================

// TODO 7: Buat withLoading HOC
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function WithLoadingComponent(props: P & { isLoading?: boolean }) {
    const { isLoading, ...rest } = props
    if (isLoading) {
      return <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>⏳ Loading...</div>
    }
    return <Component {...(rest as P)} />
  }
}

function UserList({ users }: { users: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {users.map((u, i) => <div key={i} style={{ padding: '6px 10px', background: 'var(--bg-tertiary)', borderRadius: 4, fontSize: '0.82rem' }}>{u}</div>)}
    </div>
  )
}

const UserListWithLoading = withLoading(UserList)

// ============================================================
// 📝 PART 5: Polymorphic Component
// ============================================================

// TODO 8: Buat polymorphic Box component dengan `as` prop
type BoxProps<E extends ElementType = 'div'> = {
  as?: E
  children: ReactNode
} & ComponentPropsWithoutRef<E>

function Box<E extends ElementType = 'div'>({ as, children, ...props }: BoxProps<E>) {
  const Component = as || 'div'
  return <Component {...props}>{children}</Component>
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

interface Person { name: string; age: number; role: string }

export default function Exercise07() {
  const [sortKey, setSortKey] = useState<keyof Person & string>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [loading, setLoading] = useState(true)

  const people: Person[] = [
    { name: 'Ahmad', age: 25, role: 'Frontend' },
    { name: 'Siti', age: 30, role: 'Backend' },
    { name: 'Budi', age: 22, role: 'Fullstack' },
    { name: 'Dewi', age: 28, role: 'DevOps' },
  ]

  const sortedPeople = [...people].sort((a, b) => {
    const aVal = a[sortKey], bVal = b[sortKey]
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const handleSort = (key: keyof Person & string) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 07</span>
        <h2 className="exercise-title">Composition & TypeScript Generics</h2>
        <p className="exercise-description">Generic DataTable, Compound Tabs, HOC, React.Children/cloneElement, polymorphic component.</p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-ts">Generics</span><span className="tag tag-pattern">Compound</span>
          <span className="tag tag-pattern">HOC</span><span className="tag tag-hook">React.Children</span>
          <span className="tag tag-ts">Polymorphic</span>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">📊</span> Generic DataTable&lt;Person&gt;</div>
        <DataTable<Person> data={sortedPeople} columns={[
          { key: 'name', header: 'Name' },
          { key: 'age', header: 'Age', render: (v) => <strong>{String(v)}</strong> },
          { key: 'role', header: 'Role', render: (v) => <span className="tag tag-hook">{String(v)}</span> },
        ]} onSort={handleSort} sortKey={sortKey} sortDir={sortDir} />
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">📑</span> Compound Tabs</div>
        <Tabs defaultTab="tab1">
          <TabList><Tab value="tab1">Overview</Tab><Tab value="tab2">Details</Tab><Tab value="tab3">Settings</Tab></TabList>
          <TabPanel value="tab1"><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tab content 1 — Overview</p></TabPanel>
          <TabPanel value="tab2"><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tab content 2 — Details</p></TabPanel>
          <TabPanel value="tab3"><p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tab content 3 — Settings</p></TabPanel>
        </Tabs>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">👨‍👩‍👧</span> React.Children + cloneElement</div>
        <ButtonGroup variant="primary">
          <GroupButton>Save</GroupButton><GroupButton>Cancel</GroupButton><GroupButton>Delete</GroupButton>
        </ButtonGroup>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">🎁</span> HOC: withLoading</div>
        <button className="btn" onClick={() => setLoading(l => !l)} style={{ marginBottom: 12 }}>Toggle Loading: {loading ? 'ON' : 'OFF'}</button>
        <UserListWithLoading isLoading={loading} users={['Ahmad', 'Siti', 'Budi']} />
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">🔀</span> Polymorphic Box</div>
        <Box as="section" style={{ padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>Ini render sebagai &lt;section&gt;</Box>
        <Box as="a" href="#" style={{ display: 'block', marginTop: 8, color: 'var(--accent-primary)', fontSize: '0.85rem' }}>Ini render sebagai &lt;a&gt;</Box>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Pastikan <code className="inline-code">DataTable&lt;T&gt;</code> fully generic — test dengan type lain</li>
          <li><span className="task-check">☐</span> Review compound Tabs pattern: Context + children</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">Children.map</code> + <code className="inline-code">cloneElement</code></li>
          <li><span className="task-check">☐</span> Review HOC pattern <code className="inline-code">withLoading</code></li>
          <li><span className="task-check">☐</span> Review polymorphic <code className="inline-code">Box</code> component</li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li>Generic component: <code>{'function DataTable<T>({ data }: { data: T[] })'}</code></li>
            <li>Compound pattern: shared state via Context, composed via children</li>
            <li><code>cloneElement</code> adalah escape hatch — prefer composition pattern</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
