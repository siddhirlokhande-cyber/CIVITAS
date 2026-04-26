import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import SeverityBadge from '../components/shared/SeverityBadge'
import StatusBadge from '../components/shared/StatusBadge'

const CATEGORIES = ['All', 'Roads', 'Water', 'Electricity', 'Sanitation', 'Pest Control', 'Public Safety']
const WARDS = ['Ward 7', 'Ward 8', 'Ward 11', 'Ward 12', 'Ward 15', 'Ward 22']

export default function Awaaz({ showModal, onCloseModal }) {
  const [issues, setIssues]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')

  useEffect(() => {
    loadIssues()
  }, [])

  async function loadIssues() {
    const { data, error } = await supabase
      .from('issues')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setIssues(data || [])
    setLoading(false)
  }

  // Optimistic upvote
  async function handleUpvote(issue) {
    const newCount = issue.upvotes + 1
    setIssues(prev => prev.map(i => i.id === issue.id ? { ...i, upvotes: newCount } : i))
    await supabase.from('issues').update({ upvotes: newCount }).eq('id', issue.id)
  }

  async function handleSubmitIssue(formData) {
    const slaHours = { CRITICAL: 6, HIGH: 24, MEDIUM: 72, LOW: 168 }
    const deadline = new Date(Date.now() + (slaHours[formData.severity] || 72) * 3_600_000)

    const { data: newIssue, error } = await supabase
      .from('issues')
      .insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        ward: formData.ward,
        reporter_name: 'You',
        deadline: deadline.toISOString(),
        status: 'Open',
        upvotes: 0,
      })
      .select()
      .single()

    if (!error && newIssue) {
      setIssues(prev => [newIssue, ...prev])
    }
    onCloseModal()
  }

  const filtered = filter === 'All'
    ? issues
    : issues.filter(i => i.category === filter)

  if (loading) return <div className="loading">LOADING ISSUES</div>

  return (
    <div>
      <p className="label-xs" style={{ marginBottom: 6 }}>LIVE ISSUE DASHBOARD</p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Civic Complaints & Status</h2>
      <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 20 }}>
        {issues.length} issues on record · Upvote to escalate priority
      </p>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? 'var(--gold)' : '#141414',
              color: filter === cat ? '#000' : 'var(--text-dim)',
              border: '1px solid var(--border-hi)',
              borderRadius: 3,
              padding: '4px 11px',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '.08em',
              fontWeight: filter === cat ? 700 : 400,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 && <div className="empty">No issues in this category.</div>}

      {filtered.map(issue => (
        <IssueCard key={issue.id} issue={issue} onUpvote={() => handleUpvote(issue)} />
      ))}

      {showModal && (
        <IssueModal onSubmit={handleSubmitIssue} onClose={onCloseModal} wards={WARDS} />
      )}
    </div>
  )
}

function IssueCard({ issue, onUpvote }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '13px 15px',
      marginBottom: 8,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 7 }}>
          <SeverityBadge severity={issue.severity} />
          <StatusBadge status={issue.status} />
          {issue.category && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--text-dim)' }}>
              {issue.category.toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 5, lineHeight: 1.35 }}>
          {issue.title}
        </div>

        {issue.description && (
          <div style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 6, lineHeight: 1.5 }}>
            {issue.description}
          </div>
        )}

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', display: 'flex', gap: 14 }}>
          <span>📍 {issue.ward}</span>
          <span>👤 {issue.reporter_name}</span>
          {issue.created_at && (
            <span>{new Date(issue.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
          )}
        </div>
      </div>

      {/* Upvote */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={e => { e.stopPropagation(); onUpvote() }}
          className="btn btn-light btn-sm"
          style={{
            borderRadius: 4,
            color: 'var(--text-mid)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            fontFamily: 'var(--font-mono)',
            padding: '6px 10px',
          }}
        >
          <span style={{ fontSize: 12 }}>▲</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{issue.upvotes}</span>
        </button>
      </div>
    </div>
  )
}

function IssueModal({ onSubmit, onClose, wards }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Roads',
    severity: 'MEDIUM',
    ward: wards[0] || 'Ward 12',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit() {
    if (!form.title.trim()) { alert('Please enter a title.'); return }
    setSubmitting(true)
    await onSubmit(form)
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p className="label-xs">AWAAZ</p>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>File Formal Complaint</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 20, lineHeight: 1 }}>
            ×
          </button>
        </div>

        <Field label="CATEGORY">
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {['Roads', 'Water', 'Electricity', 'Sanitation', 'Pest Control', 'Public Safety', 'Healthcare'].map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="TITLE">
          <input
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Brief description of the problem..."
            maxLength={120}
          />
        </Field>

        <Field label="WARD">
          <select value={form.ward} onChange={e => set('ward', e.target.value)}>
            {wards.map(w => <option key={w}>{w}</option>)}
          </select>
        </Field>

        <Field label="DESCRIPTION">
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
            placeholder="Describe the problem and its impact on residents..."
          />
        </Field>

        <Field label="SEVERITY">
          <select value={form.severity} onChange={e => set('severity', e.target.value)}>
            <option value="CRITICAL">CRITICAL — Immediate danger (SLA: 6 hrs)</option>
            <option value="HIGH">HIGH — Major disruption (SLA: 24 hrs)</option>
            <option value="MEDIUM">MEDIUM — Inconvenience (SLA: 72 hrs)</option>
            <option value="LOW">LOW — Minor issue (SLA: 7 days)</option>
          </select>
        </Field>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            className="btn btn-outline-secondary fw-bold"
          >
            CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn btn-warning fw-bold"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'FILING...' : 'SUBMIT COMPLAINT →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="label-xs" style={{ marginBottom: 5 }}>{label}</div>
      {children}
    </div>
  )
}
