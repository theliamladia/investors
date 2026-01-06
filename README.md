Overview
##INVESTORS is a real-time multiplayer stock trading simulation game where players compete to build the highest net worth through strategic buying and selling of virtual stocks. Built with React and Supabase, the game features live price updates, persistent user accounts, and competitive leaderboards.

Core Mechanics
Currency

Floydbucks (Ⓕ) - The in-game currency
New accounts start with 100 Floydbucks

Stock Market

50 stocks across 8 sectors: Tech, Energy, Finance, Healthcare, Retail, Manufacturing, Media, Transport, Food
Prices update in real-time (every 1-2 seconds)
Each stock has a unique volatility rating (0.5% - 5%) that determines price movement intensity
Prices move randomly based on volatility, simulating real market fluctuations

Market Maker System

One user becomes the "market maker" and their client updates stock prices
All other users fetch these prices every 2 seconds
Ensures synchronized pricing across all players


User Features
1. Authentication

Username & password-based login
Account data stored in Supabase (PostgreSQL)
Session persistence via localStorage

2. Trading

Buy stocks with available cash balance
Sell individual shares or Sell All at once
Real-time cost calculation
Transaction history with timestamps

3. Portfolio Management

View all owned stocks with:

Current value
Quantity owned
Price per share
24-hour change percentage


Quick actions: Buy More or Sell All

4. Watchlist

Pin favorite stocks for quick access
Visual pin icon (green when active)
Filter market view to show only watchlisted stocks
Watchlist persists via localStorage

5. Transaction History

Chronological record of all trades
24-hour P&L (Profit & Loss) tracker
Realized P&L shown for each sell transaction
Pagination (10 transactions per page)
Average cost basis calculation

6. Leaderboard

Global ranking by Total Net Worth (Cash + Portfolio Value)
Top 3 highlighted with gold/silver/bronze colors
Current user highlighted in blue
Manual refresh option
Shows breakdown: Cash Balance + Portfolio Value


Technical Architecture
Frontend

React - UI framework
Recharts - Real-time price charts
Tailwind CSS - Styling
Lucide React - Icons

Backend

Supabase (PostgreSQL) - Database

users table: username, password, balance, portfolio (JSONB), history (JSONB)
stocks table: id, symbol, name, sector, price, volatility


REST API - Supabase endpoints for CRUD operations

Data Persistence

User accounts - Supabase database
Stock prices - Supabase database (synchronized)
Session data - localStorage (auto-login)
Watchlist - localStorage (per-user)


Game Flow
New Player Journey

Create account with username/password
Receive 100 Floydbucks starting capital
Browse 50 stocks across 8 sectors
Research stocks: view charts, volatility, sector
Execute trades (buy/sell)
Build portfolio and climb leaderboard

Active Trading Loop

Monitor real-time price changes
Identify opportunities (low prices, high volatility)
Buy stocks with available cash
Hold until price appreciates
Sell for profit (or cut losses)
Reinvest gains to compound wealth

Competitive Element

Players compete for highest net worth
Leaderboard updates with live portfolio values
Risk vs. reward: high volatility = higher gains/losses
Strategic decisions: which sectors to focus on, when to buy/sell


Key Formulas
Net Worth
Net Worth = Cash Balance + Portfolio Value
Portfolio Value = Σ (Stock Price × Shares Owned)
Stock Price Movement
Price Change = (Random(-0.5 to 0.5) × 2 × Volatility% × Current Price)
New Price = Max(1, Current Price + Price Change)
24-Hour P&L
24h P&L = Total Sold (last 24h) - Total Bought (last 24h)
Realized P&L (Per Trade)
Average Buy Price = Total Cost Basis / Total Shares Owned
Realized P&L = (Sell Price - Average Buy Price) × Amount Sold

Features Summary
FeatureDescriptionReal-time PricesStocks update every 1-2 seconds50 StocksDiversified across 8 sectorsPersistent AccountsData saved to SupabaseLive TradingInstant buy/sell executionPrice Charts50-point historical dataWatchlistPin favorites for quick accessPortfolio TrackingCurrent holdings with P&LTransaction HistoryFull trade log with realized gains24h P&LShort-term performance metricGlobal LeaderboardRanked by net worthMulti-user SyncAll players see same prices

Security Considerations
⚠️ Current Implementation (Demo/Educational)

Passwords stored in plain text (NOT production-ready)
No input sanitization
Public API keys exposed in client code
No rate limiting on trades

✅ Production Recommendations

Hash passwords with bcrypt/argon2
Implement JWT authentication
Add server-side validation
Rate limit API requests
Use environment variables for secrets
Add CAPTCHA for signup
Implement trade cooldowns to prevent spam


Future Enhancements
Potential Features

Stock splits & dividends
Margin trading (borrow to buy)
Short selling (bet on price drops)
Limit orders (auto-buy/sell at target price)
News events affecting stock prices
Stock categories (growth vs. value)
Achievement system
Friend system & private leagues
Historical price charts (weekly/monthly)
Mobile-responsive design improvements

Technical Improvements

WebSocket for real-time price updates (eliminate polling)
Server-side price generation (remove market maker client)
Redis caching for faster reads
Database indexing for performance
Automated backups
Analytics dashboard


Deployment
Current Stack:

Frontend: Vercel/GitHub Pages
Database: Supabase (cloud-hosted)
DNS: Custom domain via Vercel

Requirements:

Node.js 16+
Supabase account (free tier)
Git for version control


Educational Value
Learning Concepts:

Stock market basics (buying, selling, portfolio management)
Risk management (volatility, diversification)
Financial metrics (P&L, net worth, cost basis)
Market timing strategies
Competitive resource allocation

Technical Skills:

React state management
Real-time data synchronization
REST API integration
Database design (JSONB for flexibility)
Authentication flows
Responsive UI/UX design


Conclusion
INVESTORS provides an engaging, risk-free environment to learn stock trading fundamentals while competing with friends. The real-time price simulation creates urgency and excitement, while the leaderboard drives competition. With persistent accounts and comprehensive tracking features, players can develop and refine trading strategies over time.
Target Audience: Beginners learning finance, students, casual gamers, anyone interested in stock market simulation
Play Time: Continuous (prices update 24/7, play anytime)
Skill Ceiling: Medium (pattern recognition, timing, risk management)

Built with React, Supabase, and Tailwind CSS
Version 1.0 - January 2026
