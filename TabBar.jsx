const TABS = [
  { key: 'mandaat',  label: 'MANDAAT',  sub: 'Scores'   },
  { key: 'awaaz',    label: 'AWAAZ',    sub: 'Issues'   },
  { key: 'sabha',    label: 'SABHA',    sub: 'Forum'    },
  { key: 'koshagar', label: 'KOSHAGAR', sub: 'Finance'  },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom" style={{ padding: '0' }}>
      <div className="nav nav-tabs w-100 border-bottom-0" role="tablist" style={{ overflowX: 'auto' }}>
        {TABS.map(tab => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`nav-link fw-bold d-flex flex-column align-items-center gap-1 ${
                active ? 'active text-warning' : 'text-muted'
              }`}
              style={{
                padding: '12px 20px 10px',
                whiteSpace: 'nowrap',
                border: 'none',
                borderBottom: active ? '3px solid #FFC107' : '3px solid transparent',
                color: active ? '#FFC107' : '#6C757D',
                transition: 'all 0.15s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '.14em',
                }}
              >
                {tab.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 7,
                  letterSpacing: '.1em',
                  opacity: 0.7,
                }}
              >
                {tab.sub}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}