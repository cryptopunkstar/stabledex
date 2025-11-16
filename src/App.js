import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const PerpsDEX = () => {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState('sepolia');
  const [pair, setPair] = useState('USDC/EURC');
  const [direction, setDirection] = useState('long');
  const [leverage, setLeverage] = useState(2);
  const [collateral, setCollateral] = useState('');
  const [size, setSize] = useState('');
  const [price, setPrice] = useState(1.09);
  const [connected, setConnected] = useState(false);
  const [positions, setPositions] = useState([]);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [priceHistory, setPriceHistory] = useState([
    { time: '00:00', price: 1.0850 },
    { time: '04:00', price: 1.0875 },
    { time: '08:00', price: 1.0890 },
    { time: '12:00', price: 1.0920 },
    { time: '16:00', price: 1.0905 },
    { time: '20:00', price: 1.0895 },
  ]);

  const networks = [
    { id: 'sepolia', name: 'ETH Sepolia', chainId: '0xaa36a7', rpc: 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' },
    { id: 'arc', name: 'Arc Testnet', chainId: '0x14e4', rpc: 'https://rpc.arc.io/v1' },
    { id: 'base', name: 'Base Sepolia', chainId: '0x14a34', rpc: 'https://sepolia.base.org' },
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#fff',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    maxWidth: {
      maxWidth: '1280px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '32px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoBox: {
      width: '40px',
      height: '40px',
      background: '#2563eb',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
    },
    connectBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      background: connected ? '#dc2626' : '#2563eb',
      color: '#fff',
    },
    networkBox: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '12px',
      color: '#60a5fa',
    },
    networkButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '12px',
    },
    networkBtn: (isSelected) => ({
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      background: isSelected ? '#2563eb' : '#334155',
      color: isSelected ? '#fff' : '#cbd5e1',
    }),
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    card: {
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '24px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    chart: {
      background: '#0f172a',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
    },
    stat: {
      background: '#0f172a',
      borderRadius: '8px',
      padding: '12px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '4px',
    },
    statValue: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    formGroup: {
      marginBottom: '16px',
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '14px',
      boxSizing: 'border-box',
      marginTop: '8px',
    },
    directionButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      marginTop: '8px',
    },
    directionBtn: (isSelected, isLong) => ({
      padding: '12px',
      borderRadius: '6px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      background: isSelected ? (isLong ? '#16a34a' : '#dc2626') : '#334155',
      color: '#fff',
    }),
    openBtn: (connected) => ({
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: '16px',
      border: 'none',
      cursor: connected ? 'pointer' : 'not-allowed',
      transition: 'all 0.3s ease',
      background: connected ? (direction === 'long' ? '#16a34a' : '#dc2626') : '#475569',
      color: '#fff',
      opacity: connected ? 1 : 0.6,
      marginTop: '16px',
    }),
    estimateBox: {
      background: '#0f172a',
      borderRadius: '6px',
      padding: '12px',
      fontSize: '14px',
      marginTop: '8px',
    },
    estimateLine: {
      color: '#94a3b8',
      marginBottom: '4px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    tableHeader: {
      borderBottom: '1px solid #334155',
    },
    tableHeaderCell: {
      textAlign: 'left',
      padding: '12px',
      fontWeight: '600',
      color: '#e2e8f0',
    },
    tableRow: {
      borderBottom: '1px solid #334155',
    },
    tableCell: {
      padding: '12px',
      color: '#e2e8f0',
    },
    badge: (type) => ({
      display: 'inline-block',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
      background: type === 'long' ? '#064e3b' : '#7f1d1d',
      color: type === 'long' ? '#86efac' : '#fca5a5',
    }),
    closeBtn: {
      background: '#dc2626',
      border: 'none',
      color: '#fff',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
    },
    slider: {
      width: '100%',
      marginTop: '8px',
    },
    rangeText: {
      color: '#94a3b8',
      fontSize: '12px',
      marginTop: '4px',
    },
    stickyPanel: {
      position: 'sticky',
      top: '24px',
    },
    statusText: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '12px',
    },
    flipBtn: {
      background: '#334155',
      border: 'none',
      color: '#e2e8f0',
      padding: '8px 16px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another EVM wallet!');
      return;
    }

    try {
      const selectedNetwork = networks.find(n => n.id === network);
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: selectedNetwork.chainId,
              chainName: selectedNetwork.name,
              rpcUrls: [selectedNetwork.rpc],
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            }],
          });
        } else {
          throw switchError;
        }
      }

      setAccount(accounts[0]);
      setConnected(true);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setConnected(false);
    setPositions([]);
  };

  const openPosition = () => {
    if (!connected) {
      alert('Please connect wallet first');
      return;
    }
    if (!collateral || !size) {
      alert('Please enter collateral and size');
      return;
    }

    const newPosition = {
      id: positions.length + 1,
      pair,
      direction,
      collateral: parseFloat(collateral),
      size: parseFloat(size),
      leverage,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      timestamp: new Date().toLocaleTimeString(),
    };

    setPositions([...positions, newPosition]);
    setCollateral('');
    setSize('');
  };

  const closePosition = (id) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  const switchNetwork = async (newNetwork) => {
    setNetwork(newNetwork);
    if (connected) {
      const selectedNetwork = networks.find(n => n.id === newNetwork);
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: selectedNetwork.chainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: selectedNetwork.chainId,
              chainName: selectedNetwork.name,
              rpcUrls: [selectedNetwork.rpc],
            }],
          });
        }
      }
    }
  };

  const changePair = () => {
    setPair(pair === 'USDC/EURC' ? 'EURC/USDC' : 'USDC/EURC');
  };

  const calculatePNL = (position) => {
    const priceChange = position.currentPrice - position.entryPrice;
    let pnlValue = 0;
    let pnlPercent = 0;

    if (position.direction === 'long') {
      pnlValue = priceChange * position.size * position.leverage;
      pnlPercent = ((priceChange / position.entryPrice) * 100 * position.leverage);
    } else {
      pnlValue = -priceChange * position.size * position.leverage;
      pnlPercent = ((-priceChange / position.entryPrice) * 100 * position.leverage);
    }

    return { pnlValue, pnlPercent };
  };

  const updatePositionPrice = (positionId, newPrice) => {
    setPositions(positions.map(pos => 
      pos.id === positionId 
        ? { ...pos, currentPrice: newPrice }
        : pos
    ));
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
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
            style={styles.connectBtn}
          >
            <Wallet size={20} />
            {connected ? `${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>

        {/* Network Selector */}
        <div style={styles.networkBox}>
          <div style={styles.label}>Select Network</div>
          <div style={styles.networkButtons}>
            {networks.map(n => (
              <button
                key={n.id}
                onClick={() => switchNetwork(n.id)}
                onMouseEnter={(e) => {
                  if (network !== n.id) e.target.style.background = '#475569';
                }}
                onMouseLeave={(e) => {
                  if (network !== n.id) e.target.style.background = '#334155';
                }}
                style={styles.networkBtn(network === n.id)}
              >
                {n.name}
              </button>
            ))}
          </div>
          <div style={styles.statusText}>
            {connected && `Connected on: ${networks.find(n => n.id === network).name}`}
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* Chart Section */}
          <div>
            <div style={styles.card}>
              <div style={styles.chartHeader}>
                <h2 style={styles.cardTitle}>Chart - {pair}</h2>
                <button
                  onClick={changePair}
                  onMouseEnter={(e) => e.target.style.background = '#475569'}
                  onMouseLeave={(e) => e.target.style.background = '#334155'}
                  style={styles.flipBtn}
                >
                  Flip Pair
                </button>
              </div>
              <div style={styles.chart}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={['dataMin - 0.002', 'dataMax + 0.002']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      dot={{ fill: '#3b82f6', r: 4 }}
                      strokeWidth={2}
                      name="Price (USD)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={styles.statsGrid}>
                <div style={styles.stat}>
                  <div style={styles.statLabel}>Current Price</div>
                  <div style={styles.statValue}>${price.toFixed(4)}</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statLabel}>24h High</div>
                  <div style={styles.statValue}>$1.0920</div>
                </div>
                <div style={styles.stat}>
                  <div style={styles.statLabel}>24h Low</div>
                  <div style={styles.statValue}>$1.0850</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Panel */}
          <div style={styles.stickyPanel}>
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Open Position</h2>
              
              <div>
                {/* Direction */}
                <div style={styles.formGroup}>
                  <div style={styles.label}>Position Type</div>
                  <div style={styles.directionButtons}>
                    <button
                      onClick={() => setDirection('long')}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                      style={styles.directionBtn(direction === 'long', true)}
                    >
                      <TrendingUp size={18} /> Long
                    </button>
                    <button
                      onClick={() => setDirection('short')}
                      onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                      style={styles.directionBtn(direction === 'short', false)}
                    >
                      <TrendingDown size={18} /> Short
                    </button>
                  </div>
                </div>

                {/* Leverage */}
                <div style={styles.formGroup}>
                  <div style={styles.label}>Leverage: {leverage}x</div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                    style={styles.slider}
                  />
                  <div style={styles.rangeText}>Min: 1x | Max: 10x</div>
                </div>

                {/* Collateral */}
                <div style={styles.formGroup}>
                  <div style={styles.label}>Collateral (USDC)</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={collateral}
                    onChange={(e) => setCollateral(e.target.value)}
                    style={styles.input}
                  />
                </div>

                {/* Size */}
                <div style={styles.formGroup}>
                  <div style={styles.label}>Position Size</div>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    style={styles.input}
                  />
                </div>

                {/* Estimated Values */}
                {collateral && size && (
                  <div style={styles.estimateBox}>
                    <div style={styles.estimateLine}>
                      Notional: <span style={{color: '#fff', fontWeight: '600'}}>${(parseFloat(collateral) * parseFloat(size) * leverage).toFixed(2)}</span>
                    </div>
                    <div style={styles.estimateLine}>
                      Entry: <span style={{color: '#fff', fontWeight: '600'}}>${price.toFixed(4)}</span>
                    </div>
                  </div>
                )}

                {/* Open Button */}
                <button
                  onClick={openPosition}
                  onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                  style={styles.openBtn(connected)}
                >
                  {direction === 'long' ? 'Open Long' : 'Open Short'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        {positions.length > 0 && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Open Positions</h2>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Pair</th>
                  <th style={styles.tableHeaderCell}>Direction</th>
                  <th style={styles.tableHeaderCell}>Collateral</th>
                  <th style={styles.tableHeaderCell}>Size</th>
                  <th style={styles.tableHeaderCell}>Leverage</th>
                  <th style={styles.tableHeaderCell}>Entry Price</th>
                  <th style={styles.tableHeaderCell}>Current Price</th>
                  <th style={styles.tableHeaderCell}>PNL (USDC)</th>
                  <th style={styles.tableHeaderCell}>PNL %</th>
                  <th style={{...styles.tableHeaderCell, textAlign: 'center'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(pos => {
                  const { pnlValue, pnlPercent } = calculatePNL(pos);
                  const isProfitable = pnlValue >= 0;
                  return (
                  <tr key={pos.id} style={{...styles.tableRow, background: 'rgba(51, 65, 85, 0.2)'}}>
                    <td style={styles.tableCell}>{pos.pair}</td>
                    <td style={styles.tableCell}>
                      <span style={styles.badge(pos.direction)}>
                        {pos.direction.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.tableCell}>${pos.collateral.toFixed(2)}</td>
                    <td style={styles.tableCell}>{pos.size.toFixed(4)}</td>
                    <td style={styles.tableCell}>{pos.leverage}x</td>
                    <td style={styles.tableCell}>${pos.entryPrice.toFixed(4)}</td>
                    <td style={styles.tableCell}>
                      <input
                        type="number"
                        step="0.0001"
                        value={pos.currentPrice}
                        onChange={(e) => updatePositionPrice(pos.id, parseFloat(e.target.value))}
                        style={{...styles.input, width: '100px', padding: '4px 8px'}}
                      />
                    </td>
                    <td style={{...styles.tableCell, color: isProfitable ? '#86efac' : '#fca5a5', fontWeight: 'bold'}}>
                      {isProfitable ? '+' : ''}{pnlValue.toFixed(2)} USDC
                    </td>
                    <td style={{...styles.tableCell, color: isProfitable ? '#86efac' : '#fca5a5', fontWeight: 'bold'}}>
                      {isProfitable ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </td>
                    <td style={{...styles.tableCell, textAlign: 'center'}}>
                      <button
                        onClick={() => closePosition(pos.id)}
                        onMouseEnter={(e) => e.target.style.background = '#b91c1c'}
                        onMouseLeave={(e) => e.target.style.background = '#dc2626'}
                        style={styles.closeBtn}
                      >
                        Close
                      </button>
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerpsDEX;