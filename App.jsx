import { useState } from 'react'
import './index.css'
import TabBar from './components/TabBar'
import Mandaat from './pages/Mandaat'
import Awaaz from './pages/Awaaz'
import Sabha from './pages/Sabha'
import Koshagar from './pages/Koshagar'

function App() {
  const [activeTab, setActiveTab] = useState('mandaat')
  const [showModal, setShowModal] = useState(false)

  const renderPage = () => {
    switch (activeTab) {
      case 'awaaz':
        return <Awaaz showModal={showModal} onCloseModal={() => setShowModal(false)} />
      case 'sabha':
        return <Sabha />
      case 'koshagar':
        return <Koshagar />
      default:
        return <Mandaat />
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header bg-light border-bottom border-2 p-4">
        <div>
          <p className="label-xs text-muted">CIVITAS</p>
          <h1 className="text-dark mb-3">Citizen accountability dashboard</h1>
          <p className="label-sm text-secondary">
            Switch tabs to view accountability scores, live issues, civic forum activity,
            and finance transparency.
          </p>
        </div>
        {activeTab === 'awaaz' && (
          <button className="btn btn-warning fw-bold" onClick={() => setShowModal(true)}>
            📝 File an issue
          </button>
        )}
      </header>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-content">{renderPage()}</main>
    </div>
  )
}

export default App
