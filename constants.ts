import { RiskProfileType, Vault, VaultCategory, Quest } from './types';

export const VAULTS: Vault[] = [
  {
    id: 'v1',
    name: 'Steady Saver',
    protocol: 'Aave',
    description: 'A digital savings account that pays you interest every second. Safe, reliable, and always accessible.',
    apy: 4.5,
    tvl: '$12.4B',
    riskLevel: 'Low',
    category: VaultCategory.Savings,
    chain: 'Ethereum',
    change24h: 0.02,
    fee: '0.01%'
  },
  {
    id: 'v2',
    name: 'Liquid Rewards',
    protocol: 'Lido',
    description: 'Stake your assets to help secure the network and earn rewards while keeping your funds liquid.',
    apy: 3.8,
    tvl: '$24.1B',
    riskLevel: 'Low',
    category: VaultCategory.Staking,
    chain: 'Ethereum',
    change24h: 0.15,
    fee: '10% on rewards'
  },
  {
    id: 'v3',
    name: 'Yield Hunter',
    protocol: 'Yearn',
    description: 'Automatically moves your funds between different opportunities to find the best reliable returns.',
    apy: 8.2,
    tvl: '$350M',
    riskLevel: 'Medium',
    category: VaultCategory.Yield,
    chain: 'Arbitrum',
    change24h: 1.2,
    fee: '2% Mgmt / 20% Perf'
  },
  {
    id: 'v4',
    name: 'Growth Farmer',
    protocol: 'Pendle',
    description: 'Advanced strategies for those who want to maximize yield by trading future returns.',
    apy: 18.5,
    tvl: '$4.2B',
    riskLevel: 'High',
    category: VaultCategory.Yield,
    chain: 'Ethereum',
    change24h: -2.4,
    fee: 'Variable'
  },
  {
    id: 'v5',
    name: 'Blue Chip Index',
    protocol: 'Index Coop',
    description: 'Own a slice of the top DeFi protocols in a single simplified token.',
    apy: 12.1,
    tvl: '$80M',
    riskLevel: 'Medium',
    category: VaultCategory.Index,
    chain: 'Optimism',
    change24h: 3.5,
    fee: '0.95%'
  }
];

export const QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'First Step',
    description: 'Deposit at least $50 into any Impala Vault.',
    xpReward: 100,
    isDaily: false
  },
  {
    id: 'q2',
    title: 'Daily Check-in',
    description: 'Open the app and check your portfolio health.',
    xpReward: 10,
    isDaily: true
  },
  {
    id: 'q3',
    title: 'Diversify',
    description: 'Hold positions in at least 2 different risk categories.',
    xpReward: 250,
    isDaily: false
  }
];

export const ONBOARDING_STEPS = [
  {
    id: 'goal',
    question: "What are your financial goals?",
    subtitle: "Choose the investment goal that best describes your approach",
    options: [
      { label: "Early Retirement", sub: "Build wealth to retire early", icon: "🌅" },
      { label: "Wealth Growth", sub: "Focus on growing your net worth", icon: "💰" },
      { label: "Passive Income", sub: "Generate consistent income streams", icon: "💸" },
      { label: "Debt Payoff", sub: "Pay off debts and achieve financial freedom", icon: "💳" },
      { label: "Protect Capital", sub: "Safety first, lower returns are acceptable", icon: "🛡️" },
      { label: "Steady Growth", sub: "Balanced approach with moderate risk", icon: "📈" },
      { label: "Maximum Yield", sub: "Aggressive pursuit of highest returns", icon: "🚀" }
    ]
  },
  {
    id: 'timeline',
    question: "When do you hope to reach these goals?",
    subtitle: "Select your investment timeline",
    options: [
      { label: "Less than a year", sub: "Short-term goals within 12 months" },
      { label: "1-2 years", sub: "Medium-term goals in 1-2 years" },
      { label: "2-5 years", sub: "Medium-term goals in 2-5 years" },
      { label: "5-10 years", sub: "Long-term goals in 5-10 years" },
      { label: "More than 10 years", sub: "Very long-term goals beyond 10 years" }
    ]
  },
  {
    id: 'managementLevel',
    question: "How do you rate your personal finance management?",
    subtitle: "Assess your financial management skills",
    options: [
      { label: "Beginner", sub: "Just starting to manage finances" },
      { label: "Intermediate", sub: "Some experience with budgeting and investing" },
      { label: "Advanced", sub: "Experienced with complex financial strategies" },
      { label: "Professional", sub: "Expert-level financial management skills" }
    ]
  },
  {
    id: 'portfolioSize',
    question: "Estimate your portfolio size",
    subtitle: "Select your current investment portfolio value",
    options: [
      { label: "$0-$100k", sub: "Starting or small portfolio" },
      { label: "$100k-$500k", sub: "Growing portfolio" },
      { label: "$500k-$1M", sub: "Established portfolio" },
      { label: "$1M-$5M", sub: "Significant portfolio" },
      { label: "+$5M", sub: "Large portfolio" }
    ]
  },
  {
    id: 'volatilityReaction',
    question: "If the market drops 20% in a week, you...",
    subtitle: "How do you typically react to market volatility?",
    options: [
      { label: "Panic sell", sub: "Exit positions to minimize further losses", value: 'low' },
      { label: "Do nothing", sub: "Hold and wait for recovery", value: 'medium' },
      { label: "Buy more", sub: "See it as a buying opportunity", value: 'high' }
    ]
  },
  {
    id: 'defiExperience',
    question: "How many DeFi protocols have you used?",
    subtitle: "Your experience level with decentralized finance",
    options: [
      { label: "Beginner", sub: "New to DeFi, just getting started (0-1 protocols)", value: 'beginner' },
      { label: "Intermediate", sub: "Some experience with major protocols (2-5 protocols)", value: 'intermediate' },
      { label: "I am a Degen", sub: "Experienced with multiple protocols (5+ protocols)", value: 'advanced' }
    ]
  }
];