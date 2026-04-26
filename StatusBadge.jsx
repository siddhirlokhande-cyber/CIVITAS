const STATUS = {
  'Open':        { bg: '#1A0505', color: '#F87171' },
  'In Progress': { bg: '#1A1000', color: '#FCD34D' },
  'Escalated':   { bg: '#120A28', color: '#C084FC' },
  'Resolved':    { bg: '#021A0A', color: '#4ADE80' },
}

export default function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS['Open']
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 8,
      letterSpacing: '.1em',
      padding: '2px 7px',
      borderRadius: 2,
      background: s.bg,
      color: s.color,
    }}>
      {status?.toUpperCase()}
    </span>
  )
}

