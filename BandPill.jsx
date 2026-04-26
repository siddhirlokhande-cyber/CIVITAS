const BAND_STYLES = {
  PLATINUM: { bg: '#0D1F33', color: '#93C5FD', border: '#3B82F6' },
  GOLD:     { bg: '#1A1000', color: '#D4922A', border: '#D4922A' },
  SILVER:   { bg: '#1A1A1A', color: '#AAA',    border: '#666'    },
  AMBER:    { bg: '#1A0D00', color: '#FCD34D', border: '#F59E0B' },
  RED:      { bg: '#1A0000', color: '#F87171', border: '#EF4444' },
  BLACK:    { bg: '#111',    color: '#666',    border: '#444'    },
}

export const BAND_COLORS = BAND_STYLES

export default function BandPill({ band }) {
  const s = BAND_STYLES[band] || BAND_STYLES.SILVER
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 8,
      fontWeight: 700,
      letterSpacing: '.12em',
      padding: '2px 7px',
      borderRadius: 2,
      background: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {band}
    </span>
  )
}
