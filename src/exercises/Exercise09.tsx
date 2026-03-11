// ============================================================
// EXERCISE 09: Controlled Forms + Validation
// Konsep: Controlled inputs, multi-step form, validation,
//         TypeScript utility types (Partial, Pick, Omit)
// ============================================================

import { useState, type FormEvent } from 'react'

// ============================================================
// 📝 TYPE DEFINITIONS
// ============================================================

interface FormData {
  // Step 1: Personal
  name: string
  email: string
  phone: string
  // Step 2: Address
  street: string
  city: string
  zipCode: string
  country: string
  // Step 3: (review only)
}

// TODO 1: Gunakan TypeScript utility types
type PersonalInfo = Pick<FormData, 'name' | 'email' | 'phone'>
type AddressInfo = Pick<FormData, 'street' | 'city' | 'zipCode' | 'country'>

// Validation errors — Partial karena tidak semua field punya error
type FormErrors = Partial<Record<keyof FormData, string>>

// ============================================================
// 📝 VALIDATION LOGIC
// ============================================================

// TODO 2: Implementasi validation functions
function validatePersonal(data: PersonalInfo): FormErrors {
  const errors: FormErrors = {}
  // 👇 IMPLEMENTASI VALIDASI
  // - name: required, min 2 characters
  // - email: required, harus valid email format
  // - phone: required, harus angka saja
  if (!data.name || data.name.length < 2) errors.name = 'Nama minimal 2 karakter'
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Email tidak valid'
  if (!data.phone || !/^\d+$/.test(data.phone)) errors.phone = 'Nomor telepon harus angka'
  return errors
}

function validateAddress(data: AddressInfo): FormErrors {
  const errors: FormErrors = {}
  // 👇 IMPLEMENTASI VALIDASI
  if (!data.street) errors.street = 'Alamat wajib diisi'
  if (!data.city) errors.city = 'Kota wajib diisi'
  if (!data.zipCode) errors.zipCode = 'Kode pos wajib diisi'
  if (!data.country) errors.country = 'Negara wajib diisi'
  return errors
}

// ============================================================
// 📝 FORM INPUT COMPONENT
// ============================================================

interface FormInputProps {
  label: string
  name: keyof FormData
  value: string
  onChange: (name: keyof FormData, value: string) => void
  error?: string
  type?: string
  placeholder?: string
}

function FormInput({ label, name, value, onChange, error, type = 'text', placeholder }: FormInputProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4, fontWeight: 600 }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-code)', border: `1px solid ${error ? 'var(--error)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', outline: 'none', transition: 'border-color 150ms' }} />
      {error && <p style={{ fontSize: '0.72rem', color: 'var(--error)', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

// ============================================================
// 📝 STEP COMPONENTS
// ============================================================

function StepPersonal({ data, errors, onChange }: { data: PersonalInfo; errors: FormErrors; onChange: (name: keyof FormData, value: string) => void }) {
  return (<div>
    <FormInput label="Nama Lengkap" name="name" value={data.name} onChange={onChange} error={errors.name} placeholder="Ahmad Rizky" />
    <FormInput label="Email" name="email" value={data.email} onChange={onChange} error={errors.email} placeholder="ahmad@mail.com" type="email" />
    <FormInput label="No. Telepon" name="phone" value={data.phone} onChange={onChange} error={errors.phone} placeholder="081234567890" />
  </div>)
}

function StepAddress({ data, errors, onChange }: { data: AddressInfo; errors: FormErrors; onChange: (name: keyof FormData, value: string) => void }) {
  return (<div>
    <FormInput label="Alamat" name="street" value={data.street} onChange={onChange} error={errors.street} placeholder="Jl. Sudirman No. 1" />
    <FormInput label="Kota" name="city" value={data.city} onChange={onChange} error={errors.city} placeholder="Jakarta" />
    <FormInput label="Kode Pos" name="zipCode" value={data.zipCode} onChange={onChange} error={errors.zipCode} placeholder="12345" />
    <FormInput label="Negara" name="country" value={data.country} onChange={onChange} error={errors.country} placeholder="Indonesia" />
  </div>)
}

function StepReview({ data }: { data: FormData }) {
  const fields: { label: string; key: keyof FormData }[] = [
    { label: 'Nama', key: 'name' }, { label: 'Email', key: 'email' }, { label: 'Telepon', key: 'phone' },
    { label: 'Alamat', key: 'street' }, { label: 'Kota', key: 'city' }, { label: 'Kode Pos', key: 'zipCode' }, { label: 'Negara', key: 'country' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {fields.map((f) => (
        <div key={f.key} style={{ display: 'flex', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', width: 100 }}>{f.label}</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{data[f.key]}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// 📝 KOMPONEN UTAMA
// ============================================================

const INITIAL: FormData = { name: '', email: '', phone: '', street: '', city: '', zipCode: '', country: '' }

export default function Exercise09() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => { const next = { ...prev }; delete next[name]; return next })
  }

  const handleNext = () => {
    let stepErrors: FormErrors = {}
    if (step === 1) stepErrors = validatePersonal(formData)
    if (step === 2) stepErrors = validateAddress(formData)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length === 0) setStep((s) => s + 1)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const steps = ['Personal', 'Address', 'Review']

  return (
    <div className="exercise-page">
      <div className="exercise-header">
        <span className="exercise-badge">Exercise 09</span>
        <h2 className="exercise-title">Controlled Forms + Validation</h2>
        <p className="exercise-description">Multi-step form dengan real-time validation dan TypeScript utility types.</p>
        <div className="concept-tags" style={{ marginTop: 12 }}>
          <span className="tag tag-pattern">Controlled Inputs</span><span className="tag tag-ts">Pick</span>
          <span className="tag tag-ts">Partial</span><span className="tag tag-pattern">Validation</span>
        </div>
      </div>

      {submitted ? (
        <div className="section">
          <div className="alert alert-success">✅ Form berhasil disubmit!</div>
          <StepReview data={formData} />
          <button className="btn" style={{ marginTop: 12 }} onClick={() => { setFormData(INITIAL); setStep(1); setSubmitted(false) }}>Reset</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* STEP INDICATOR */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: step > i ? 'var(--success)' : step === i + 1 ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: '0.72rem', color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</div>
              </div>
            ))}
          </div>

          <div className="section">
            {step === 1 && <StepPersonal data={formData} errors={errors} onChange={handleChange} />}
            {step === 2 && <StepAddress data={formData} errors={errors} onChange={handleChange} />}
            {step === 3 && <StepReview data={formData} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              {step > 1 && <button type="button" className="btn" onClick={() => setStep(s => s - 1)}>← Back</button>}
              <div style={{ marginLeft: 'auto' }}>
                {step < 3 && <button type="button" className="btn btn-primary" onClick={handleNext}>Next →</button>}
                {step === 3 && <button type="submit" className="btn btn-primary">Submit ✓</button>}
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="section">
        <div className="section-title"><span className="icon">📝</span> Yang Harus Dikerjakan</div>
        <ul className="task-list">
          <li><span className="task-check">☐</span> Review penggunaan <code className="inline-code">Pick&lt;FormData, ...&gt;</code> untuk type per step</li>
          <li><span className="task-check">☐</span> Review <code className="inline-code">Partial&lt;Record&lt;...&gt;&gt;</code> untuk errors</li>
          <li><span className="task-check">☐</span> Review real-time validation yang clear error saat user ketik</li>
          <li><span className="task-check">☐</span> Challenge: tambah field conditional (misal: jika country=Indonesia, tampilkan provinsi)</li>
        </ul>
      </div>
    </div>
  )
}
