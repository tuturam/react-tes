// ============================================================
// EXERCISE 05: Performance Optimization
// Konsep: React.memo, useMemo, useCallback, useDeferredValue
// ============================================================

import { useState, useMemo, useCallback, useDeferredValue, memo } from 'react'

// Render counter
let renderCounts: Record<string, number> = {}
function trackRender(name: string) {
  renderCounts[name] = (renderCounts[name] || 0) + 1
  return renderCounts[name]
}

interface Product { id: number; name: string; price: number; category: string }

const PRODUCTS: Product[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1} ${['Widget', 'Gadget', 'Tool', 'Device', 'Item'][i % 5]}`,
  price: Math.floor(Math.random() * 500) + 10,
  category: ['Electronics', 'Books', 'Clothing', 'Food', 'Sports'][i % 5],
}))

function expensiveFilter(products: Product[], query: string, category: string): Product[] {
  const start = performance.now()
  while (performance.now() - start < 2) { /* artificial delay */ }
  return products.filter((p) => {
    const matchQ = query ? p.name.toLowerCase().includes(query.toLowerCase()) : true
    const matchC = category !== 'all' ? p.category === category : true
    return matchQ && matchC
  })
}

// TODO 1: Wrap dengan React.memo
interface ProductCardProps { product: Product; onAddToCart: (id: number) => void }

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const count = trackRender(`Card-${product.id}`)
  return (
    <div style={{ padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{product.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${product.price} • {product.category}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>renders: {count}</span>
        <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => onAddToCart(product.id)}>🛒</button>
      </div>
    </div>
  )
}

// TODO 2: Wrap dengan React.memo
interface StatsProps { totalProducts: number; totalValue: number; cartCount: number }

function Stats({ totalProducts, totalValue, cartCount }: StatsProps) {
  const count = trackRender('Stats')
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 12 }}>
      {[
        { label: 'Products', value: totalProducts },
        { label: 'Total Value', value: `$${totalValue.toLocaleString()}` },
        { label: 'In Cart', value: cartCount },
      ].map((s) => (
        <div key={s.label} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{String(s.value)}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>(renders: {count})</span></div>
        </div>
      ))}
    </div>
  )
}

export default function Exercise05() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<number[]>([])
  const [tick, setTick] = useState(0)

  useState(() => { const id = setInterval(() => setTick((t) => t + 1), 1000); return () => clearInterval(id) })

  const parentRenders = trackRender('Parent')

  // TODO 3: Wrap dengan useMemo
  const filteredProducts = expensiveFilter(PRODUCTS, query, category)

  // TODO 4: Gunakan useDeferredValue untuk query
  const _deferredQuery = useDeferredValue(query)
  // Kapan useDeferredValue vs useMemo? Jawab:
  //

  // TODO 5: Wrap dengan useCallback
  const handleAddToCart = (id: number) => {
    setCart((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  // TODO 6: Wrap dengan useMemo
  const totalValue = filteredProducts.reduce((sum, p) => sum + p.price, 0)
  const displayProducts = filteredProducts.slice(0, 50)

  void tick; void memo; void useMemo; void useCallback

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 05</span>
        <h2 className="exercise-title">Performance Optimization</h2>
        <p className="exercise-description">Product List sengaja lambat. Parent re-render tiap detik. Minimize re-renders!</p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-perf">React.memo</span><span className="tag tag-perf">useMemo</span>
          <span className="tag tag-perf">useCallback</span><span className="tag tag-hook">useDeferredValue</span>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        ⚡ Parent renders: <strong>{parentRenders}</strong> (every second).
        <button className="btn" style={{ marginLeft: 12, fontSize: '0.72rem', padding: '3px 8px' }} onClick={() => { renderCounts = {}; setQuery(q => q) }}>Reset</button>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">🔍</span> Filters</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', outline: 'none' }} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px 14px', background: 'var(--bg-code)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
            <option value="all">All</option><option value="Electronics">Electronics</option><option value="Books">Books</option>
            <option value="Clothing">Clothing</option><option value="Food">Food</option><option value="Sports">Sports</option>
          </select>
        </div>
      </div>

      <Stats totalProducts={filteredProducts.length} totalValue={totalValue} cartCount={cart.length} />

      <div className="section">
        <div className="section-title"><span className="icon">📦</span> Products <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Showing {displayProducts.length}/{filteredProducts.length}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
          {displayProducts.map((p) => <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />)}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Wrap <code className="inline-code">ProductCard</code> & <code className="inline-code">Stats</code> dengan <code className="inline-code">React.memo</code></li>
          <li><span className="task-check">☐</span> Wrap filter dengan <code className="inline-code">useMemo</code>, handler dengan <code className="inline-code">useCallback</code></li>
          <li><span className="task-check">☐</span> Gunakan <code className="inline-code">useDeferredValue</code> agar typing responsive</li>
          <li><span className="task-check">☐</span> Wrap totalValue dengan <code className="inline-code">useMemo</code></li>
        </ul>
        <details className="hint-box">
          <summary>💡 Hints</summary>
          <ul>
            <li><code>React.memo</code> skip re-render hanya jika SEMUA props same — termasuk function refs</li>
            <li><code>useCallback</code> keeps function identity stable</li>
            <li><code>useDeferredValue</code> = show stale data, compute in background. <code>useMemo</code> = cache result eagerly</li>
          </ul>
        </details>
      </div>
    </div>
  )
}
