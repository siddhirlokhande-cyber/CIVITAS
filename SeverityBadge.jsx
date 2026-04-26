const SEV = {
  CRITICAL: { bg: '#5C1A1A', color: '#FCA5A5', dot: '#EF4444' },
  HIGH:     { bg: '#3A2000', color: '#FCD34D', dot: '#F59E0B' },
  MEDIUM:   { bg: '#0D1A3A', color: '#93C5FD', dot: '#3B82F6' },
  LOW:      { bg: '#0A2010', color: '#86EFAC', dot: '#22C55E' },
}

export default function SeverityBadge({ severity }) {
  const s = SEV[severity] || SEV.LOW
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontFamily: 'var(--font-mono)',
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: '.1em',
      padding: '2px 7px 2px 5px',
      borderRadius: 2,
      background: s.bg,
      color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {severity}
    </span>
  )
}
