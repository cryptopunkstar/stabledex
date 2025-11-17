import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, X } from 'lucide-react';

const StableDEX = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState('sepolia');
  const [pair, setPair] = useState('USDC/EURC');
  const [direction, setDirection] = useState('long');
  const [leverage, setLeverage] = useState(2);
  const [collateral, setCollateral] = useState('');
  const [size, setSize] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [price, setPrice] = useState(1.09);
  const [connected, setConnected] = useState(false);
  const [positions, setPositions] = useState([]);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [priceHistory] = useState([
    { time: '00:00', price: 1.0850 },
    { time: '04:00', price: 1.0875 },
    { time: '08:00', price: 1.0890 },
    { time: '12:00', price: 1.0920 },
    { time: '16:00', price: 1.0905 },
    { time: '20:00', price: 1.0895 },
  ]);

  const networks = [
    { id: 'sepolia', name: 'ETH Sepolia', chainId: '0xaa36a7' },
    { id: 'arc', name: 'Arc Testnet', chainId: '0x14e4' },
    { id: 'base', name: 'Base Sepolia', chainId: '0x14a34' },
  ];

  const walletOptions = [
    { name: 'MetaMask', icon: '🦊' },
    { name: 'WalletConnect', icon: '🌐' },
    { name: 'Coinbase', icon: '◎' },
    { name: 'Phantom', icon: '👻' },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#fff',
      padding: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    maxWidth: { maxWidth: '1400px', margin: '0 auto' },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    logo: { display: 'flex', alignItems: 'center', gap: '10px' },
    logoBox: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
    },
    title: { fontSize: '28px', fontWeight: '700' },
    connectBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '14px',
      background: connected ? '#dc2626' : '#2563eb',
      color: '#fff',
      transition: 'all 0.3s',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    },
    modalContent: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '420px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      fontSize: '24px',
      padding: '0',
    },
    walletGrid: { display: 'grid', gap: '12px' },
    walletItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '14px 16px',
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    networkBox: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
    },
    label: { fontSize: '13px', fontWeight: '600', color: '#60a5fa', marginBottom: '10px' },
    networkGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '10px',
      marginBottom: '10px',
    },
    networkBtn: (active) => ({
      padding: '10px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      background: active ? '#2563eb' : '#334155',
      color: active ? '#fff' : '#cbd5e1',
      transition: 'all 0.3s',
    }),
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
      gap: '20px',
      marginBottom: '20px',
    },
    card: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
    },
    cardTitle: { fontSize: '16px', fontWeight: '700', marginBottom: '12px' },
    chart: {
      background: '#0f172a',
      borderRadius: '6px',
      padding: '10px',
      marginBottom: '12px',
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
    },
    statItem: { background: '#0f172a', borderRadius: '6px', padding: '10px' },
    statLabel: { fontSize: '11px', color: '#94a3b8', marginBottom: '4px' },
    statValue: { fontSize: '15px', fontWeight: '700' },
    formGroup: { marginBottom: '10px' },
    input: {
      width: '100%',
      padding: '8px 10px',
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '13px',
      boxSizing: 'border-box',
      marginTop: '4px',
    },
    buttonRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginTop: '8px',
    },
    btn: (active, isLong) => ({
      padding: '10px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: '600',
      fontSize: '13px',
      cursor: 'pointer',
      background: active ? (isLong ? '#16a34a' : '#dc2626') : '#334155',
      color: '#fff',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    }),
    tpslGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
    },
    openBtn: (connected) => ({
      width: '100%',
      padding: '12px',
      background: connected ? (direction === 'long' ? '#16a34a' : '#dc2626') : '#475569',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '700',
      fontSize: '14px',
      cursor: connected ? 'pointer' : 'not-allowed',
      opacity: connected ? 1 : 0.6,
      marginTop: '10px',
      transition: 'all 0.3s',
    }),
    slider: { width: '100%', marginTop: '6px' },
    rangeText: { fontSize: '11px', color: '#94a3b8', marginTop: '4px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
    tableHead: { background: '#0f172a', borderBottom: '1px solid #334155' },
    th: { padding: '10px', textAlign: 'left', fontWeight: '600', fontSize: '12px' },
    td: { padding: '10px', borderBottom: '1px solid #334155' },
    badge: (type) => ({
      display: 'inline-block',
      padding: '3px 6px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      background: type === 'long' ? '#064e3b' : '#7f1d1d',
      color: type === 'long' ? '#86efac' : '#fca5a5',
    }),
    pnlBadge: (value) => ({
      display: 'inline-block',
      padding: '3px 6px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      background: value >= 0 ? '#064e3b' : '#7f1d1d',
      color: value >= 0 ? '#86efac' : '#fca5a5',
    }),
    closeBtn: {
      padding: '4px 8px',
      background: '#dc2626',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '600',
    },
  };

  const connectWallet = () => {
    setShowWalletModal(true);
  };

  const connectWithProvider = async (provider) => {
    if (!window.ethereum) {
      alert('Please install a Web3 wallet!');
      return;
    }

    try {
      const selectedNetwork = networks.find(n => n.id === network);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.chainId }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: selectedNetwork.chainId,
              chainName: selectedNetwork.name,
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            }],
          });
        }
      }

      setAccount(accounts[0]);
      setConnected(true);
      setShowWalletModal(false);
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setConnected(false);
    setPositions([]);
  };

  const calculatePnL = (pos) => {
    const diff = pos.direction === 'long' ? price - pos.entry : pos.entry - price;
    const value = diff * pos.size * pos.leverage;
    const percent = (value / pos.collateral) * 100;
    return { value, percent };
  };

  const openPosition = () => {
    if (!connected) return alert('Connect wallet first');
    if (!collateral || !size) return alert('Enter collateral and size');

    setPositions([...positions, {
      id: Date.now(),
      pair,
      direction,
      collateral: parseFloat(collateral),
      size: parseFloat(size),
      leverage,
      entry: price,
      tp: takeProfit ? parseFloat(takeProfit) : null,
      sl: stopLoss ? parseFloat(stopLoss) : null,
      time: new Date().toLocaleTimeString(),
    }]);

    setCollateral('');
    setSize('');
    setTakeProfit('');
    setStopLoss('');
  };

  const closePosition = (id) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoBox}>$</div>
            <h1 style={styles.title}>StableDEX</h1>
          </div>
          <button
            onClick={connected ? disconnectWallet : connectWallet}
            style={styles.connectBtn}
            onMouseEnter={e => e.target.style.opacity = '0.8'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            <Wallet size={18} />
            {connected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        {/* Wallet Modal */}
        {showWalletModal && (
          <div style={styles.modal} onClick={() => setShowWalletModal(false)}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={{margin: 0, fontSize: '18px', fontWeight: '700'}}>Select Wallet</h3>
                <button style={styles.closeBtn} onClick={() => setShowWalletModal(false)}>
                  <X size={20} />
                </button>
              </div>
              <div style={styles.walletGrid}>
                {walletOptions.map(w => (
                  <div
                    key={w.name}
                    style={styles.walletItem}
                    onClick={() => connectWithProvider(w.name)}
                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                  >
                    <span style={{fontSize: '24px'}}>{w.icon}</span>
                    <div>
                      <div style={{fontWeight: '600'}}>{w.name}</div>
                      <div style={{fontSize: '11px', color: '#94a3b8'}}>Connect via {w.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Network Selector */}
        <div style={styles.networkBox}>
          <div style={styles.label}>NETWORK</div>
          <div style={styles.networkGrid}>
            {networks.map(n => (
              <button
                key={n.id}
                style={styles.networkBtn(network === n.id)}
                onClick={() => setNetwork(n.id)}
                onMouseEnter={e => !network.includes(n.id) && (e.target.style.background = '#475569')}
                onMouseLeave={e => !network.includes(n.id) && (e.target.style.background = '#334155')}
              >
                {n.name}
              </button>
            ))}
          </div>
          {connected && <div style={{fontSize: '11px', color: '#94a3b8', marginTop: '8px'}}>
            ✓ Connected: {networks.find(n => n.id === network).name}
          </div>}
        </div>

        <div style={styles.mainGrid}>
          {/* Chart */}
          <div style={styles.card}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
              <h2 style={styles.cardTitle}>CHART - {pair}</h2>
              <button
                onClick={() => setPair(pair === 'USDC/EURC' ? 'EURC/USDC' : 'USDC/EURC')}
                style={{padding: '6px 10px', background: '#334155', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', fontSize: '11px', fontWeight: '600'}}
              >
                Flip
              </button>
            </div>
            <div style={styles.chart}>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="time" stroke="#94a3b8" style={{fontSize: '11px'}} />
                  <YAxis stroke="#94a3b8" style={{fontSize: '11px'}} />
                  <Tooltip contentStyle={{background: '#0f172a', border: '1px solid #475569', fontSize: '11px'}} />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={styles.statsRow}>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>Price</div>
                <div style={styles.statValue}>${price.toFixed(4)}</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>24h High</div>
                <div style={styles.statValue}>$1.0920</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statLabel}>24h Low</div>
                <div style={styles.statValue}>$1.0850</div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>OPEN POSITION</h2>

            <div style={styles.formGroup}>
              <div style={styles.label}>POSITION TYPE</div>
              <div style={styles.buttonRow}>
                <button style={styles.btn(direction === 'long', true)} onClick={() => setDirection('long')}>
                  <TrendingUp size={14} /> Long
                </button>
                <button style={styles.btn(direction === 'short', false)} onClick={() => setDirection('short')}>
                  <TrendingDown size={14} /> Short
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <div style={styles.label}>LEVERAGE: {leverage}x</div>
              <input type="range" min="1" max="10" value={leverage} onChange={e => setLeverage(parseInt(e.target.value))} style={styles.slider} />
              <div style={styles.rangeText}>1x - 10x</div>
            </div>

            <div style={styles.formGroup}>
              <div style={styles.label}>COLLATERAL (USDC)</div>
              <input type="number" placeholder="0.00" value={collateral} onChange={e => setCollateral(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.formGroup}>
              <div style={styles.label}>SIZE</div>
              <input type="number" placeholder="0.00" value={size} onChange={e => setSize(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.tpslGrid}>
              <div style={styles.formGroup}>
                <div style={styles.label}>TAKE PROFIT</div>
                <input type="number" placeholder="0.00" value={takeProfit} onChange={e => setTakeProfit(e.target.value)} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <div style={styles.label}>STOP LOSS</div>
                <input type="number" placeholder="0.00" value={stopLoss} onChange={e => setStopLoss(e.target.value)} style={styles.input} />
              </div>
            </div>

            {collateral && size && (
              <div style={{background: '#0f172a', borderRadius: '6px', padding: '8px', fontSize: '12px', marginTop: '8px'}}>
                <div style={{color: '#94a3b8', marginBottom: '4px'}}>Notional: <span style={{color: '#fff', fontWeight: '600'}}>${(parseFloat(collateral) * parseFloat(size) * leverage).toFixed(2)}</span></div>
                <div style={{color: '#94a3b8'}}>Entry: <span style={{color: '#fff', fontWeight: '600'}}>${price.toFixed(4)}</span></div>
              </div>
            )}

            <button style={styles.openBtn(connected)} onClick={openPosition} onMouseEnter={e => connected && (e.target.style.opacity = '0.8')} onMouseLeave={e => connected && (e.target.style.opacity = '1')}>
              {direction === 'long' ? 'OPEN LONG' : 'OPEN SHORT'}
            </button>
          </div>
        </div>

        {/* Positions */}
        {positions.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>OPEN POSITIONS</h2>
            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead style={styles.tableHead}>
                  <tr>
                    {['Pair', 'Type', 'Collateral', 'Size', 'Lev', 'Entry', 'TP', 'SL', 'PnL', 'PnL %', 'Action'].map(h => (
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positions.map(pos => {
                    const pnl = calculatePnL(pos);
                    return (
                      <tr key={pos.id}>
                        <td style={styles.td}>{pos.pair}</td>
                        <td style={styles.td}><span style={styles.badge(pos.direction)}>{pos.direction.toUpperCase()}</span></td>
                        <td style={styles.td}>${pos.collateral.toFixed(2)}</td>
                        <td style={styles.td}>{pos.size.toFixed(4)}</td>
                        <td style={styles.td}>{pos.leverage}x</td>
                        <td style={styles.td}>${pos.entry.toFixed(4)}</td>
                        <td style={styles.td}>{pos.tp ? `$${pos.tp.toFixed(4)}` : '-'}</td>
                        <td style={styles.td}>{pos.sl ? `$${pos.sl.toFixed(4)}` : '-'}</td>
                        <td style={styles.td}><span style={styles.pnlBadge(pnl.value)}>{pnl.value >= 0 ? '+' : ''}{pnl.value.toFixed(2)}</span></td>
                        <td style={styles.td}><span style={styles.pnlBadge(pnl.percent)}>{pnl.percent >= 0 ? '+' : ''}{pnl.percent.toFixed(2)}%</span></td>
                        <td style={styles.td}><button style={styles.closeBtn} onClick={() => closePosition(pos.id)}>Close</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StableDEX;
