# INVESTORS

A real-time multiplayer stock trading simulation game where players compete to build the highest net worth through strategic buying and selling of virtual stocks.

![INVESTORS Game](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Core Mechanics](#core-mechanics)
- [Features](#features)
- [Technical Architecture](#technical-architecture)
- [Game Flow](#game-flow)
- [Key Formulas](#key-formulas)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**INVESTORS** is a real-time multiplayer stock trading simulation built with React and Supabase. Players start with 100 Floydbucks and compete to achieve the highest net worth by trading 50 virtual stocks across 8 different sectors. Stock prices update in real-time with realistic volatility-based movements, creating an engaging and competitive trading environment.

### Currency
- **Floydbucks (Ⓕ)** - In-game currency
- New accounts start with **100 Floydbucks**

### Key Stats
- **50 stocks** across 8 sectors
- Real-time price updates (1-2 second intervals)
- Persistent user accounts
- Global competitive leaderboard
- Portfolio tracking with P&L calculations

---

## 🎮 Core Mechanics

### Stock Market

#### Sectors
The game features **50 stocks** distributed across **8 sectors**:
- 🖥️ **Tech** - Technology companies
- ⚡ **Energy** - Energy and utilities
- 💼 **Finance** - Financial services
- 🏥 **Healthcare** - Medical and pharmaceutical
- 🛍️ **Retail** - Consumer retail
- 🏭 **Manufacturing** - Industrial manufacturing
- 📺 **Media** - Entertainment and media
- 🚚 **Transport** - Transportation and logistics
- 🍔 **Food** - Food and beverage

#### Price Movement
- Each stock has a unique **volatility rating** (0.5% - 5%)
- Prices update every **1-2 seconds**
- Higher volatility = larger price swings
- Prices move randomly based on: `(Random × Volatility × Current Price)`
- Minimum price floor of Ⓕ1.00

#### Market Maker System
- One connected user becomes the "market maker"
- Market maker's client generates price updates (1-second interval)
- All other users fetch updated prices (2-second interval)
- Ensures synchronized pricing across all players

---

## ✨ Features

### 🔐 Authentication
- Username & password-based login
- Sign up for new accounts
- Persistent sessions via localStorage
- Account data stored in Supabase PostgreSQL

### 💹 Trading
- **Buy** stocks with available cash balance
- **Sell** individual shares or **Sell All** at once
- Real-time cost calculation and balance validation
- Instant transaction execution
- Transaction confirmation

### 📊 Portfolio Management
View all owned stocks with:
- Current total value
- Quantity owned
- Price per share
- 24-hour change percentage (green/red indicators)
- Quick actions: "Buy More" or "Sell All"

### 📌 Watchlist
- Pin favorite stocks for quick access
- Visual pin icon (turns green when active)
- Filter entire market view to show only watchlisted stocks
- Toggle watchlist on/off with one click
- Watchlist persists via localStorage

### 📜 Transaction History
- Chronological record of all trades (buy/sell)
- **24-hour P&L tracker** displayed at the top
- **Realized P&L** shown for each sell transaction
  - Calculated using average cost basis
  - Shows actual profit/loss in green/red
- Pagination: 10 transactions per page
- Timestamps for each transaction

### 🏆 Leaderboard
- Global ranking by **Total Net Worth**
- Net Worth = Cash Balance + Portfolio Value
- Top 3 players highlighted:
  - 🥇 Gold (1st place)
  - 🥈 Silver (2nd place)
  - 🥉 Bronze (3rd place)
- Current user highlighted in blue with "(You)" indicator
- Manual refresh button
- Shows detailed breakdown for each player:
  - Cash balance
  - Portfolio value
  - Total net worth

### 📈 Real-time Charts
- Interactive price history charts (Recharts)
- 50-point historical data per stock
- Hover tooltips showing exact prices
- Visual representation of price trends

---

## 🏗️ Technical Architecture

### FrontendReact 18.x
├── React Hooks (useState, useEffect)
├── Recharts (price charts)
├── Lucide React (icons)
└── Tailwind CSS 3.x (styling)

### BackendSupabase
├── PostgreSQL Database
│   ├── users table
│   └── stocks table
└── REST API
├── CRUD operations
└── Real-time data sync

### Data Persistence

| Data Type | Storage Method | Scope |
|-----------|---------------|-------|
| User accounts | Supabase PostgreSQL | Global (all users) |
| Stock prices | Supabase PostgreSQL | Global (synchronized) |
| Session data | localStorage | Per-browser |
| Watchlist | localStorage | Per-browser |

### Database Schema

#### `users` Table
sqlid    BIGSERIAL PRIMARY KEY
username    TEXT UNIQUE NOT NULL
password    TEXT NOT NULL
balance     FLOAT8 DEFAULT 100
portfolio   JSONB DEFAULT '{}'
history     JSONB DEFAULT '[]'
created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()

**Portfolio Structure (JSONB)**:
json{
"0": 5,    // Stock ID 0: 5 shares
"12": 10,  // Stock ID 12: 10 shares
"23": 3    // Stock ID 23: 3 shares
}

**History Structure (JSONB)**:
json[
{
"type": "BUY",
"symbol": "TECH",
"amount": 5,
"price": 150.50,
"time": "2026-01-06T12:34:56.789Z"
}
]

#### `stocks` Table
sqlid       BIGSERIAL PRIMARY KEY
symbol      TEXT NOT NULL
name        TEXT NOT NULL
sector      TEXT NOT NULL
price       FLOAT8 NOT NULL
volatility  FLOAT8 NOT NULL

---

## 🎯 Game Flow

### New Player Journey
mermaidgraph LR
A[Sign Up] --> B[Receive 100Ⓕ]
B --> C[Browse Stocks]
C --> D[Research & Analyze]
D --> E[Execute Trades]
E --> F[Build Portfolio]
F --> G[Climb Leaderboard]

1. **Create Account** - Username & password
2. **Receive Starting Capital** - 100 Floydbucks
3. **Browse Market** - View 50 stocks across 8 sectors
4. **Research Stocks** - Check charts, volatility, current price
5. **Execute Trades** - Buy stocks with available cash
6. **Manage Portfolio** - Monitor holdings and P&L
7. **Compete** - Climb the leaderboard

### Active Trading LoopMonitor Prices → Identify Opportunities → Execute Trade → Update Portfolio → Repeat

**Strategy Considerations:**
- Buy low, sell high
- High volatility = high risk/reward
- Diversify across sectors
- Time entries and exits
- Monitor 24h P&L for performance

### Competitive Element
- Players compete for highest **Net Worth**
- Leaderboard updates with live portfolio values
- Risk management crucial for success
- Strategic decisions:
  - Which sectors to focus on
  - When to take profits
  - When to cut losses
  - Portfolio diversification

---

## 📐 Key Formulas

### Net Worth Calculation
javascriptNet Worth = Cash Balance + Portfolio ValuePortfolio Value = Σ (Stock Price × Shares Owned)

**Example:**Cash: Ⓕ50.00
Holdings:

TECH: 5 shares @ Ⓕ100 = Ⓕ500
ENER: 10 shares @ Ⓕ20 = Ⓕ200
Portfolio Value = Ⓕ700
Net Worth = Ⓕ50 + Ⓕ700 = Ⓕ750

### Stock Price Movement
javascript Price Change = (Random(-0.5 to 0.5) × 2 × Volatility% × Current Price)
New Price = Max(1, Current Price + Price Change)

**Example (5% volatility stock at Ⓕ100):**Random = 0.3 (between -0.5 and 0.5)
Change = (0.3 × 2 × 0.05 × 100) = Ⓕ3.00
New Price = Ⓕ100 + Ⓕ3.00 = Ⓕ103.00

### 24-Hour P&L
javascript 24h P&L = Total Sold (last 24h) - Total Bought (last 24h)

**Example:**Bought in last 24h:

10 shares @ Ⓕ50 = Ⓕ500
Sold in last 24h:

5 shares @ Ⓕ60 = Ⓕ300
24h P&L = Ⓕ300 - Ⓕ500 = -Ⓕ200 (loss)

### Realized P&L (Per Trade)
javascript Average Buy Price = Total Cost Basis / Total Shares Owned
Realized P&L = (Sell Price - Average Buy Price) × Amount Sold

**Example:**Previous Buys:

5 shares @ Ⓕ100 = Ⓕ500
5 shares @ Ⓕ120 = Ⓕ600
Total Cost = Ⓕ1,100
Total Shares = 10
Average Buy Price = Ⓕ110Current Sell:

5 shares @ Ⓕ150
Realized P&L = (Ⓕ150 - Ⓕ110) × 5 = Ⓕ200 profit

---
