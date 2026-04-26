import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Static breakdown for speed — swap with live Supabase fetch in Phase 2
const BREAKDOWN = [
  { dept: 'Roads & Infrastructure',  allocated: 120, spent: 108, color: '#D4922A' },
  { dept: 'Water & Drainage',        allocated: 85,  spent: 92,  color: '#3B82F6' }, // overrun
  { dept: 'Sanitation',              allocated: 60,  spent: 55,  color: '#22C55E' },
  { dept: 'Electricity & Lighting',  allocated: 45,  spent: 38,  color: '#A78BFA' },
  { dept: 'Healthcare',              allocated: 70,  spent: 65,  color: '#EF4444' },
  { dept: 'Admin Overhead',          allocated: 40,  spent: 22,  color: '#888'    },
]

const DOCUMENTS = [
  { name: 'Q3 Budget Report FY2025',   date: 'Oct 15, 2025', ok: true  },
  { name: 'Q3 Expenditure Breakdown',  date: 'Oct 20, 2025', ok: true  },
  { name: 'Manifesto Tracking H1',     date: 'Sep 30, 2025', ok: true  },
  { name: 'Half-Yearly Impact Report', date: 'DUE: Nov 5',   ok: false },
  { name: 'Annual Manifesto Audit',    date: 'DUE: Dec 31',  ok: false },
]

const SUMMARY = [
  { label: 'Q3 Budget',        val: '₹4.20 Cr', sub: 'Allocated',      ok: true  },
  { label: 'Q3 Expenditure',   val: '₹3.80 Cr', sub: 'Spent',          ok: true  },
  { label: 'Half-Yr Report',   val: 'Pending',   sub: 'Due Nov 5',      ok: false },
  { label: 'Manifesto Audit',  val: 'FY25 ✓',    sub: 'Uploaded',       ok: true  },
]

export default function Koshagar() {
  const [financeRecords, setFinanceRecords] = useState([])

  // Fetch any live finance records for future use
  useEffect(() => {
    supabase.from('finance_records').select('*').limit(10).then(({ data }) => {
      setFinanceRecords(data || [])
    })
  }, [])

  const totalAllocated = BREAKDOWN.reduce((s, i) => s + i.allocated, 0)
  const totalSpent     = BREAKDOWN.reduce((s, i) => s + i.spent, 0)
  const overallPct     = Math.round((totalSpent / totalAllocated) * 100)

  return (
    <div>
      <p className="label-xs" style={{ marginBottom: 6 }}>FINANCIAL TRANSPARENCY VAULT</p>
      <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Public Money. Public Record.</h2>
      <p style={{ color: 'var(--text-mid)', fontSize: 14, marginBottom: 22 }}>
        Kasba Peth Constituency · MLA: Rajesh Patil · Q3 FY2025
      </p>

      {/* Summary cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10,
        marginBottom: 24,
      }}>
        {SUMMARY.map(item => (
          <SummaryCard key={item.label} {...item} />
        ))}
      </div>

      {/* Overall bar */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 6,
        padding: '14px 16px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span className="label-xs">OVERALL Q3 UTILISATION</span>
            <span className="label-xs" style={{ color: overallPct > 100 ? 'var(--red)' : 'var(--green)' }}>
              {overallPct}%
            </span>
          </div>
          <div style={{ background: '#1E1E1E', borderRadius: 3, height: 10 }}>
            <div style={{
              width: Math.min(overallPct, 100) + '%',
              height: 10,
              borderRadius: 3,
              background: overallPct > 100 ? 'var(--red)' : overallPct > 85 ? 'var(--green)' : 'var(--gold)',
            }} />
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--green)' }}>
            ₹{totalSpent}L
          </div>
          <div className="label-xs">of ₹{totalAllocated}L allocated</div>
        </div>
      </div>

      {/* Department breakdown */}
      <p className="label-xs" style={{ marginBottom: 14 }}>Q3 FY2025 EXPENDITURE BY DEPARTMENT (₹ Lakhs)</p>

      {BREAKDOWN.map(item => {
        const pct = Math.min((item.spent / item.allocated) * 100, 100)
        const overrun = item.spent > item.allocated

        return (
          <div key={item.dept} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 14, color: 'var(--text)' }}>{item.dept}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: overrun ? 'var(--red)' : 'var(--text-mid)',
              }}>
                ₹{item.spent}L / ₹{item.allocated}L
                {overrun && <span style={{ marginLeft: 6, color: 'var(--red)' }}>⚠ OVERRUN</span>}
              </span>
            </div>

            {/* Allocation track */}
            <div style={{ background: '#1A1A1A', borderRadius: 2, height: 16, position: 'relative' }}>
              <div style={{
                width: pct + '%',
                height: 16,
                borderRadius: 2,
                background: overrun ? 'var(--red)' : item.color,
                opacity: .85,
              }} />
              {/* Allocation marker */}
              <div style={{
                position: 'absolute',
                left: '100%',
                top: 0,
                height: 16,
                width: 1,
                background: '#333',
                transform: 'translateX(-1px)',
              }} />
            </div>
          </div>
        )
      })}

      {/* Documents section */}
      <p className="label-xs" style={{ marginTop: 28, marginBottom: 12 }}>UPLOADED DOCUMENTS</p>

      {DOCUMENTS.map(doc => (
        <div
          key={doc.name}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '12px 15px',
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: doc.ok ? 'var(--text)' : 'var(--amber)', marginBottom: 2 }}>
              {doc.name}
            </div>
            <div className="label-xs">{doc.date}</div>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 8,
            padding: '4px 9px',
            borderRadius: 2,
            background: doc.ok ? '#021A0A' : '#1A1000',
            color: doc.ok ? 'var(--green)' : 'var(--amber)',
            flexShrink: 0,
          }}>
            {doc.ok ? '✓ AVAILABLE' : '⏳ PENDING'}
          </span>
        </div>
      ))}

      {/* RTI note */}
      <div style={{
        marginTop: 24,
        padding: '12px 16px',
        background: '#0E0E0E',
        border: '1px dashed var(--border-hi)',
        borderRadius: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        lineHeight: 1.7,
      }}>
        📋 Any citizen may formally request a financial breakdown under RTI. Non-response within 30 days
        triggers a MANDAAT deduction of −15 points.
      </div>
    </div>
  )
}

function SummaryCard({ label, val, sub, ok }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 6,
      padding: '13px 14px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 17,
        fontWeight: 700,
        color: ok ? 'var(--green)' : 'var(--amber)',
        marginBottom: 4,
      }}>
        {val}
      </div>
      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{label}</div>
      <div className="label-xs">{sub}</div>
      <div style={{
        marginTop: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: 8,
        color: ok ? 'var(--green)' : 'var(--amber)',
      }}>
        {ok ? '✓ Uploaded' : '⏳ Pending'}
      </div>
    </div>
  )
}
