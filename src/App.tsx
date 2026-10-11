import { useState } from 'react';
import LandingPage from './components/new/LandingPage';
import HeroScenario from './components/new/HeroScenario';
import Workspace from './components/Workspace';
import QuantityDemo from './components/new/QuantityDemo';
import FeaturesShowcase from './components/new/FeaturesShowcase';
import AgentDrivingTest from './components/new/AgentDrivingTest';
import { ShoppingProvider } from './context/ShoppingContext';

type ViewState = 'landing' | 'hero' | 'workspace' | 'drivingTest' | 'quantityDemo' | 'features';

function App() {
  const [view, setView] = useState<ViewState>('landing');

  return (
    <ShoppingProvider>
      <div className="min-h-screen">
        <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: 'var(--border-light)', padding: 'var(--space-4) 0', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-start" style={{ cursor: 'pointer' }} onClick={() => setView('landing')}>
              <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Instacart <span className="hidden sm:inline" style={{ color: 'var(--color-text-light)', fontWeight: 400 }}>|</span> <span className="hidden sm:inline">Agent-Ready Shopping</span>
              </h1>
            </div>
            <nav className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar justify-start md:justify-end">
              <button className={`nav-tab whitespace-nowrap ${view === 'landing' ? 'active' : ''}`} onClick={() => setView('landing')}>Home</button>
              <button className={`nav-tab whitespace-nowrap ${view === 'hero' ? 'active' : ''}`} onClick={() => setView('hero')}>Story Mode</button>
              <button className={`nav-tab whitespace-nowrap ${view === 'workspace' ? 'active' : ''}`} onClick={() => setView('workspace')}>Simulator</button>
              <button className={`nav-tab whitespace-nowrap ${view === 'drivingTest' ? 'active' : ''}`} onClick={() => setView('drivingTest')}>Driving Test</button>
              <button className={`nav-tab whitespace-nowrap ${view === 'quantityDemo' ? 'active' : ''}`} onClick={() => setView('quantityDemo')}>Package Semantics</button>
              <button className={`nav-tab whitespace-nowrap ${view === 'features' ? 'active' : ''}`} onClick={() => setView('features')}>Architecture</button>
            </nav>
          </div>
        </header>

        <main className="container mt-8 mb-16">
          {view === 'landing' && <LandingPage setView={(v) => setView(v as ViewState)} />}
          {view === 'hero' && <HeroScenario onSwitchToWorkspace={() => setView('workspace')} />}
          {view === 'workspace' && <Workspace />}
          {view === 'drivingTest' && <AgentDrivingTest />}
          {view === 'quantityDemo' && <QuantityDemo />}
          {view === 'features' && <FeaturesShowcase />}
        </main>
      </div>
    </ShoppingProvider>
  );
}

export default App;
