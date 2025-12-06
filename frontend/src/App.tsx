import { useState } from 'react'
import './App.css'

function App() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const connectWallet = async () => {
    setLoading(true)
    try {
      // For MVP Phase 0: Demo wallet connection
      // In Phase 2: We'll integrate real MetaMask Snap / WalletConnect
      
      // Simulated wallet address (replace with real in Phase 2)
      const demoAddress = 'AIBTB2WJWJ5PDFKM5AKPWMLZ3LDTQ3JBNIWL2AGFCJ3GXVXWN5HCMGQ'
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUserAddress(demoAddress)
      setWalletConnected(true)
      
      console.log('✅ Wallet connected:', demoAddress)
    } catch (error) {
      console.error('❌ Wallet connection failed:', error)
      alert('Failed to connect wallet. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletConnected(false)
    setUserAddress('')
    console.log('Wallet disconnected')
  }

  return (
    <div className="App">
      <header className="header">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>🎯 Qlance</h1>
            <p className="tagline">Qubic Micro-Freelance Marketplace</p>
          </div>
          
          <button 
            className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
            onClick={walletConnected ? disconnectWallet : connectWallet}
            disabled={loading}
          >
            {loading && <span className="spinner" />}
            {walletConnected ? (
              <>
                <span className="status-dot">●</span>
                Connected
              </>
            ) : (
              'Connect Wallet'
            )}
          </button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero">
          <div className="hero-content">
            <h2>Decentralized. Trustless. Global.</h2>
            <p>
              Earn money completing micro-tasks or hire global talent — 
              all powered by Qubic's blockchain technology with zero middlemen fees.
            </p>
            
            {!walletConnected ? (
              <div className="cta-section">
                <button className="cta-btn primary" onClick={connectWallet}>
                  Get Started Now
                </button>
                <p className="cta-subtext">No fees. No intermediaries. Pure decentralized work.</p>
              </div>
            ) : (
              <div className="connected-section">
                <div className="wallet-info">
                  <h3>✅ Wallet Connected</h3>
                  <div className="address-box">
                    <p>Address:</p>
                    <code>{userAddress}</code>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(userAddress)
                        alert('Address copied!')
                      }}
                    >
                      Copy
                    </button>
                  </div>
                  <div className="action-buttons">
                    <button className="nav-btn">Browse Tasks</button>
                    <button className="nav-btn">Post a Task</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="features">
          <h3>Why Qlance?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h4>Smart Contract Escrow</h4>
              <p>Funds locked until work is approved. No disputes, no delays.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h4>Reputation System</h4>
              <p>Build trust through on-chain reputation scores.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌍</span>
              <h4>Global Access</h4>
              <p>Work with anyone, anywhere. No geographic barriers.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h4>AI Verification</h4>
              <p>Automated quality checks ensure fair outcomes.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Built for LabLab AI × Qubic Hackathon 2025</p>
        <p className="tech-stack">React + Vite + Qubic Blockchain</p>
      </footer>
    </div>
  )
}

export default App
