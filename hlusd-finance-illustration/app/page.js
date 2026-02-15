'use client';


import { useEffect, useMemo, useState } from 'react';


import TargetCursor from './components/TargetCursor';


import { ethers } from "ethers";
import contractABI from "../contracts/MyContract.json";


const contractAddress = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";


// Ethers v5/v6 compatibility helpers
function getBrowserProvider() {
  if (typeof window === 'undefined' || !window.ethereum) return null;
  if (ethers.BrowserProvider) return new ethers.BrowserProvider(window.ethereum);
  if (ethers.providers && ethers.providers.Web3Provider) return new ethers.providers.Web3Provider(window.ethereum);
  return null;
}

function formatUnits(value, decimals = 18) {
  if (ethers.formatUnits) return ethers.formatUnits(value, decimals);
  if (ethers.utils && ethers.utils.formatUnits) return ethers.utils.formatUnits(value, decimals);
  return String(value);
}

function parseUnits(value, decimals = 18) {
  if (ethers.parseUnits) return ethers.parseUnits(value, decimals);
  if (ethers.utils && ethers.utils.parseUnits) return ethers.utils.parseUnits(value, decimals);
  throw new Error('No parseUnits available on ethers');
}

function formatEther(value) {
  if (ethers.formatEther) return ethers.formatEther(value);
  if (ethers.utils && ethers.utils.formatEther) return ethers.utils.formatEther(value);
  return String(value);
}



const INITIAL_STREAMS = [
  { id: 1, employee: 'Aarush', rate: 52, taxRate: 12, status: 'active', accrued: 210.5, withdrawn: 60 },
  { id: 2, employee: 'Maya', rate: 38, taxRate: 10, status: 'paused', accrued: 120.3, withdrawn: 40 },
  { id: 3, employee: 'Ravi', rate: 44, taxRate: 11, status: 'completed', accrued: 410.0, withdrawn: 410.0 },
];


const INITIAL_ROLES = [
  { id: 1, role: 'Admin', wallet: '0xAdmin001' },
  { id: 2, role: 'HR', wallet: '0xHR001' },
];


function fmtNum(num) {
  return Number(num).toFixed(2);
}


function fmtCurrency(num) {
  return `$${Number(num).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


function nowLabel() {
  return new Date().toLocaleString();
}


function toCsv(headers, rows) {
  const csvRows = [headers.join(',')];
  rows.forEach((row) => {
    csvRows.push(
      row
        .map((cell) => {
          const text = String(cell ?? '');
          return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(',')
    );
  });
  return csvRows.join('\n');
}


function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


function HLUSDMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="hlusdRingReact" x1="14%" y1="10%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#58d8df" />
          <stop offset="100%" stopColor="#2dcf98" />
        </linearGradient>
        <linearGradient id="hlusdGlyphReact" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#57d9d4" />
          <stop offset="100%" stopColor="#3dc5df" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="104" fill="#f4fbff" stroke="url(#hlusdRingReact)" strokeWidth="15" />
      <circle cx="66" cy="120" r="10" fill="url(#hlusdGlyphReact)" />
      <circle cx="174" cy="120" r="10" fill="url(#hlusdGlyphReact)" />
      <path d="M92 80 C102 80 108 88 108 98 C108 105 105 110 102 114 L102 126 C105 130 108 135 108 142 C108 152 102 160 92 160 C82 160 76 152 76 142 C76 135 79 130 82 126 L82 114 C79 110 76 105 76 98 C76 88 82 80 92 80 Z" fill="url(#hlusdGlyphReact)" />
      <path d="M148 80 C158 80 164 88 164 98 C164 105 161 110 158 114 L158 126 C161 130 164 135 164 142 C164 152 158 160 148 160 C138 160 132 152 132 142 C132 135 135 130 138 126 L138 114 C135 110 132 105 132 98 C132 88 138 80 148 80 Z" fill="url(#hlusdGlyphReact)" />
      <path d="M120 86 C132 86 132 102 120 116 C108 130 108 146 120 154 C132 146 132 130 120 116 C108 102 108 86 120 86 Z" fill="url(#hlusdGlyphReact)" />
    </svg>
  );
}


function HLUSDLogo({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden="true">
      <defs>
        <linearGradient id="hlusdRingReactText" x1="14%" y1="10%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#58d8df" />
          <stop offset="100%" stopColor="#2dcf98" />
        </linearGradient>
        <linearGradient id="hlusdGlyphReactText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#57d9d4" />
          <stop offset="100%" stopColor="#3dc5df" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="104" fill="#f4fbff" stroke="url(#hlusdRingReactText)" strokeWidth="15" />
      <circle cx="66" cy="120" r="10" fill="url(#hlusdGlyphReactText)" />
      <circle cx="174" cy="120" r="10" fill="url(#hlusdGlyphReactText)" />
      <path d="M92 80 C102 80 108 88 108 98 C108 105 105 110 102 114 L102 126 C105 130 108 135 108 142 C108 152 102 160 92 160 C82 160 76 152 76 142 C76 135 79 130 82 126 L82 114 C79 110 76 105 76 98 C76 88 82 80 92 80 Z" fill="url(#hlusdGlyphReactText)" />
      <path d="M148 80 C158 80 164 88 164 98 C164 105 161 110 158 114 L158 126 C161 130 164 135 164 142 C164 152 158 160 148 160 C138 160 132 152 132 142 C132 135 135 130 138 126 L138 114 C135 110 132 105 132 98 C132 88 138 80 148 80 Z" fill="url(#hlusdGlyphReactText)" />
      <path d="M120 86 C132 86 132 102 120 116 C108 130 108 146 120 154 C132 146 132 130 120 116 C108 102 108 86 120 86 Z" fill="url(#hlusdGlyphReactText)" />
      <text x="120" y="194" textAnchor="middle" fontSize="33" fontFamily="Nunito, sans-serif" fontWeight="700" fill="#97a6af">HLUSD</text>
    </svg>
  );
}


export default function Page() {
  // provider / signer helper with address guard
  async function getContract() {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return null;
    }

    if (!isValidAddress(contractAddress)) {
      alert('Set a valid `contractAddress` in app/page.js before interacting with the blockchain.');
      return null;
    }

    const provider = (() => {
      if (ethers.BrowserProvider) return new ethers.BrowserProvider(window.ethereum);
      if (ethers.providers && ethers.providers.Web3Provider) return new ethers.providers.Web3Provider(window.ethereum);
      return null;
    })();

    if (!provider) {
      alert('No browser Ethereum provider found');
      return null;
    }

    if (provider.send) await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner ? await provider.getSigner() : provider.getSigner();

    return new ethers.Contract(contractAddress, contractABI.abi, signer);
  }


  const [session, setSession] = useState(null);
  const [loginRole, setLoginRole] = useState('HR');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');


  const [treasuryBalance, setTreasuryBalance] = useState("0");


  const [taxVaultBalance, setTaxVaultBalance] = useState(0);
  const [defaultTaxRetention, setDefaultTaxRetention] = useState(12);
  const [vaultWallet, setVaultWallet] = useState('0xTaxVaultHLUSD');
  const [autoRemit, setAutoRemit] = useState(true);


  const [streams, setStreams] = useState(INITIAL_STREAMS);
  const [bonuses, setBonuses] = useState([]);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [treasuryTx, setTreasuryTx] = useState([{ time: nowLabel(), type: 'system_init', amount: 0, details: 'Dashboard initialized' }]);
  const [taxTx, setTaxTx] = useState([]);
  const [wallets, setWallets] = useState({});
  const [supportTickets, setSupportTickets] = useState([]);


  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('');


  const [employeeName, setEmployeeName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('50');
  const [taxRate, setTaxRate] = useState('12');


  const [bonusEmployee, setBonusEmployee] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusDate, setBonusDate] = useState('');


  const [roleType, setRoleType] = useState('HR');
  const [roleWallet, setRoleWallet] = useState('');


  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawOut, setWithdrawOut] = useState({ gross: '0.00', tax: '0.00', net: '0.00' });


  const [taxYear, setTaxYear] = useState('2026');
  const [certificateInfo, setCertificateInfo] = useState('No certificate downloaded yet.');
  const [employeeWallet, setEmployeeWallet] = useState('');
  const [supportMessage, setSupportMessage] = useState('');


  const isHR = session?.role === 'HR';


  const nextIds = useMemo(() => {
    const maxStream = streams.reduce((max, s) => Math.max(max, s.id), 0);
    const maxBonus = bonuses.reduce((max, b) => Math.max(max, b.id), 0);
    const maxRole = roles.reduce((max, r) => Math.max(max, r.id), 0);
    const maxTicket = supportTickets.reduce((max, t) => Math.max(max, t.id), 0);
    return {
      stream: maxStream + 1,
      bonus: maxBonus + 1,
      role: maxRole + 1,
      ticket: maxTicket + 1,
    };
  }, [streams, bonuses, roles, supportTickets]);


  const employeeOptions = useMemo(() => {
    if (!session) return [];
    if (!isHR) return [session.name];
    return [...new Set(streams.map((s) => s.employee))];
  }, [session, isHR, streams]);


  const visibleStreams = useMemo(() => {
    if (!session) return [];
    if (isHR) {
      return streams.filter((s) => (currentFilter === 'all' ? true : s.status === currentFilter));
    }
    return streams.filter((s) => s.employee === session.name);
  }, [session, isHR, streams, currentFilter]);


  const selectedEmployeeTotals = useMemo(() => {
    if (!selectedEmployee) return { streams: [], accrued: 0, withdrawn: 0, available: 0 };
    const scoped = streams.filter((s) => s.employee === selectedEmployee);
    const accrued = scoped.reduce((sum, s) => sum + s.accrued, 0);
    const withdrawn = scoped.reduce((sum, s) => sum + s.withdrawn, 0);
    return { streams: scoped, accrued, withdrawn, available: Math.max(accrued - withdrawn, 0) };
  }, [isHR, selectedEmployee, streams]);


  const counts = useMemo(() => {
    if (!session) return { active: 0, paused: 0, completed: 0 };
    if (isHR) {
      return {
        active: streams.filter((s) => s.status === 'active').length,
        paused: streams.filter((s) => s.status === 'paused').length,
        completed: streams.filter((s) => s.status === 'completed').length,
      };
    }
    return {
      active: streams.filter((s) => s.employee === session.name && s.status === 'active').length,
      paused: 0,
      completed: 0,
    };
  }, [session, isHR, streams]);


  const filteredTreasuryTx = useMemo(() => {
    if (!session) return [];
    if (isHR) return treasuryTx;
    return treasuryTx.filter((tx) => tx.details.includes(session.name));
  }, [session, isHR, treasuryTx]);


  const filteredSupportTickets = useMemo(() => {
    if (!session) return [];
    if (isHR) return supportTickets;
    return supportTickets.filter((t) => t.employee === session.name);
  }, [session, isHR, supportTickets]);


  useEffect(() => {
    if (!session) return;
    if (employeeOptions.length === 0) {
      setSelectedEmployee('');
      return;
    }
    if (!employeeOptions.includes(selectedEmployee)) {
      setSelectedEmployee(employeeOptions[0]);
    }
  }, [session, selectedEmployee, employeeOptions]);


  useEffect(() => {
    if (!session || !selectedEmployee) {
      setEmployeeWallet('');
      return;
    }
    setEmployeeWallet(wallets[selectedEmployee] || '');
  }, [session, selectedEmployee, wallets]);


  useEffect(() => {
    const timer = setInterval(() => {
      setStreams((prev) => prev.map((s) => (s.status === 'active' ? { ...s, accrued: s.accrued + s.rate / 3600 } : s)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  function addTreasuryTx(type, amount, details) {
    setTreasuryTx((prev) => [{ time: nowLabel(), type, amount, details }, ...prev].slice(0, 40));
  }


  function addTaxTx(type, amount, details) {
    setTaxTx((prev) => [{ time: nowLabel(), type, amount, details }, ...prev].slice(0, 60));
  }


  function handleLogin(e) {
    e.preventDefault();
    const name = loginName.trim();
    if (!name) {
      setLoginError('Name is required.');
      return;
    }
    const valid = loginRole === 'HR' ? loginPassword === 'hr123' : loginPassword === 'user123';
    if (!valid) {
      setLoginError('Invalid credentials for selected role.');
      return;
    }
    setLoginError('');
    setSession({ role: loginRole, name });
  }


  function handleLogout() {
    setSession(null);
    setLoginName('');
    setLoginPassword('');
    setLoginError('');
    setSelectedEmployee('');
    setWithdrawOut({ gross: '0.00', tax: '0.00', net: '0.00' });
  }


  async function handleStreamCreate(e) {
  e.preventDefault();
  if (!isHR) return;


  const employee = employeeName.trim();
  const rate = Number(hourlyRate);
  const tax = Number(taxRate);


  if (!employee || rate <= 0 || tax < 0) return;


  const contract = await getContract();
  if (!contract) return;


  try {
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 30 * 24 * 60 * 60; // 30 days example


    const tx = await contract.createStream(
      employeeWallet,
      parseUnits(rate.toString(), 18),
      startTime,
      endTime
    );


    await tx.wait();
    alert("Stream created on blockchain!");


  } catch (err) {
    console.error(err);
  }
}



  function updateStreamStatus(id, action) {
    if (!isHR) return;
    setStreams((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (action === 'pause' && s.status === 'active') return { ...s, status: 'paused' };
        if (action === 'resume' && s.status === 'paused') return { ...s, status: 'active' };
        if (action === 'cancel' && ['active', 'paused'].includes(s.status)) return { ...s, status: 'canceled' };
        if (action === 'complete' && ['active', 'paused'].includes(s.status)) return { ...s, status: 'completed' };
        return s;
      })
    );
    const stream = streams.find((s) => s.id === id);
    if (stream) addTreasuryTx(`stream_${action}`, 0, `${action} stream #${stream.id} (${stream.employee})`);
  }


  function handleTaxVaultSave(e) {
    e.preventDefault();
    if (!isHR) return;
    addTaxTx('vault_update', 0, 'Updated vault configuration');
  }


  function handleBonusAdd(e) {
    e.preventDefault();
    if (!isHR) return;
    const item = {
      id: nextIds.bonus,
      employee: bonusEmployee.trim(),
      amount: Number(bonusAmount),
      date: bonusDate,
      status: 'scheduled',
    };
    if (!item.employee || item.amount <= 0 || !item.date) return;
    setBonuses((prev) => [item, ...prev]);
    addTreasuryTx('bonus_scheduled', 0, `Bonus scheduled for ${item.employee}`);
    setBonusEmployee('');
    setBonusAmount('');
    setBonusDate('');
  }


  function handleBonusAction(id, action) {
    if (!isHR) return;
    if (action === 'pay') {
      const bonus = bonuses.find((b) => b.id === id);
      if (!bonus || bonus.status !== 'scheduled') return;
      setBonuses((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'paid' } : b)));
      setTreasuryBalance((prev) => prev - bonus.amount);
      addTreasuryTx('bonus_paid', bonus.amount, `Paid bonus to ${bonus.employee}`);
      return;
    }
    if (action === 'remove') {
      setBonuses((prev) => prev.filter((b) => b.id !== id));
    }
  }


  function handleRoleAdd(e) {
    e.preventDefault();
    if (!isHR) return;
    const wallet = roleWallet.trim();
    if (!wallet) return;
    setRoles((prev) => [...prev, { id: nextIds.role, role: roleType, wallet }]);
    setRoleWallet('');
  }


  function handleRoleRemove(id) {
    if (!isHR) return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }


  async function handleWithdraw(e) {
  e.preventDefault();
  if (!selectedEmployee) return;


  const amount = Number(withdrawAmount);
  if (Number.isNaN(amount) || amount <= 0) return;


  const contract = await getContract();
  if (!contract) return;


  try {
    const streamId = 1; // for testing – later we link real ID


    const tx = await contract.withdraw(streamId);
    await tx.wait();


    const activeStream = streams.find((s) => s.employee === selectedEmployee && s.status === 'active') || selectedEmployeeTotals.streams[0];
    const applicableTaxRate = activeStream ? activeStream.taxRate : defaultTaxRetention;
    const tax = (amount * applicableTaxRate) / 100;
    const net = amount - tax;


    let remaining = amount;
    setStreams((prev) =>
      prev.map((s) => {
        if (s.employee !== selectedEmployee) return s;
        const available = Math.max(s.accrued - s.withdrawn, 0);
        const take = Math.min(available, remaining);
        remaining -= take;
        return { ...s, withdrawn: s.withdrawn + take };
      })
    );


    setTreasuryBalance((prev) => prev - amount);
    if (autoRemit) setTaxVaultBalance((prev) => prev + tax);


    addTreasuryTx('withdrawal', amount, `${selectedEmployee} withdrew ${fmtNum(net)} HLUSD net`);
    addTaxTx('withholding', tax, `Withheld for ${selectedEmployee}`);


    setWithdrawOut({ gross: fmtNum(amount), tax: fmtNum(tax), net: fmtNum(net) });
    setWithdrawAmount('');


    alert("Withdraw successful!");
  } catch (err) {
    console.error(err);
  }
}


  function handleCertificateDownload(e) {
    e.preventDefault();
    if (!selectedEmployee) return;
    const year = Number(taxYear);
    const employeeTax = taxTx.filter((tx) => tx.details.includes(selectedEmployee)).reduce((sum, tx) => sum + tx.amount, 0);
    const cert = {
      employee: selectedEmployee,
      year,
      taxWithheldHLUSD: Number(employeeTax.toFixed(2)),
      generatedAt: new Date().toISOString(),
    };
    downloadFile(`tax-certificate-${selectedEmployee}-${year}.json`, JSON.stringify(cert, null, 2), 'application/json');
    setCertificateInfo(`Downloaded certificate for ${selectedEmployee} (${year}).`);
  }


  function handleWalletSave(e) {
    e.preventDefault();
    if (!selectedEmployee || !employeeWallet.trim()) return;
    setWallets((prev) => ({ ...prev, [selectedEmployee]: employeeWallet.trim() }));
    alert(`Wallet saved for ${selectedEmployee}.`);
  }


  function handleSupportSubmit(e) {
    e.preventDefault();
    if (!selectedEmployee || !supportMessage.trim()) return;
    setSupportTickets((prev) => [{ id: nextIds.ticket, employee: selectedEmployee, message: supportMessage.trim(), status: 'Open' }, ...prev]);
    setSupportMessage('');
  }


  function exportPayrollCsv() {
    if (!isHR) return;
    const rows = streams.map((s) => [s.id, s.employee, s.status, s.rate, fmtNum(s.accrued), fmtNum(s.withdrawn), s.taxRate]);
    downloadFile('payroll-report.csv', toCsv(['id', 'employee', 'status', 'rate_hr', 'accrued', 'withdrawn', 'tax_rate'], rows), 'text/csv');
  }


  function exportPayrollJson() {
    if (!isHR) return;
    downloadFile('payroll-report.json', JSON.stringify(streams, null, 2), 'application/json');
  }


  function exportTaxCsv() {
    if (!isHR) return;
    const rows = taxTx.map((t) => [t.time, t.type, t.amount, t.details]);
    downloadFile('tax-report.csv', toCsv(['time', 'type', 'amount', 'details'], rows), 'text/csv');
  }


  function exportTaxJson() {
    if (!isHR) return;
    const taxData = { vaultWallet, taxVaultBalance, transactions: taxTx };
    downloadFile('tax-report.json', JSON.stringify(taxData, null, 2), 'application/json');
  }


  const taxReport = [
    `Vault Wallet: ${vaultWallet}`,
    `Default Retention: ${fmtNum(defaultTaxRetention)}%`,
    `Auto Remit: ${autoRemit ? 'ON' : 'OFF'}`,
    `Tax Vault Balance: ${fmtCurrency(taxVaultBalance)}`,
    `Total Collected: ${fmtCurrency(taxTx.reduce((sum, tx) => sum + tx.amount, 0))}`,
    `Projected Liability: ${fmtCurrency(streams.reduce((sum, s) => sum + (s.accrued * s.taxRate) / 100, 0))}`,
  ].join('\n');


  return (
    <>
      <div>
        <TargetCursor 
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
    hoverDuration={0.2}
  />
        <div className="button"></div>
      </div>
      {!session && (
        <section className="login-view">
          <div className="login-card">
            <div className="brand"><HLUSDMark className="brand-logo" />HLUSD Payroll Login</div>
            <p className="muted">Sign in as HR or User before entering the dashboard.</p>
            <form className="form-grid" onSubmit={handleLogin}>
              <label>
                Role
                <select value={loginRole} onChange={(e) => setLoginRole(e.target.value)}>
                  <option value="HR">HR</option>
                  <option value="User">User</option>
                </select>
              </label>
              <label>
                Name
                <input type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Aarush" required />
              </label>
              <label>
                Password
                <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Enter password" required />
              </label>
              <button type="submit" className="primary-btn">Login</button>
            </form>
            <p className="muted small">Demo credentials: HR = <strong>hr123</strong>, User = <strong>user123</strong></p>
            <p className="error-text">{loginError}</p>
          </div>
        </section>
      )}


      {session && (
        <>
          <header className="topbar">
            <div className="brand"><HLUSDMark className="brand-logo" />HLUSD Payroll</div>
            <nav>
              <a href="#scene">Overview</a>
              {isHR && <a href="#hr-dashboard">HR Dashboard</a>}
              <a href="#employee-portal">Employee Portal</a>
            </nav>
            <div className="session-controls">
              <span className="chip active">{session.role}: {session.name}</span>
              {isHR && (
                <button className="primary-btn" onClick={() => document.getElementById('hr-dashboard')?.scrollIntoView({ behavior: 'smooth' })}>
                  Open Dashboard
                </button>
              )}
              <button className="ghost-btn" onClick={handleLogout}>Logout</button>
            </div>
          </header>


          <main>
            <section className="hero" id="scene">
              <div className="sky-decor" aria-hidden="true">
                <span className="cloud c1" />
                <span className="cloud c2" />
                <span className="cloud c3" />
              </div>


              <div className="hero-head">
                <div className="badge">Payroll + Tax Automation</div>
                <h1>HLUSD</h1>
                <p>HR and employee operations with streaming salary controls, treasury/tax visibility, exports, and wallet-first payroll actions.</p>
              </div>


              <div className="scene-wrap">
                <div className="arrows" aria-hidden="true">
                  <span className="arrow a1" />
                  <span className="arrow a2" />
                  <span className="arrow a3" />
                </div>
                <div className="float-coins" aria-hidden="true">
                  <span className="fcoin fc1">$</span>
                  <span className="fcoin fc2">$</span>
                  <span className="fcoin fc3">$</span>
                  <span className="fcoin fc4">$</span>
                  <span className="fcoin fc5">$</span>
                </div>


                <div className="coin coin-main"><HLUSDLogo className="hlusd-logo large" /></div>
                <div className="coin coin-1"><HLUSDMark className="hlusd-logo small" /></div>
                <div className="coin coin-2"><HLUSDMark className="hlusd-logo small" /></div>
                <div className="coin coin-3"><HLUSDMark className="hlusd-logo small" /></div>


                <div className="cash-stack stack-1" />
                <div className="cash-stack stack-2" />


                <div className="money-bag"><span className="bag-knot" /><span className="bag-mark">H</span></div>


                <div className="monitor">
                  <div className="screen">
                    <div className="bars"><span /><span /><span /><span /><span /></div>
                    <svg viewBox="0 0 220 80" className="line" aria-hidden="true">
                      <polyline points="0,72 30,58 55,61 88,44 117,46 142,30 168,34 198,18 220,8" />
                    </svg>
                  </div>
                  <div className="base" />
                </div>
              </div>
            </section>


            <section className="metrics" id="metrics">
              <article><p>Treasury Balance</p><h3>{fmtCurrency(treasuryBalance)}</h3></article>
              <article><p>{isHR ? 'Active Streams' : 'Your Active Streams'}</p><h3>{counts.active}</h3></article>
              {isHR && <article><p>Paused Streams</p><h3>{counts.paused}</h3></article>}
              {isHR && <article><p>Completed Streams</p><h3>{counts.completed}</h3></article>}
            </section>


            {isHR && (
              <section id="hr-dashboard" className="feature-section">
                <div className="section-title">
                  <h2>HR Dashboard</h2>
                  <p>Start, pause, resume, cancel streams, manage treasury and taxes, schedule bonuses, export reports, and control roles.</p>
                </div>


                <div className="feature-grid">
                  <article className="panel">
                    <h3>Salary Stream Control</h3>
                    <form className="form-grid" onSubmit={handleStreamCreate}>
                      <label>Employee<input value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} type="text" placeholder="Aarush" required /></label>
                      <label>Rate (HLUSD/hour)<input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} type="number" min="1" step="0.01" required /></label>
                      <label>Tax %<input value={taxRate} onChange={(e) => setTaxRate(e.target.value)} type="number" min="0" max="60" step="0.1" required /></label>
                      <button type="submit" className="primary-btn">Start Stream</button>
                    </form>
                    <div className="stream-filters">
                      {['all', 'active', 'paused', 'completed', 'canceled'].map((f) => (
                        <button key={f} type="button" onClick={() => setCurrentFilter(f)} className={`chip ${currentFilter === f ? 'active' : ''}`}>
                          {f[0].toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Employee</th><th>Status</th><th>Rate/hr</th><th>Accrued</th><th>Actions</th></tr></thead>
                        <tbody>
                          {visibleStreams.length === 0 && <tr><td colSpan={5}>No streams found.</td></tr>}
                          {visibleStreams.map((s) => (
                            <tr key={s.id}>
                              <td>{s.employee}</td>
                              <td><span className={`status ${s.status}`}>{s.status}</span></td>
                              <td>{fmtNum(s.rate)}</td>
                              <td>{fmtNum(s.accrued)}</td>
                              <td>
                                <div className="actions">
                                  {s.status === 'active' && <button type="button" onClick={() => updateStreamStatus(s.id, 'pause')}>Pause</button>}
                                  {s.status === 'paused' && <button type="button" onClick={() => updateStreamStatus(s.id, 'resume')}>Resume</button>}
                                  {['active', 'paused'].includes(s.status) && <button type="button" onClick={() => updateStreamStatus(s.id, 'complete')}>Complete</button>}
                                  {['active', 'paused'].includes(s.status) && <button type="button" onClick={() => updateStreamStatus(s.id, 'cancel')}>Cancel</button>}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>


                  <article className="panel">
                    <h3>Treasury & Transactions</h3>
                    <p className="muted">Treasury Balance: <strong>{fmtCurrency(treasuryBalance)}</strong></p>
                    <div className="table-wrap short">
                      <table>
                        <thead><tr><th>Time</th><th>Type</th><th>Amount</th><th>Details</th></tr></thead>
                        <tbody>
                          {filteredTreasuryTx.length === 0 && <tr><td colSpan={4}>No transactions yet.</td></tr>}
                          {filteredTreasuryTx.map((t, i) => (
                            <tr key={`${t.time}-${i}`}><td>{t.time}</td><td>{t.type}</td><td>{fmtCurrency(t.amount)}</td><td>{t.details}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>


                  <article className="panel">
                    <h3>Tax Vault</h3>
                    <form className="form-grid" onSubmit={handleTaxVaultSave}>
                      <label>Vault Wallet<input value={vaultWallet} onChange={(e) => setVaultWallet(e.target.value)} type="text" required /></label>
                      <label>Default Retention %<input value={defaultTaxRetention} onChange={(e) => setDefaultTaxRetention(Number(e.target.value))} type="number" min="0" max="60" step="0.1" required /></label>
                      <label className="check"><input checked={autoRemit} onChange={(e) => setAutoRemit(e.target.checked)} type="checkbox" /> Auto remit taxes on withdraw</label>
                      <button type="submit" className="primary-btn">Save Tax Vault</button>
                    </form>
                    <pre className="report-box">{taxReport}</pre>
                  </article>


                  <article className="panel">
                    <h3>Scheduled Bonuses</h3>
                    <form className="form-grid" onSubmit={handleBonusAdd}>
                      <label>Employee<input value={bonusEmployee} onChange={(e) => setBonusEmployee(e.target.value)} type="text" required /></label>
                      <label>Bonus Amount (HLUSD)<input value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} type="number" min="1" step="0.01" required /></label>
                      <label>Schedule Date<input value={bonusDate} onChange={(e) => setBonusDate(e.target.value)} type="date" required /></label>
                      <button type="submit" className="primary-btn">Schedule Bonus</button>
                    </form>
                    <ul className="list">
                      {bonuses.length === 0 && <li>No scheduled bonuses.</li>}
                      {bonuses.map((b) => (
                        <li key={b.id}>
                          <span>{b.employee} • {fmtNum(b.amount)} HLUSD • {b.date} • {b.status}</span>
                          <div className="actions">
                            {b.status === 'scheduled' && <button type="button" onClick={() => handleBonusAction(b.id, 'pay')}>Mark Paid</button>}
                            <button type="button" onClick={() => handleBonusAction(b.id, 'remove')}>Remove</button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>


                  <article className="panel">
                    <h3>Exports</h3>
                    <div className="button-row">
                      <button type="button" className="ghost-btn" onClick={exportPayrollCsv}>Export Payroll CSV</button>
                      <button type="button" className="ghost-btn" onClick={exportPayrollJson}>Export Payroll JSON</button>
                      <button type="button" className="ghost-btn" onClick={exportTaxCsv}>Export Tax CSV</button>
                      <button type="button" className="ghost-btn" onClick={exportTaxJson}>Export Tax JSON</button>
                    </div>
                  </article>


                  <article className="panel">
                    <h3>Role Management</h3>
                    <form className="form-grid" onSubmit={handleRoleAdd}>
                      <label>Role
                        <select value={roleType} onChange={(e) => setRoleType(e.target.value)}>
                          <option value="HR">HR</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </label>
                      <label>Wallet<input value={roleWallet} onChange={(e) => setRoleWallet(e.target.value)} type="text" placeholder="0x..." required /></label>
                      <button type="submit" className="primary-btn">Add Role</button>
                    </form>
                    <ul className="list">
                      {roles.map((r) => (
                        <li key={r.id}>
                          <span>{r.role} • {r.wallet}</span>
                          <button type="button" className="ghost-btn" onClick={() => handleRoleRemove(r.id)}>Remove</button>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </section>
            )}


            <section id="employee-portal" className="feature-section">
              <div className="section-title">
                <h2>Employee Portal</h2>
                <p>Track live earnings, withdraw with tax breakdown, view stream history, download tax certificate, and manage wallet/support.</p>
              </div>


              <div className="feature-grid employee-grid">
                <article className="panel">
                  <h3>Real-Time Earnings</h3>
                  <label>Employee
                    <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} disabled={!isHR}>
                      {employeeOptions.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </label>
                  <p className="big-number">{fmtNum(selectedEmployeeTotals.available)} HLUSD</p>
                  <p className="muted">Current Stream Status: <strong>{selectedEmployeeTotals.streams.find((s) => s.status === 'active')?.status || selectedEmployeeTotals.streams[0]?.status || 'N/A'}</strong></p>
                </article>


                <article className="panel">
                  <h3>Withdraw Funds</h3>
                  <form className="form-grid" onSubmit={handleWithdraw}>
                    <label>Amount (HLUSD)<input value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} type="number" min="1" step="0.01" required /></label>
                    <button type="submit" className="primary-btn">Withdraw</button>
                  </form>
                  <div className="split">
                    <p>Gross: <strong>{withdrawOut.gross}</strong></p>
                    <p>Tax: <strong>{withdrawOut.tax}</strong></p>
                    <p>Net: <strong>{withdrawOut.net}</strong></p>
                  </div>
                </article>


                <article className="panel wide">
                  <h3>Stream Status & History</h3>
                  <div className="table-wrap short">
                    <table>
                      <thead><tr><th>Stream</th><th>Status</th><th>Accrued</th><th>Withdrawn</th></tr></thead>
                      <tbody>
                        {selectedEmployeeTotals.streams.length === 0 && <tr><td colSpan={4}>No streams for this user.</td></tr>}
                        {selectedEmployeeTotals.streams.map((s) => (
                          <tr key={s.id}><td>#{s.id}</td><td><span className={`status ${s.status}`}>{s.status}</span></td><td>{fmtNum(s.accrued)}</td><td>{fmtNum(s.withdrawn)}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>


                <article className="panel">
                  <h3>Tax Certificate</h3>
                  <form className="form-grid" onSubmit={handleCertificateDownload}>
                    <label>Tax Year<input value={taxYear} onChange={(e) => setTaxYear(e.target.value)} type="number" min="2020" max="2100" /></label>
                    <button type="submit" className="primary-btn">Download Certificate</button>
                  </form>
                  <p className="muted">{certificateInfo}</p>
                </article>


                <article className="panel">
                  <h3>Wallet & Support</h3>
                  <form className="form-grid" onSubmit={handleWalletSave}>
                    <label>Wallet Address<input value={employeeWallet} onChange={(e) => setEmployeeWallet(e.target.value)} type="text" placeholder="0xEmployeeWallet" required /></label>
                    <button type="submit" className="primary-btn">Save Wallet</button>
                  </form>
                  <form className="form-grid support-form" onSubmit={handleSupportSubmit}>
                    <label>Support Request<textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)} rows={3} placeholder="Describe your payroll issue" /></label>
                    <button type="submit" className="ghost-btn">Send to Support</button>
                  </form>
                  <ul className="list">
                    {filteredSupportTickets.length === 0 && <li>No support tickets yet.</li>}
                    {filteredSupportTickets.map((t) => (
                      <li key={t.id}><span>#{t.id} • {t.employee} • {t.status}</span><span>{t.message}</span></li>
                    ))}
                  </ul>
                </article>
              </div>
            </section>
          </main>
        </>
      )}
    </>
  );
}