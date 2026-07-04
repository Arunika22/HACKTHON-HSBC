export const kpis = [
  { id: 'kpi-01', title: 'Portfolio Companies', value: '142', delta: '+12%', meta: 'Monitored entities', tone: 'text-slate-700' },
  { id: 'kpi-02', title: 'High Risk Alerts', value: '18', delta: '+5%', meta: 'Triggered this week', tone: 'text-orange-600' },
  { id: 'kpi-03', title: 'Critical Companies', value: '6', delta: '+2', meta: 'Elevated review priority', tone: 'text-red-600' },
  { id: 'kpi-04', title: 'Avg. Risk Score', value: '58', delta: '+9%', meta: 'Weighted portfolio score', tone: 'text-sky-600' },
];

export const portfolioSummary = [
  { label: 'Liquidity Pressure', value: '24%', change: '+8%' },
  { label: 'Debt concentration', value: '31%', change: '+4%' },
  { label: 'ESG exposure', value: '16%', change: '-2%' },
  { label: 'Regulatory red flags', value: '12%', change: '+1%' },
];

export const riskTrends = [
  { period: 'Mon', risk: 42 },
  { period: 'Tue', risk: 45 },
  { period: 'Wed', risk: 51 },
  { period: 'Thu', risk: 56 },
  { period: 'Fri', risk: 58 },
  { period: 'Sat', risk: 55 },
  { period: 'Sun', risk: 60 },
];

export const companyList = [
  {
    id: 'cmp-001',
    name: 'Northstar Manufacturing',
    industry: 'Industrial',
    country: 'US',
    riskScore: 82,
    riskLevel: 'critical',
    trend: '+7%',
    lastUpdated: '2h ago',
    drivers: ['Margin compression', 'Executive turnover'],
  },
  {
    id: 'cmp-002',
    name: 'Blue Harbor Logistics',
    industry: 'Logistics',
    country: 'US',
    riskScore: 64,
    riskLevel: 'high',
    trend: '+4%',
    lastUpdated: '4h ago',
    drivers: ['Regulatory review'],
  },
  {
    id: 'cmp-003',
    name: 'Aureum Energy',
    industry: 'Energy',
    country: 'UK',
    riskScore: 48,
    riskLevel: 'medium',
    trend: '-2%',
    lastUpdated: '8h ago',
    drivers: ['Market volatility'],
  },
  {
    id: 'cmp-004',
    name: 'Arbor Pharmaceuticals',
    industry: 'Healthcare',
    country: 'IE',
    riskScore: 36,
    riskLevel: 'low',
    trend: '-1%',
    lastUpdated: '1d ago',
    drivers: ['Stable cashflow'],
  },
];

export const alertFeed = [
  {
    id: 'alert-01',
    title: 'Northstar Manufacturing elevated to Critical',
    badge: 'Critical',
    severity: 'critical',
    description: 'Leverage spike and CFO departure detected in the last 24 hours.',
    timestamp: '12 mins ago',
  },
  {
    id: 'alert-02',
    title: 'Blue Harbor pending regulatory review',
    badge: 'High',
    severity: 'high',
    description: 'Environmental investigation is impacting credit access.',
    timestamp: '45 mins ago',
  },
  {
    id: 'alert-03',
    title: 'Aureum Energy market volatility alert',
    badge: 'Medium',
    severity: 'medium',
    description: 'Oil price downturn is increasing covenant pressure.',
    timestamp: '2h ago',
  },
];

export const aiInsights = [
  {
    question: 'Which companies became riskier this week?',
    answer: 'Northstar Manufacturing and Blue Harbor Logistics show the largest upward risk momentum, driven by financial stress and regulatory pressure.',
  },
  {
    question: 'Suggest companies needing review.',
    answer: 'Northstar Manufacturing and Blue Harbor Logistics should be prioritized for credit committee review and updated covenant monitoring.',
  },
];

export const newsTicker = [
  'Northstar Manufacturing CFO resignation raises governance concerns',
  'Blue Harbor Logistics enters environmental compliance review',
  'Aureum Energy adjusts guidance after commodity volatility',
];
