export enum RiskProfileType {
  Conservative = 'Conservative',
  Balanced = 'Balanced',
  Aggressive = 'Aggressive',
  Degen = 'Degen'
}

export enum VaultCategory {
  Savings = 'Savings',
  Staking = 'Staking',
  Yield = 'Yield',
  Index = 'Index'
}

export interface OnboardingData {
  goal: string;
  timeline: string;
  managementLevel: string;
  portfolioSize: string;
  volatilityReaction: string;
  defiExperience: string;
}

export interface UserProfile {
  name: string;
  onboarded: boolean;
  riskProfile: RiskProfileType;
  walletBalance: number; // Mock USD
  totalInvested: number;
  xp: number;
  streak: number;
  completedQuests: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isDaily?: boolean;
}

export interface Vault {
  id: string;
  name: string; // The friendly name (e.g., "Steady Saver")
  protocol: string; // The real protocol (e.g., "Aave")
  description: string;
  apy: number;
  tvl: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  category: VaultCategory;
  chain: string;
  change24h: number; // Percentage
  fee: string;
}

export interface PortfolioPosition {
  vaultId: string;
  amount: number;
  profit: number;
}
