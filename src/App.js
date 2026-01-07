import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Pin } from 'lucide-react';

// Supabase credentials
const SUPABASE_URL = 'https://npurrvorjoxjxieyzyjr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wdXJydm9yam94anhpZXl6eWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NDI4ODcsImV4cCI6MjA4MzIxODg4N30.FRCXF9Xfiuyi3ITQgXD6SopKtufeHd0MJ5dshPWPrOA';

const SECTORS = {
  tech: ['TechCorp', 'DataFlow', 'CloudNet', 'CyberSec', 'QuantumLabs', 'NeuralSoft', 'ByteDyne', 'CodeForge'],
  energy: ['SolarMax', 'FusionTech', 'OilCore', 'WindGen', 'HydroPlus', 'NuclearOne'],
  finance: ['MegaBank', 'CreditMax', 'InvestCo', 'FinServe', 'PayFlow', 'LoanStar'],
  healthcare: ['MediCure', 'BioGen', 'PharmaCore', 'HealthPlus', 'GeneTech', 'CareNet'],
  retail: ['ShopMart', 'FashionHub', 'GroceryKing', 'TechStore', 'HomeGoods'],
  manufacturing: ['SteelWorks', 'AutoBuild', 'ChemCorp', 'PlastiCo', 'MetalForge'],
  media: ['StreamNet', 'NewsGlobal', 'GameStudios', 'SocialHub', 'ContentMax'],
  transport: ['AirlineGo', 'ShipCorp', 'RailExpress', 'CargoNet', 'LogiTrans'],
  food: ['FastBite', 'BrewCo', 'FoodChain', 'BeveragePlus']
};

const generateStocks = () => {
  const stocks = [];
  let id = 0;
  
  Object.entries(SECTORS).forEach(([sector, companies]) => {
    companies.forEach(name => {
      const volatility = 0.5 + Math.random() * 4.5;
      const basePrice = 10 + Math.random() * 490;
      stocks.push({
        id: id++,
        symbol: name.substring(0, 4).toUpperCase(),
        name,
        sector,
        price: basePrice,
        history: [basePrice],
        volatility,
        trend: 0
      });
    });
  });
  
  return stocks.slice(0, 50);
};

// Supabase API functions
const supabase = {
  async getUser(username) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}&select=*`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data[0] || null;
  },

  async createUser(username, password) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        username,
        password,
        balance: 100,
        portfolio: {},
        history: []
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data[0];
  },

  async updateUser(username, userData) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?username=eq.${encodeURIComponent(username)}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data[0];
  },

  async getLeaderboard() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/users?select=username,balance,portfolio`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data;
  },

  async getStocks() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stocks?select=*&order=id.asc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    return data;
  },

  async updateStockPrices(stockUpdates) {
    const promises = stockUpdates.map(({ id, price }) =>
      fetch(`${SUPABASE_URL}/rest/v1/stocks?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ price })
      })
    );
    await Promise.all(promises);
  },

  async initializeStocks(stocks) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/stocks`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(stocks)
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
  }
};

export default function InvestorsGame() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState(1);
  const [view, setView] = useState('market');
  const [sortBy, setSortBy] = useState('symbol');
  const [filterSector, setFilterSector] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [isMarketMaker, setIsMarketMaker] = useState(false);
  const [stocksLoaded, setStocksLoaded] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [watchlist, setWatchlist] = useState([]);
  const hasCredentials = SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';

  // Initialize stocks from Supabase or create them
  useEffect(() => {
    const initStocks = async () => {
      if (!hasCredentials) return;
      
      try {
        const existingStocks = await supabase.getStocks();
        
        if (existingStocks.length === 0) {
  const initialStocks = generateStocks().map(stock => ({
    id: stock.id,
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    price: stock.price,
    volatility: stock.volatility
  }));
  
  await supabase.initializeStocks(initialStocks);
  const newStocks = await supabase.getStocks();
  setStocks(newStocks.map(s => ({ ...s, history: [s.price], change: 0 })));
  setIsMarketMaker(true);
} else {
  setStocks(existingStocks.map(s => ({ ...s, history: [s.price], change: 0 })));
  setIsMarketMaker(true); // <-- ADD THIS LINE
}
        
        setStocksLoaded(true);
      } catch (err) {
        console.error('Failed to load stocks:', err);
      }
    };
    
    initStocks();
  }, [hasCredentials]);

  // Fetch stock prices every 2 seconds (all users)
  useEffect(() => {
    if (!stocksLoaded || !hasCredentials) return;
    
    const fetchInterval = setInterval(async () => {
      try {
        const updatedStocks = await supabase.getStocks();
        setStocks(prevStocks => 
          updatedStocks.map((newStock, idx) => {
            const prevStock = prevStocks[idx] || { history: [newStock.price] };
            const newHistory = [...prevStock.history.slice(-50), newStock.price];
            const change = prevStock.history[0] 
              ? ((newStock.price - prevStock.history[0]) / prevStock.history[0]) * 100
              : 0;
            
            return {
              ...newStock,
              history: newHistory,
              change
            };
          })
        );
      } catch (err) {
        console.error('Failed to fetch stock prices:', err);
      }
    }, 2000);
    
    return () => clearInterval(fetchInterval);
  }, [stocksLoaded, hasCredentials]);

  // Update stock prices (only market maker does this)
  useEffect(() => {
    if (!isMarketMaker || !stocksLoaded) return;
    
    const updateInterval = setInterval(async () => {
      try {
        const updates = stocks.map(stock => {
          const change = (Math.random() - 0.5) * 2 * (stock.volatility / 100) * stock.price;
          const newPrice = Math.max(1, stock.price + change);
          return { id: stock.id, price: newPrice };
        });
        
        await supabase.updateStockPrices(updates);
      } catch (err) {
        console.error('Failed to update stock prices:', err);
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, [isMarketMaker, stocksLoaded, stocks]);

  // Load leaderboard when viewing leaderboard page
  useEffect(() => {
    if (view === 'leaderboard' && hasCredentials && currentUser) {
      loadLeaderboard();
    }
  }, [view]);

  const loadLeaderboard = async () => {
    try {
      const allUsers = await supabase.getLeaderboard();
      
      const usersWithNetWorth = allUsers.map(user => {
        const portfolioValue = Object.entries(user.portfolio || {}).reduce((sum, [stockId, amount]) => {
          const stock = stocks.find(s => s.id === parseInt(stockId));
          return sum + (stock ? stock.price * amount : 0);
        }, 0);
        
        return {
          username: user.username,
          balance: user.balance,
          portfolioValue,
          netWorth: user.balance + portfolioValue
        };
      });
      
      usersWithNetWorth.sort((a, b) => b.netWorth - a.netWorth);
      
      setLeaderboard(usersWithNetWorth);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    }
  };

  // Load user session on mount
  useEffect(() => {
    const loadSession = async () => {
      const session = localStorage.getItem('investors-session');
      if (session && hasCredentials) {
        setUsername(session);
        try {
          const user = await supabase.getUser(session);
          if (user) {
            setCurrentUser(user);
          } else {
            localStorage.removeItem('investors-session');
          }
        } catch (err) {
          localStorage.removeItem('investors-session');
        }
         }
      
      // Load watchlist from localStorage
      const savedWatchlist = localStorage.getItem('investors-watchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    };
    loadSession();
  }, [hasCredentials]);

  const handleLogin = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password');
      return;
    }

    if (!hasCredentials) {
      setError('Please add your Supabase credentials to the code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let user = await supabase.getUser(username);
      
      if (user) {
        if (user.password !== password) {
          setError('Incorrect password');
          setLoading(false);
          return;
        }
        setCurrentUser(user);
        localStorage.setItem('investors-session', username);
      } else {
        if (!isSignup) {
          setError('User not found. Switch to Sign Up to create an account.');
          setLoading(false);
          return;
        }
        user = await supabase.createUser(username, password);
        setCurrentUser(user);
        localStorage.setItem('investors-session', username);
      }
    } catch (err) {
      console.error('Full error:', err);
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsername('');
    setPassword('');
    localStorage.removeItem('investors-session');
  };
const toggleWatchlist = (stockId) => {
  const newWatchlist = watchlist.includes(stockId)
    ? watchlist.filter(id => id !== stockId)
    : [...watchlist, stockId];
  
  setWatchlist(newWatchlist);
  localStorage.setItem('investors-watchlist', JSON.stringify(newWatchlist));
};
  const saveUser = async (userData) => {
    try {
      const updated = await supabase.updateUser(currentUser.username, userData);
      setCurrentUser(updated);
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save data');
    }
  };

  const buyStock = async (stock) => {
    const cost = stock.price * tradeAmount;
    if (currentUser.balance >= cost) {
      const newPortfolio = {
        ...currentUser.portfolio,
        [stock.id]: (currentUser.portfolio[stock.id] || 0) + tradeAmount
      };
      
      const newHistory = [...currentUser.history, {
        type: 'BUY',
        symbol: stock.symbol,
        amount: tradeAmount,
        price: stock.price,
        time: new Date().toISOString()
      }];

      await saveUser({
        balance: currentUser.balance - cost,
        portfolio: newPortfolio,
        history: newHistory
      });
      
      setTradeAmount(1);
    }
  };

  const sellStock = async (stock) => {
    const owned = currentUser.portfolio[stock.id] || 0;
    if (owned >= tradeAmount) {
      const revenue = stock.price * tradeAmount;
      const newPortfolio = { ...currentUser.portfolio };
      newPortfolio[stock.id] = owned - tradeAmount;
      if (newPortfolio[stock.id] === 0) delete newPortfolio[stock.id];
      const newHistory = [...currentUser.history, {
        type: 'SELL',
        symbol: stock.symbol,
        amount: tradeAmount,
        price: stock.price,
        time: new Date().toISOString()
      }];

      await saveUser({
        balance: currentUser.balance + revenue,
        portfolio: newPortfolio,
        history: newHistory
      });
      
      setTradeAmount(1);
    }
  };
  const getRank = (netWorth) => {
    const ranks = [
      { name: 'Gold 1', threshold: 10500, color: 'text-yellow-300', bgColor: 'bg-yellow-600' },
      { name: 'Gold 2', threshold: 9000, color: 'text-yellow-300', bgColor: 'bg-yellow-600' },
      { name: 'Gold 3', threshold: 7500, color: 'text-yellow-400', bgColor: 'bg-yellow-600' },
      { name: 'Silver 1', threshold: 6000, color: 'text-slate-300', bgColor: 'bg-slate-500' },
      { name: 'Silver 2', threshold: 5000, color: 'text-slate-300', bgColor: 'bg-slate-500' },
      { name: 'Silver 3', threshold: 4000, color: 'text-slate-400', bgColor: 'bg-slate-500' },
      { name: 'Bronze 1', threshold: 3000, color: 'text-amber-700', bgColor: 'bg-amber-600' },
      { name: 'Bronze 2', threshold: 2000, color: 'text-amber-700', bgColor: 'bg-amber-600' },
      { name: 'Bronze 3', threshold: 1500, color: 'text-amber-800', bgColor: 'bg-amber-700' },
      { name: 'Tin', threshold: 0, color: 'text-slate-500', bgColor: 'bg-slate-600' }
    ];

    for (const rank of ranks) {
      if (netWorth >= rank.threshold) {
        return rank;
      }
    }

    return ranks[ranks.length - 1];
  };
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">INVESTORS</h1>
            <p className="text-blue-200">Real-time stock trading simulation</p>
          </div>
          
          {!hasCredentials && (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-4">
              <p className="text-yellow-200 text-sm">
                ⚠️ Please add your Supabase credentials to the code (lines 7-8)
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={loading}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 disabled:opacity-50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleLogin()}
              placeholder="Enter password"
              disabled={loading}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400 disabled:opacity-50"
            />
            
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <input
                type="checkbox"
                id="isSignup"
                checked={isSignup}
                onChange={(e) => setIsSignup(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="isSignup">Create new account (Sign Up)</label>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading || !hasCredentials}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
            </button>
            <p className="text-sm text-blue-200 text-center">
              New accounts start with 100 Floydbucks
            </p>
          </div>
        </div>
      </div>
    );
  }

  const portfolioValue = Object.entries(currentUser.portfolio).reduce((sum, [stockId, amount]) => {
    const stock = stocks.find(s => s.id === parseInt(stockId));
    return sum + (stock ? stock.price * amount : 0);
  }, 0);

  const totalValue = currentUser.balance + portfolioValue;

const filteredStocks = stocks
  .filter(s => {
    if (filterSector === 'watchlist') {
      return watchlist.includes(s.id);
    }
    return filterSector === 'all' || s.sector === filterSector;
  })
  .sort((a, b) => {
    if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol);
    if (sortBy === 'price') return b.price - a.price;
    if (sortBy === 'change') return (b.change || 0) - (a.change || 0);
    return 0;
  });
const liveSelectedStock = selectedStock ? stocks.find(s => s.id === selectedStock.id) : null;
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">INVESTORS</h1>
            <p className="text-sm text-slate-400">Welcome, {currentUser.username}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-slate-400">Cash Balance</p>
              <p className="text-xl font-bold text-green-400">
                Ⓕ {currentUser.balance.toFixed(2)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Portfolio Value</p>
              <p className="text-xl font-bold text-blue-400">
                Ⓕ {portfolioValue.toFixed(2)}
              </p>
            </div>
       <div className="text-right">
  <p className="text-sm text-slate-400">Total Net Worth</p>
  <p className="text-xl font-bold text-yellow-400">
    Ⓕ {totalValue.toFixed(2)}
  </p>
  <div className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getRank(totalValue).bgColor} ${getRank(totalValue).color}`}>
    {getRank(totalValue).name}
  </div>
</div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setView('market')}
              className={`px-6 py-3 font-semibold transition ${
                view === 'market' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setView('portfolio')}
              className={`px-6 py-3 font-semibold transition ${
                view === 'portfolio' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setView('history')}
              className={`px-6 py-3 font-semibold transition ${
                view === 'history' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setView('leaderboard')}
              className={`px-6 py-3 font-semibold transition ${
                view === 'leaderboard' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Leaderboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {view === 'market' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Stock List */}
            <div className="col-span-2 space-y-4">
              <div className="flex gap-4 mb-4">
  <button
   onClick={() => setFilterSector(filterSector === 'watchlist' ? 'all' : 'watchlist')}
    className={`px-4 py-2 rounded-lg font-semibold transition ${
      filterSector === 'watchlist' 
        ? 'bg-blue-600 text-white' 
        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    }`}
  >
    Watchlist ({watchlist.length})
  </button>
  <select
    value={filterSector === 'watchlist' ? 'all' : filterSector}
    onChange={(e) => setFilterSector(e.target.value)}
    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-400"
  >
                  <option value="all">All Sectors</option>
                  {Object.keys(SECTORS).map(sector => (
                    <option key={sector} value={sector}>{sector.toUpperCase()}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="symbol">Sort by Symbol</option>
                  <option value="price">Sort by Price</option>
                  <option value="change">Sort by Change</option>
                </select>
              </div>

              {stocks.length === 0 ? (
                <p className="text-slate-400 text-center py-8">Loading stocks...</p>
              ) : (
                <div className="space-y-2">
                  {filteredStocks.map(stock => {
                    const change = stock.change || 0;
                    const owned = currentUser.portfolio[stock.id] || 0;
                    
                    return (
                      <div
                        key={stock.id}
                        onClick={() => setSelectedStock(stock)}
                        className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition hover:bg-slate-750 border ${
                          selectedStock?.id === stock.id ? 'border-blue-400' : 'border-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-bold">{stock.symbol}</h3>
                              <span className="text-xs text-slate-400 uppercase">{stock.sector}</span>
                              <button
  onClick={(e) => {
    e.stopPropagation();
    toggleWatchlist(stock.id);
  }}
  className="ml-2"
>
  <Pin 
    size={16} 
    className={watchlist.includes(stock.id) ? 'fill-green-500 text-green-500' : 'text-slate-400'} 
  />
</button>
                              {owned > 0 && (
                                <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                                  Own: {owned}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-400">{stock.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">Ⓕ {stock.price.toFixed(2)}</p>
                            <p className={`text-sm flex items-center justify-end gap-1 ${
                              change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
{/* Trading Panel */}
<div className="space-y-4">
  {liveSelectedStock ? (
    <>
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-2">{liveSelectedStock.symbol}</h2>
        <p className="text-slate-400 mb-4">{liveSelectedStock.name}</p>
        <div className="text-3xl font-bold text-blue-400 mb-2">
          Ⓕ {liveSelectedStock.price.toFixed(2)}
        </div>
        <p className="text-sm text-slate-400 mb-4">
          Volatility: {liveSelectedStock.volatility.toFixed(1)}% | Sector: {liveSelectedStock.sector}
        </p>
        
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={liveSelectedStock.history.map((price, i) => ({ price, i }))}>
              <XAxis dataKey="i" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                formatter={(value) => [`Ⓕ ${value.toFixed(2)}`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Amount</label>
            <input
              type="number"
              min="1"
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => buyStock(liveSelectedStock)}
              disabled={currentUser.balance < liveSelectedStock.price * tradeAmount}
              className="bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition"
            >
              Buy
            </button>
            <button
              onClick={() => sellStock(liveSelectedStock)}
              disabled={(currentUser.portfolio[liveSelectedStock.id] || 0) < tradeAmount}
              className="bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-lg transition"
            >
              Sell
            </button>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Cost: Ⓕ {(liveSelectedStock.price * tradeAmount).toFixed(2)} | 
            Owned: {currentUser.portfolio[liveSelectedStock.id] || 0}
          </p>
        </div>
      </div>
    </>
  ) : (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-center text-slate-400">
      Select a stock to trade
    </div>
  )}
</div>
      </div>
    )}

    {view === 'portfolio' && (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-6">Your Portfolio</h2>
        {Object.keys(currentUser.portfolio).length === 0 ? (
          <p className="text-slate-400 text-center py-8">No stocks owned yet</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(currentUser.portfolio).map(([stockId, amount]) => {
              const stock = stocks.find(s => s.id === parseInt(stockId));
              if (!stock) return null;
              
              const value = stock.price * amount;
              const change = stock.change || 0;
              
              return (
                <div key={stockId} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{stock.symbol}</h3>
                      <p className="text-sm text-slate-400">{stock.name}</p>
                      <p className="text-sm text-slate-300 mt-1">{amount} shares owned</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-400">Ⓕ {value.toFixed(2)}</p>
                      <p className="text-sm text-slate-400">@ Ⓕ {stock.price.toFixed(2)}</p>
                      <p className={`text-sm flex items-center justify-end gap-1 ${
                        change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
              <button
  onClick={async () => {
    setSelectedStock(stock);
    setTradeAmount(amount);
    
    // Manually sell all shares directly
    const revenue = stock.price * amount;
    const newPortfolio = { ...currentUser.portfolio };
    delete newPortfolio[stock.id];
    
    const newHistory = [...currentUser.history, {
      type: 'SELL',
      symbol: stock.symbol,
      amount: amount,
      price: stock.price,
      time: new Date().toISOString()
    }];

    await saveUser({
      balance: currentUser.balance + revenue,
      portfolio: newPortfolio,
      history: newHistory
    });
    
    setTradeAmount(1);
  }}
  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition text-sm"
>
  Sell All ({amount})
</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

 {view === 'history' && (
  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
    <h2 className="text-2xl font-bold mb-6">Transaction History</h2>
    {currentUser.history.length === 0 ? (
      <p className="text-slate-400 text-center py-8">No transactions yet</p>
    ) : (
      <>
        <div className="space-y-2 mb-4">
{[...currentUser.history].reverse().slice((historyPage - 1) * 10, historyPage * 10).map((tx, reversedIndex) => {
  // Calculate realized P&L for sells
  let realizedPnL = null;
  if (tx.type === 'SELL') {
    // Get the original index in the non-reversed array
    const originalIndex = currentUser.history.length - 1 - ((historyPage - 1) * 10 + reversedIndex);
    
    // Get all transactions up to this sell
    const previousTxs = currentUser.history.slice(0, originalIndex);
    
    // Calculate running position for this stock
    const stockTxs = previousTxs.filter(t => t.symbol === tx.symbol);
    
    let totalCost = 0;
    let totalShares = 0;
    
    stockTxs.forEach(t => {
      if (t.type === 'BUY') {
        totalCost += t.price * t.amount;
        totalShares += t.amount;
      } else if (t.type === 'SELL') {
        // Reduce shares proportionally
        const avgCost = totalShares > 0 ? totalCost / totalShares : 0;
        totalCost -= avgCost * t.amount;
        totalShares -= t.amount;
      }
    });
    
    // Calculate average cost
    const avgBuyPrice = totalShares > 0 ? totalCost / totalShares : 0;
    realizedPnL = (tx.price - avgBuyPrice) * tx.amount;
  }
  
  return (
    <div key={reversedIndex} className="bg-slate-700 rounded-lg p-4 flex justify-between items-center">
      <div>
        <span className={`font-bold ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
          {tx.type}
        </span>
        <span className="mx-2">•</span>
        <span className="font-semibold">{tx.symbol}</span>
        <span className="text-slate-400 ml-2">x{tx.amount}</span>
        {realizedPnL !== null && !isNaN(realizedPnL) && isFinite(realizedPnL) && (
          <span className={`ml-2 text-sm font-semibold ${realizedPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ({realizedPnL >= 0 ? '+' : ''}Ⓕ {realizedPnL.toFixed(2)})
          </span>
        )}
      </div>
      <div className="text-right">
        <p className="font-bold">Ⓕ {tx.price.toFixed(2)}</p>
        <p className="text-xs text-slate-400">
          {new Date(tx.time).toLocaleString()}
        </p>
      </div>
    </div>
  );
})}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setHistoryPage(Math.max(1, historyPage - 1))}
            disabled={historyPage === 1}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition"
          >
            Previous
          </button>
          <span className="text-slate-400">
            Page {historyPage} of {Math.ceil(currentUser.history.length / 10)}
          </span>
          <button
            onClick={() => setHistoryPage(Math.min(Math.ceil(currentUser.history.length / 10), historyPage + 1))}
            disabled={historyPage >= Math.ceil(currentUser.history.length / 10)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg transition"
          >
            Next
          </button>
        </div>
      </>
    )}
  </div>
)}

    {view === 'leaderboard' && (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <button
            onClick={loadLeaderboard}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm"
          >
            Refresh
          </button>
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Loading leaderboard...</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((user, index) => {
              const isCurrentUser = user.username === currentUser.username;
              const rankColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
              const rankColor = index < 3 ? rankColors[index] : 'text-slate-400';
              
              return (
                <div
                  key={user.username}
                  className={`rounded-lg p-4 flex justify-between items-center ${
                    isCurrentUser ? 'bg-blue-900/50 border-2 border-blue-500' : 'bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${rankColor} w-8`}>
                      #{index + 1}
                    </span>
                    <div>
  <div className="flex items-center gap-2">
    <h3 className={`text-lg font-bold ${isCurrentUser ? 'text-blue-300' : 'text-white'}`}>
      {user.username}
      {isCurrentUser && <span className="ml-2 text-sm text-blue-400">(You)</span>}
    </h3>
    <span className={`px-2 py-1 rounded text-xs font-bold ${getRank(user.netWorth).bgColor} ${getRank(user.netWorth).color}`}>
      {getRank(user.netWorth).name}
    </span>
  </div>
  <div className="flex gap-4 text-sm text-slate-400">
    <span>Cash: Ⓕ {user.balance.toFixed(2)}</span>
    <span>Portfolio: Ⓕ {user.portfolioValue.toFixed(2)}</span>
  </div>
</div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-400">
                      Ⓕ {user.netWorth.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400">Total Net Worth</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}
  </div>
</div>
);
}
