import { Vault, RiskProfileType, PortfolioPosition, VaultCategory } from '../types';
import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getAI = () => {
  if (!genAI) {
    let apiKey: string | undefined = undefined;

    try {
      if (typeof process !== 'undefined' && process.env) {
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Could not access process.env", e);
    }

    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey: apiKey });
    } else {
      console.warn("API_KEY not found. AI features will use fallback logic.");
    }
  }
  return genAI;
};

export interface InvestmentSuggestion {
  vault: Vault;
  reasoning: string;
  confidence: number; // 0-100
  matchScore: number; // 0-100
}

/**
 * Get AI-powered investment suggestions based on user profile and portfolio
 */
export const getInvestmentSuggestions = async (
  riskProfile: RiskProfileType,
  portfolioPositions: PortfolioPosition[],
  walletBalance: number,
  allVaults: Vault[]
): Promise<Vault[]> => {
  try {
    const ai = getAI();

    if (ai) {
      // Use Gemini AI for intelligent suggestions
      return await getAISuggestions(ai, riskProfile, portfolioPositions, walletBalance, allVaults);
    } else {
      // Fallback to rule-based suggestions
      return getRuleBasedSuggestions(riskProfile, portfolioPositions, walletBalance, allVaults);
    }
  } catch (error) {
    console.error('Error getting investment suggestions:', error);
    // Fallback to rule-based suggestions on error
    return getRuleBasedSuggestions(riskProfile, portfolioPositions, walletBalance, allVaults);
  }
};

/**
 * Get AI-powered suggestions using Gemini
 */
const getAISuggestions = async (
  ai: GoogleGenAI,
  riskProfile: RiskProfileType,
  portfolioPositions: PortfolioPosition[],
  walletBalance: number,
  allVaults: Vault[]
): Promise<Vault[]> => {
  try {
    // Prepare portfolio summary
    const portfolioSummary = portfolioPositions.length > 0
      ? `Current portfolio: ${portfolioPositions.length} positions totaling $${portfolioPositions.reduce((sum, pos) => sum + pos.amount, 0).toLocaleString()}. `
      : 'No current investments. ';

    const vaultsInfo = allVaults.map(vault =>
      `${vault.name} (${vault.protocol}): ${vault.apy}% APY, ${vault.riskLevel} risk, ${vault.category} category, ${vault.chain} chain. ${vault.description}`
    ).join('\n');

    const prompt = `
      You are "Impala", an AI investment advisor for a DeFi platform.

      User Profile:
      - Risk Tolerance: ${riskProfile}
      - Available Balance: $${walletBalance.toLocaleString()}
      - ${portfolioSummary}

      Available Vaults:
      ${vaultsInfo}

      Task: Recommend 3 vaults for this user, ordered from best to worst match.

      Consider:
      1. Risk alignment (${riskProfile} profile should match vault risk levels)
      2. Portfolio diversification (avoid over-concentration in one category)
      3. Balance utilization (suggest appropriate amounts based on available funds)
      4. APY vs Risk tradeoff

      Return ONLY a JSON array of vault IDs in order of recommendation, like:
      ["v1", "v3", "v2"]

      Do not include any other text or explanations.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: prompt,
    });

    const responseText = response.text?.trim() || '';

    // Try to parse JSON response
    try {
      const recommendedIds = JSON.parse(responseText);
      if (Array.isArray(recommendedIds)) {
        // Map IDs to vault objects
        const suggestions = recommendedIds
          .map((id: string) => allVaults.find(v => v.id === id))
          .filter((v): v is Vault => v !== undefined);

        // If we got valid suggestions, return them
        if (suggestions.length > 0) {
          return suggestions;
        }
      }
    } catch (parseError) {
      console.warn('Failed to parse AI response as JSON:', parseError);
    }

    // Fallback if parsing fails
    return getRuleBasedSuggestions(riskProfile, portfolioPositions, walletBalance, allVaults);

  } catch (error) {
    console.error('AI suggestion error:', error);
    throw error;
  }
};

/**
 * Rule-based fallback suggestions when AI is unavailable
 */
const getRuleBasedSuggestions = (
  riskProfile: RiskProfileType,
  portfolioPositions: PortfolioPosition[],
  walletBalance: number,
  allVaults: Vault[]
): Vault[] => {
  // Calculate risk score (0-100) based on risk profile
  const riskScore = getRiskScore(riskProfile);

  // Get current portfolio categories for diversification
  const currentCategories = portfolioPositions
    .map(pos => {
      const vault = allVaults.find(v => v.id === pos.vaultId);
      return vault?.category;
    })
    .filter((cat): cat is VaultCategory => cat !== undefined);

  // Score each vault based on multiple factors
  const scoredVaults = allVaults.map(vault => {
    let score = 0;

    // 1. Risk alignment (40% weight)
    const vaultRiskScore = getVaultRiskScore(vault.riskLevel);
    const riskMatch = 100 - Math.abs(riskScore - vaultRiskScore);
    score += riskMatch * 0.4;

    // 2. Diversification (30% weight)
    const categoryBonus = currentCategories.includes(vault.category) ? 0 : 30;
    score += categoryBonus;

    // 3. APY consideration (20% weight)
    const apyScore = (vault.apy / 20) * 20; // Normalize to 0-20 scale (assuming max 20% APY)
    score += apyScore;

    // 4. Balance suitability (10% weight)
    const minInvestment = walletBalance * 0.1; // Suggest vaults where user can invest at least 10% of balance
    const balanceScore = walletBalance >= minInvestment ? 10 : 0;
    score += balanceScore;

    return { vault, score };
  });

  // Sort by score and return top 3
  return scoredVaults
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.vault);
};

/**
 * Convert risk profile to numerical score (0-100)
 */
const getRiskScore = (riskProfile: RiskProfileType): number => {
  switch (riskProfile) {
    case RiskProfileType.Conservative:
      return 20;
    case RiskProfileType.Balanced:
      return 50;
    case RiskProfileType.Aggressive:
      return 75;
    case RiskProfileType.Degen:
      return 90;
    default:
      return 50;
  }
};

/**
 * Convert vault risk level to numerical score (0-100)
 */
const getVaultRiskScore = (riskLevel: string): number => {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return 25;
    case 'medium':
      return 60;
    case 'high':
      return 85;
    default:
      return 50;
  }
};

/**
 * Get detailed reasoning for a vault recommendation
 */
export const getVaultReasoning = (
  vault: Vault,
  riskProfile: RiskProfileType,
  portfolioPositions: PortfolioPosition[]
): string => {
  const riskAlignment = getRiskAlignment(vault.riskLevel, riskProfile);
  const diversification = getDiversificationBenefit(vault, portfolioPositions);

  const reasons: string[] = [];

  if (riskAlignment === 'excellent') {
    reasons.push(`Perfect risk match for your ${riskProfile.toLowerCase()} profile`);
  } else if (riskAlignment === 'good') {
    reasons.push(`Good risk alignment with your ${riskProfile.toLowerCase()} profile`);
  }

  if (diversification === 'high') {
    reasons.push('Adds valuable diversification to your portfolio');
  } else if (diversification === 'medium') {
    reasons.push('Provides some portfolio diversification');
  }

  reasons.push(`${vault.apy}% APY is competitive for ${vault.riskLevel.toLowerCase()} risk`);
  reasons.push(`Backed by ${vault.protocol}, a reputable protocol on ${vault.chain}`);

  if (vault.tvl && parseFloat(vault.tvl.replace(/[^0-9.]/g, '')) > 1000000000) {
    reasons.push('High TVL indicates strong community trust');
  }

  return reasons.join('. ') + '.';
};

const getRiskAlignment = (vaultRisk: string, userRisk: RiskProfileType): 'excellent' | 'good' | 'fair' => {
  const userScore = getRiskScore(userRisk);
  const vaultScore = getVaultRiskScore(vaultRisk);
  const diff = Math.abs(userScore - vaultScore);

  if (diff <= 15) return 'excellent';
  if (diff <= 30) return 'good';
  return 'fair';
};

const getDiversificationBenefit = (vault: Vault, portfolioPositions: PortfolioPosition[]): 'high' | 'medium' | 'low' => {
  if (portfolioPositions.length === 0) return 'high';

  const currentCategories = portfolioPositions
    .map(pos => {
      // In a real app, we'd have access to vault data for each position
      // For now, we'll assume we need to check against actual vaults
      return null;
    })
    .filter(Boolean);

  // If this is a new category, high diversification benefit
  if (!currentCategories.includes(vault.category)) return 'high';

  // If user has few positions, medium benefit
  if (portfolioPositions.length < 3) return 'medium';

  return 'low';
};

/**
 * Generate a personalized investment strategy message
 */
export const generateInvestmentStrategy = (
  riskProfile: RiskProfileType,
  walletBalance: number
): string => {
  const strategies: Record<RiskProfileType, string[]> = {
    [RiskProfileType.Conservative]: [
      "Focus on capital preservation with low-risk vaults",
      "Consider stablecoin yields and blue-chip protocols",
      "Diversify across 2-3 conservative vaults",
      "Rebalance quarterly to maintain risk profile"
    ],
    [RiskProfileType.Balanced]: [
      "Mix of growth and stability for steady returns",
      "Allocate 60% to medium-risk, 40% to low-risk vaults",
      "Consider yield farming with established protocols",
      "Regular contributions work well with this approach"
    ],
    [RiskProfileType.Aggressive]: [
      "Prioritize growth with higher APY opportunities",
      "Consider newer protocols with strong fundamentals",
      "Allocate 70% to high-growth, 30% to stable yields",
      "Active monitoring recommended for risk management"
    ],
    [RiskProfileType.Degen]: [
      "Maximum yield hunting with calculated risks",
      "Explore emerging protocols and innovative strategies",
      "Consider leverage and advanced DeFi tactics",
      "Only risk what you can afford to lose entirely"
    ]
  };

  const profileStrategies = strategies[riskProfile] || strategies[RiskProfileType.Balanced];
  const randomStrategy = profileStrategies[Math.floor(Math.random() * profileStrategies.length)];

  return `As a ${riskProfile.toLowerCase()} investor with $${walletBalance.toLocaleString()}, ${randomStrategy.toLowerCase()}.`;
};
