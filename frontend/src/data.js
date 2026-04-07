/* Mock Data for WeDev Application */

export const mockExpenses = [
  { id: 1, category: 'Food', amount: 45.99, date: '2026-04-01', description: 'Grocery shopping' },
  { id: 2, category: 'Transport', amount: 25.00, date: '2026-04-01', description: 'Gas' },
  { id: 3, category: 'Entertainment', amount: 30.00, date: '2026-04-02', description: 'Movie tickets' },
  { id: 4, category: 'Books', amount: 18.50, date: '2026-04-02', description: 'Technical book' },
  { id: 5, category: 'Clothing', amount: 65.00, date: '2026-04-03', description: 'New jacket' },
  { id: 6, category: 'Food', amount: 35.75, date: '2026-04-03', description: 'Restaurant' },
]

export const mockPortfolio = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc', quantity: 10, price: 180.50, value: 1805 },
  { id: 2, symbol: 'MSFT', name: 'Microsoft', quantity: 5, price: 420.75, value: 2103.75 },
  { id: 3, symbol: 'GOOGL', name: 'Google', quantity: 3, price: 140.25, value: 420.75 },
  { id: 4, symbol: 'NFLX', name: 'Netflix', quantity: 2, price: 250.00, value: 500 },
]

export const mockMarketData = {
  nifty: 22713.1,
  sensex: 73319.55,
  gold: 4651.5,
  bitcoin: 66906.98,
}

export const mockNews = [
  {
    id: 1,
    title: 'Global markets rally on positive economic data',
    source: 'Reuters',
    date: '2026-04-04',
    url: '#'
  },
  {
    id: 2,
    title: 'Tech stocks surge as AI investments continue',
    source: 'Bloomberg',
    date: '2026-04-04',
    url: '#'
  },
  {
    id: 3,
    title: 'Central banks maintain steady interest rates',
    source: 'AP Finance',
    date: '2026-04-03',
    url: '#'
  },
  {
    id: 4,
    title: 'Cryptocurrency market shows signs of recovery',
    source: 'CoinDesk',
    date: '2026-04-03',
    url: '#'
  },
  {
    id: 5,
    title: 'Bond yields decline amid market uncertainty',
    source: 'CNBC',
    date: '2026-04-02',
    url: '#'
  },
]

export const mockEducation = [
  {
    id: 1,
    title: 'Understanding Risk vs Reward',
    category: 'Investment Basics',
    duration: 'Approx. 20 min',
    completed: false,
    description: 'Detailed guide to balancing risk and reward when investing.',
    image: 'https://images.unsplash.com/photo-1508385082359-f9f4b4b0b5d9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1f3b6d8b0a8f2c2d9c9f7a8c6d4e7b2a',
    content: `Risk and reward form the foundational trade-off in investing. Every decision you make as an investor implicitly asks: how much uncertainty am I willing to accept in exchange for potential future gains? This topic expands that simple idea into practical guidance you can apply to build a resilient portfolio.\n\nWe begin by defining risk in the context of financial markets. Risk is the likelihood that an investment’s returns will differ from expectations. That difference might be positive or negative; however, risk is often discussed in terms of potential loss or volatility — the degree to which price fluctuates over time. Sources of risk include market-wide events (macroeconomic shifts, geopolitical crises), sector-specific cycles (technology booms and busts), and company-level issues (management failures, earnings shocks).\n\nReward is the compensation investors receive for taking on risk: capital appreciation, dividends, interest, or other cash flows. Historically, asset classes with higher average returns — like equities — have exhibited higher volatility than lower-return asset classes such as cash or short-term government bonds. Understanding this historical relationship is important but not sufficient; future returns are uncertain and past performance is not a guarantee.\n\nA sensible investor develops an understanding of personal risk tolerance, investment horizon, and financial goals. Short time horizons and low tolerance for fluctuation favor conservative allocations: high-quality bonds, cash buffers, and defensive equities. Long horizons and higher tolerance may justify larger allocations to growth assets, where short-term volatility is an accepted cost for higher long-term return potential.\n\nDiversification is the primary tool to manage risk without necessarily sacrificing reward. By combining assets that respond differently to economic conditions — for example, equities, bonds, commodities, and real estate — investors reduce exposure to single-event losses while retaining access to upside in different market regimes. Rebalancing disciplined allocations periodically captures gains and enforces buy-low, sell-high behavior.\n\nPractical risk management also includes position sizing, stop-loss discipline, and not over-concentrating in a single stock or sector. Leverage magnifies both risk and reward and should be used sparingly and with full understanding of worst-case scenarios.\n\nFinally, behavioral factors often derail good plans: panic selling, chasing past winners, and timing the market. Building rules-based plans, automating contributions, and maintaining an emergency fund reduce the probability of emotionally-driven mistakes.\n\nSummary: align your allocation with goals and horizon, diversify across uncorrelated assets, monitor costs and tax efficiency, and stick to a disciplined plan. Over time, this approach balances the unavoidable trade-off between risk and reward so you can pursue your financial objectives with greater confidence.`
  },
  {
    id: 2,
    title: 'How to Build a Diversified Portfolio',
    category: 'Portfolio Management',
    duration: 'Approx. 25 min',
    completed: true,
    description: 'A step-by-step approach to constructing resilient portfolios.',
    image: 'https://images.unsplash.com/photo-1542223616-1b38e9d7b6b3?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4e8b2c5f7a1d9c3b5e6a7d8c9f0b1a2c',
    content: `Constructing a diversified portfolio is both an art and a disciplined process. The objective is to combine assets with differing performance drivers so that overall portfolio returns are smoother and less dependent on a single outcome. This topic walks through the practical mechanics of designing a portfolio that reflects your goals, constraints, and preferences.\n\nStart with a clear statement of your goals and time horizon. Goals might include a retirement target, saving for education, or building an emergency reserve. Time horizon is essential: short horizons require more liquidity and less volatility, whereas long horizons permit greater allocation to growth assets.\n\nNext, define asset classes and their roles: equities for growth, fixed income for income and stability, real assets for inflation protection, and cash for liquidity. Within equities, diversify across market caps and geographies; within fixed income, consider maturities and credit qualities.\n\nAllocation decisions can follow a top-down strategic allocation (target weights rebalanced periodically) or a more tactical approach that adjusts to market conditions. For most individual investors, a strategic allocation with periodic rebalancing reduces behavioral risks and transaction costs.\n\nRebalancing enforces discipline: when equities outperform, the portfolio drifts; rebalancing sells portions of winners and buys laggards back to target weights, effectively selling high and buying low. Consider tax implications of rebalancing in taxable accounts and prioritize rebalancing in tax-advantaged accounts where possible.\n\nRisk budgeting is another valuable concept: allocate volatility across components so each contributes an intended fraction to overall risk. Use simple proxies like equal risk contributions or volatility-weighted allocations if you lack sophisticated tools.\n\nCosts matter: favor low-cost index funds and ETFs where appropriate. High fees erode long-term returns, particularly in core allocations. Examine expense ratios, tracking error, and liquidity when selecting instruments.\n\nFinally, test your plan with scenario analysis: how does the portfolio perform in inflationary spikes, market crashes, or prolonged low-return environments? Stress testing clarifies vulnerabilities and informs potential hedges.\n\nSummary: a robust portfolio starts with clear goals, a diversified mix of uncorrelated assets, low-cost instruments, and a disciplined rebalancing policy. Keep complexity manageable and focus on the long-term process rather than short-term market noise.`
  },
  {
    id: 3,
    title: 'Introduction to Mutual Funds',
    category: 'Investment Products',
    duration: 'Approx. 22 min',
    completed: false,
    description: 'How mutual funds work and how to evaluate them.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b2a0c4d3e6f7a8b9c0d1e2f3a4b5c6d',
    content: `Mutual funds are one of the most accessible investment vehicles for individuals. They pool capital from multiple investors to purchase a diversified portfolio managed by professional asset managers. This topic explains fund structures, fee mechanics, and practical selection criteria so you can choose funds that align with your objectives.\n\nFund types include active equity funds, passive index funds, bond funds, hybrid funds, and specialty funds. Active funds aim to outperform benchmarks through manager skill and research, while passive index funds replicate indices at low cost. The trade-off is typically cost versus the potential for outperformance.\n\nFees are critical to understand. Expense ratio reflects annual management and operating costs; lower expense ratios usually translate to better net returns over time. Some funds charge performance fees or exit loads; these should be transparently disclosed.\n\nWhen evaluating funds, examine long-term performance relative to peers and benchmarks, consistency of returns, the manager’s tenure and process, turnover (which impacts taxes and costs), and the fund’s assets under management, which affects liquidity. For taxable investors, consider tax efficiency: index funds and tax-managed funds may deliver superior after-tax returns.\n\nPractical tips: prefer broad, low-cost index funds for core allocations; use active funds selectively where manager skill is demonstrable and fees are justified. Dollar-cost averaging and systematic investing reduce the risk of poor timing.\n\nSummary: mutual funds simplify diversification and professional management, but thoughtful selection — with an eye to cost, track record, and fit — improves the odds of reaching your financial goals.`
  },
  {
    id: 4,
    title: 'Stock Market Fundamentals',
    category: 'Stock Trading',
    duration: 'Approx. 30 min',
    completed: true,
    description: 'Core concepts for understanding stocks and trading mechanics.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
    content: `Stocks represent fractional ownership in companies and are a primary vehicle for building long-term wealth. This lesson covers market structure, order types, key valuation metrics, and prudent trading principles.\n\nMarket participants range from retail traders to institutional investors and market makers. Stock exchanges and regulated brokers facilitate trade execution. Understanding order types — market orders for immediate execution, limit orders to set a price, and stop orders to limit downside — is essential for executing strategy.\n\nValuation basics: price-to-earnings (P/E), price-to-book (P/B), and free cash flow metrics provide entry points for fundamental analysis. Technical analysis examines price patterns and volume to identify short-term trends, though evidence for consistent outperformance is mixed.\n\nRisk management is paramount: use position sizing rules to avoid catastrophic losses, implement stop-losses where appropriate, and avoid overtrading. Leverage increases both upside and downside and should be used only by experienced participants.\n\nFor beginners, paper trading and simulated accounts build muscle memory without financial risk. Over time, focus on a repeatable process: idea generation, sizing, execution, and review. Keep a trading journal to capture lessons and refine your approach.\n\nSummary: stocks offer powerful growth potential but require disciplined risk control, cost-aware execution, and continual learning to be successful.`
  },
  {
    id: 5,
    title: 'Tax-Efficient Investing',
    category: 'Taxation',
    duration: 'Approx. 20 min',
    completed: false,
    description: 'Practical methods to improve after-tax returns.',
    image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    content: `Taxes can meaningfully reduce investment returns over time, so structuring portfolios to be tax-efficient is an important part of long-term planning. This topic explains common tax levers and practical behaviors that reduce drag on returns.\n\nCapital gains are typically taxed based on holding period: short-term gains are often taxed at higher ordinary income rates, while long-term gains benefit from preferential rates in many jurisdictions. This creates a structural advantage for buy-and-hold investing.\n\nDividends and interest are taxed as income; some dividends qualify for lower rates depending on holding period and source. Municipal bonds may offer tax-exempt interest in certain countries and are a tool for tax-sensitive investors.\n\nTax-advantaged accounts (retirement accounts, educational savings vehicles) allow tax deferral or tax-free growth; prioritize contributions to these accounts when available and aligned with your goals. Asset location — placing tax-inefficient investments in tax-advantaged accounts and tax-efficient investments in taxable accounts — improves after-tax outcomes.\n\nHarvesting tax losses is a tactical tool: sell underperforming positions to realize losses that offset gains, then rebalance into similar exposures to maintain asset allocation while capturing tax benefits. Beware of wash-sale rules that limit the ability to repurchase the same security within a window.\n\nUse low-turnover, low-cost index funds in taxable accounts to minimize taxable distributions. Consider municipal bonds or tax-managed funds if you expect significant taxable income. Also be mindful of transaction costs and fees that can inadvertently offset tax benefits.\n\nSummary: thoughtful use of account types, asset location, and low-cost instruments, combined with tax-aware rebalancing, can materially improve your net returns over decades.`
  },
]

export const mockAchievements = [
  { id: 1, title: 'First Steps', description: 'Create your first investment', icon: '🚀', unlocked: true },
  { id: 2, title: 'Saver', description: 'Accumulate $5,000 in savings', icon: '💰', unlocked: true },
  { id: 3, title: 'Portfolio Pro', description: 'Create a portfolio with 5+ assets', icon: '📈', unlocked: false },
  { id: 4, title: 'Knowledge Seeker', description: 'Complete 5 educational courses', icon: '🎓', unlocked: true },
  { id: 5, title: 'Consistent Saver', description: 'Save money for 30 consecutive days', icon: '⭐', unlocked: false },
]

export const categoryColors = {
  'Food': '#FF5722',
  'Transport': '#00BCD4',
  'Books': '#9C27B0',
  'Entertainment': '#FFC107',
  'Clothing': '#F44336',
  'Other': '#3F51B5',
}

export const expenseChartData = {
  labels: ['Food', 'Transport', 'Books', 'Entertainment', 'Clothing'],
  values: [150, 80, 50, 130, 100],
}

export const savingsData = {
  monthlyIncome: 5000,
  monthlyExpenses: 2400,
  monthlySavings: 2600,
  savingsRate: 52,
  investedAmount: 15000,
}

export const riskProfile = {
  name: 'Balanced Growth',
  score: 65,
  description: 'Medium risk with growth potential',
  allocation: [
    { type: 'Stocks', percentage: 50 },
    { type: 'Bonds', percentage: 30 },
    { type: 'Cash', percentage: 20 },
  ],
}
