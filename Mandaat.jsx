import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import BandPill, { BAND_COLORS } from '../components/shared/BandPill'

export default function Mandaat() {
  const [officials, setOfficials] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null) // expanded card id
  const [showModal, setShowModal] = useState(false)
  const [editingOfficial, setEditingOfficial] = useState(null)

  useEffect(() => {
    loadOfficials()
  }, [])

  async function loadOfficials() {
    const { data, error } = await supabase
      .from('officials')
      .select('*')
      .order('mandaat_score', { ascending: false })
    if (!error) setOfficials(data || [])
    setLoading(false)
  }

  function openAddModal() {
    setEditingOfficial(null)
    setShowModal(true)
  }

  function openEditModal(official) {
    setEditingOfficial(official)
    setShowModal(true)
  }

  async function handleDeleteOfficial(id) {
    if (!window.confirm('Delete this official? This action cannot be undone.')) return
    const { error } = await supabase.from('officials').delete().eq('id', id)
    if (!error) {
      setOfficials(prev => prev.filter(o => o.id !== id))
    } else {
      alert('Error deleting official')
    }
  }

  async function handleSaveOfficial(formData) {
    if (editingOfficial) {
      // UPDATE
      const { error } = await supabase
        .from('officials')
        .update(formData)
        .eq('id', editingOfficial.id)
      if (!error) {
        await loadOfficials()
      } else {
        alert('Error updating official')
      }
    } else {
      // CREATE
      const { error } = await supabase
        .from('officials')
        .insert(formData)
      if (!error) {
        await loadOfficials()
      } else {
        alert('Error creating official')
      }
    }
    setShowModal(false)
  }

  function toggle(id) {
    setSelected(prev => prev === id ? null : id)
  }

  if (loading) return <div className="loading">LOADING SCOREBOARD</div>

  return (
    <div>
      {/* Header */}
      <p className="label-xs" style={{ marginBottom: 6 }}>ACCOUNTABILITY SCOREBOARD</p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
        Your Representatives' Performance
      </h2>
      <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 24 }}>
        Scores update as issues are filed, resolved, and verified by citizens.
      </p>

      {/* Add Official Button */}
      <button
        onClick={openAddModal}
        className="btn btn-warning mb-4 fw-bold"
      >
        ➕ ADD OFFICIAL
      </button>

      {officials.length === 0 && <div className="empty">No officials found in database.</div>}

      {officials.map((official, idx) => (
        <OfficialCard
          key={official.id}
          official={official}
          rank={idx + 1}
          isSelected={selected === official.id}
          onToggle={() => toggle(official.id)}
          onEdit={() => openEditModal(official)}
          onDelete={() => handleDeleteOfficial(official.id)}
        />
      ))}

      {showModal && (
        <OfficialModal
          official={editingOfficial}
          onSave={handleSaveOfficial}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
function OfficialCard({ official, rank, isSelected, onToggle, onEdit, onDelete }) {
  const band = BAND_COLORS[official.band] || BAND_COLORS.SILVER
  const resolutionRate = official.issues_filed > 0
    ? Math.round((official.issues_resolved / official.issues_filed) * 100)
    : 0

  const trendPositive = official.trend >= 0

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${isSelected ? band.border : '#222'}`,
        borderLeft: `3px solid ${band.border}`,
        borderRadius: 6,
        padding: '14px 16px',
        marginBottom: 8,
        transition: 'border-color 0.2s',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

        {/* Rank */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          width: 18,
          flexShrink: 0,
          textAlign: 'center',
        }}>
          #{rank}
        </span>

        {/* Avatar */}
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: '#1A1A1A',
          border: `1.5px solid ${band.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          color: band.color,
          flexShrink: 0,
        }}>
          {official.avatar_initials || official.name?.charAt(0) || '?'}
        </div>

        {/* Name & role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {official.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>
            {official.role} · {official.constituency || official.ward || '—'}
          </div>
        </div>

        {/* Score + Band */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 26,
            fontWeight: 700,
            color: band.color,
            lineHeight: 1,
          }}>
            {official.mandaat_score}
          </div>
          <div style={{ marginTop: 4 }}>
            <BandPill band={official.band} />
          </div>
        </div>

        {/* Trend */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 700,
          color: trendPositive ? 'var(--green)' : 'var(--red)',
          width: 40,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          {trendPositive ? '+' : ''}{official.trend}
        </div>

        {/* Expand arrow */}
        <span
          onClick={onToggle}
          style={{
            color: 'var(--text-dim)',
            fontSize: 10,
            transition: 'transform 0.2s',
            transform: isSelected ? 'rotate(90deg)' : 'rotate(0deg)',
            cursor: 'pointer',
          }}
        >▶</span>
      </div>

      {/* Expanded detail */}
      {isSelected && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
            <Stat label="Filed" value={official.issues_filed} color="var(--text-mid)" />
            <Stat label="Resolved" value={official.issues_resolved} color="var(--green)" />
            <Stat label="Resolution" value={resolutionRate + '%'} color="var(--blue)" />
            <Stat label="Manifesto" value={(official.manifesto_progress ?? 0) + '%'} color="var(--purple)" />
          </div>

          {/* Manifesto progress bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span className="label-xs">MANIFESTO PROGRESS</span>
              <span className="label-xs" style={{ color: 'var(--text-mid)' }}>
                {official.manifesto_progress ?? 0}%
              </span>
            </div>
            <div style={{ background: '#1E1E1E', borderRadius: 2, height: 7 }}>
              <div style={{
                width: (official.manifesto_progress ?? 0) + '%',
                height: 7,
                borderRadius: 2,
                background: (official.manifesto_progress ?? 0) > 60
                  ? 'var(--green)'
                  : (official.manifesto_progress ?? 0) > 35
                    ? 'var(--gold)'
                    : 'var(--red)',
              }} />
            </div>
          </div>

          {/* Critical band warning */}
          {official.band === 'RED' && (
            <div style={{
              padding: '8px 12px',
              background: '#1A0000',
              border: '1px solid var(--red)',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--red)',
              marginBottom: 12,
            }}>
              ⚠ CRITICAL BAND — Mandatory public town hall required within 7 days.
            </div>
          )}
          {official.band === 'BLACK' && (
            <div style={{
              padding: '8px 12px',
              background: '#0E0E0E',
              border: '1px solid #444',
              borderRadius: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#888',
              marginBottom: 12,
            }}>
              ⛔ BREACH OF TRUST — Formal censure and electoral record flagged.
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              onClick={onEdit}
              className="btn btn-warning btn-sm fw-bold"
            >
              ✏️ EDIT
            </button>
            <button
              onClick={onDelete}
              className="btn btn-danger btn-sm fw-bold"
            >
              🗑️ DELETE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 60 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color }}>
        {value}
      </div>
      <div className="label-xs" style={{ marginTop: 2 }}>{label}</div>
    </div>
  )
}

function OfficialModal({ official, onSave, onClose }) {
  const [form, setForm] = useState(official || {
    name: '',
    band: 'SILVER',
    mandaat_score: 0,
    issues_filed: 0,
    issues_resolved: 0,
    trend: 0,
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit() {
    if (!form.name.trim()) { alert('Please enter official name.'); return }
    setSubmitting(true)
    await onSave(form)
    setSubmitting(false)
  }

  const bands = ['GOLD', 'SILVER', 'BRONZE', 'RED', 'BLACK']

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <p className="label-xs">MANDAAT</p>
            <h3 style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>
              {official ? 'Edit Official' : 'Add New Official'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-close"></button>
        </div>

        <Field label="NAME">
          <input
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Official's full name"
            maxLength={255}
          />
        </Field>

        <Field label="PERFORMANCE BAND">
          <select value={form.band} onChange={e => set('band', e.target.value)}>
            {bands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <Field label="MANDAAT SCORE">
            <input
              type="number"
              value={form.mandaat_score}
              onChange={e => set('mandaat_score', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>

          <Field label="TREND">
            <input
              type="number"
              value={form.trend}
              onChange={e => set('trend', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <Field label="ISSUES FILED">
            <input
              type="number"
              value={form.issues_filed}
              onChange={e => set('issues_filed', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>

          <Field label="ISSUES RESOLVED">
            <input
              type="number"
              value={form.issues_resolved}
              onChange={e => set('issues_resolved', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </Field>
        </div>

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
            {submitting ? 'SAVING...' : official ? 'SAVE OFFICIAL →' : 'ADD OFFICIAL →'}
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
