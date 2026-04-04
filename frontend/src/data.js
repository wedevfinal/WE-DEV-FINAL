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
    duration: '15 min',
    completed: false,
    description: 'Learn the fundamental principles of risk and reward in investing.'
  },
  {
    id: 2,
    title: 'How to Build a Diversified Portfolio',
    category: 'Portfolio Management',
    duration: '20 min',
    completed: true,
    description: 'Master the art of portfolio diversification.'
  },
  {
    id: 3,
    title: 'Introduction to Mutual Funds',
    category: 'Investment Products',
    duration: '18 min',
    completed: false,
    description: 'A beginner guide to mutual funds and how they work.'
  },
  {
    id: 4,
    title: 'Stock Market Fundamentals',
    category: 'Stock Trading',
    duration: '25 min',
    completed: true,
    description: 'Learn the basics of stock trading.'
  },
  {
    id: 5,
    title: 'Tax-Efficient Investing',
    category: 'Taxation',
    duration: '22 min',
    completed: false,
    description: 'Strategies to minimize taxes on your investments.'
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
