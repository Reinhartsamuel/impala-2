import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Sparkles, TrendingUp, Shield, Zap, Coins } from 'lucide-react';
import { Vault, RiskProfileType, PortfolioPosition } from '../types';
import { VAULTS } from '../constants/constants.ts';
import ImpalaMascot from './ImpalaMascot';
import { getInvestmentSuggestions } from '@/services/aiInvestmentService.ts';

interface ImpalaAIChatProps {
  userRiskProfile: RiskProfileType;
  portfolioPositions: PortfolioPosition[];
  walletBalance: number;
  isOpen: boolean;
  onClose: () => void;
}

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'impala';
  timestamp: Date;
  type?: 'suggestion' | 'question' | 'general';
};

const ImpalaAIChat: React.FC<ImpalaAIChatProps> = ({
  userRiskProfile,
  portfolioPositions,
  walletBalance,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hey there! I'm Impala, your AI investment guide. I can analyze your portfolio, suggest vaults based on your risk profile, and help you make smart DeFi decisions. What would you like to know? 🦌",
      sender: 'impala',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Vault[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load initial suggestions when chat opens
  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      loadInitialSuggestions();
    }
  }, [isOpen]);

  const loadInitialSuggestions = async () => {
    setIsLoading(true);
    try {
      const suggestedVaults = await getInvestmentSuggestions(
        userRiskProfile,
        portfolioPositions,
        walletBalance,
        VAULTS
      );
      setSuggestions(suggestedVaults);

      // Add initial suggestion message
      if (suggestedVaults.length > 0) {
        const suggestionMessage = createSuggestionMessage(suggestedVaults);
        setMessages(prev => [...prev, suggestionMessage]);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSuggestionMessage = (vaults: Vault[]): Message => {
    const topVault = vaults[0];
    const messageContent = `Based on your ${userRiskProfile.toLowerCase()} risk profile, I recommend checking out these vaults:\n\n` +
      vaults.slice(0, 3).map((vault, index) =>
        `${index + 1}. **${vault.name}** (${vault.protocol}) - ${vault.apy}% APY, ${vault.riskLevel} risk\n   ${vault.description}`
      ).join('\n\n') +
      `\n\n💡 **My top pick:** ${topVault.name} - Great balance of ${topVault.apy}% APY with ${topVault.riskLevel} risk.`;

    return {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'impala',
      timestamp: new Date(),
      type: 'suggestion'
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate responses based on keywords
      const response = await generateAIResponse(input);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'impala',
        timestamp: new Date(),
        type: response.includes('recommend') ? 'suggestion' : 'general'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Hmm, I'm having trouble connecting to my wisdom source. Try asking about specific vaults or your portfolio! 🦌",
        sender: 'impala',
        timestamp: new Date(),
        type: 'general'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    // Simulate AI response based on keywords
    const input = userInput.toLowerCase();

    if (input.includes('suggest') || input.includes('recommend') || input.includes('what should')) {
      if (suggestions.length > 0) {
        const topVault = suggestions[0];
        return `For your ${userRiskProfile.toLowerCase()} profile, I'd recommend **${topVault.name}**! It offers ${topVault.apy}% APY with ${topVault.riskLevel} risk. ${topVault.description} 🚀`;
      }
      return "Let me analyze your portfolio and risk profile to give you personalized suggestions...";
    }

    if (input.includes('risk') || input.includes('safe')) {
      return `Your current risk profile is **${userRiskProfile}**. Based on this, I focus on finding vaults that match your comfort level while maximizing returns. Remember: higher APY usually means higher risk! 🛡️`;
    }

    if (input.includes('portfolio') || input.includes('holdings')) {
      const positionCount = portfolioPositions.length;
      const totalInvested = portfolioPositions.reduce((sum, pos) => sum + pos.amount, 0);

      if (positionCount === 0) {
        return "Your portfolio is empty! This is a great time to start. Consider diversifying across 2-3 vaults to spread risk. I can suggest some based on your profile! 📊";
      }

      return `You have **${positionCount} position${positionCount === 1 ? '' : 's'}** with $${totalInvested.toLocaleString()} invested. ${positionCount < 3 ? 'Consider adding more positions to diversify!' : 'Great diversification! Keep it up!'} 🎯`;
    }

    if (input.includes('apy') || input.includes('yield') || input.includes('return')) {
      const highApyVault = [...VAULTS].sort((a, b) => b.apy - a.apy)[0];
      const safeVault = VAULTS.find(v => v.riskLevel === 'Low') || VAULTS[0];

      return `APY (Annual Percentage Yield) shows your potential returns. The highest APY vault is **${highApyVault.name}** at ${highApyVault.apy}%, but it's ${highApyVault.riskLevel} risk. For safety, check out **${safeVault.name}** at ${safeVault.apy}% APY. 📈`;
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! Ready to build your wealth empire together? Ask me about vault suggestions, portfolio advice, or anything DeFi! 🦌";
    }

    // Default response
    return `I'm here to help with your investment journey! You can ask me about:
• Vault suggestions for your ${userRiskProfile} profile
• Portfolio diversification advice
• Risk management strategies
• Understanding APY and yields
• Or anything else DeFi-related! 💡`;
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-impala-500 to-orange-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-impala-100 transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <ImpalaMascot mood="excited" className="w-16 h-16" />
              <div className="absolute -top-2 -right-2">
                <Sparkles className="text-yellow-300 animate-pulse" size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold">Impala AI Assistant</h2>
              <p className="text-impala-100 text-sm">Your personal DeFi investment guide</p>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-impala-50 p-4 border-b border-impala-100">
          <p className="text-sm text-stone-600 mb-2 font-medium">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => handleQuickQuestion("Suggest vaults for my risk profile")}
              className="px-3 py-2 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:border-impala-300 hover:bg-impala-50 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <TrendingUp size={14} /> Vault Suggestions
            </button>
            <button
              onClick={() => handleQuickQuestion("How's my portfolio looking?")}
              className="px-3 py-2 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:border-impala-300 hover:bg-impala-50 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Coins size={14} /> Portfolio Review
            </button>
            <button
              onClick={() => handleQuickQuestion("What's a safe option for me?")}
              className="px-3 py-2 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:border-impala-300 hover:bg-impala-50 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Shield size={14} /> Safe Options
            </button>
            <button
              onClick={() => handleQuickQuestion("Show me high APY vaults")}
              className="px-3 py-2 bg-white text-stone-700 text-sm font-medium rounded-lg border border-stone-200 hover:border-impala-300 hover:bg-impala-50 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <Zap size={14} /> High APY
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.sender === 'user'
                    ? 'bg-impala-500 text-white rounded-br-none'
                    : message.type === 'suggestion'
                    ? 'bg-gradient-to-r from-impala-50 to-yellow-50 border border-impala-200 text-stone-800'
                    : 'bg-stone-100 text-stone-800'
                }`}
              >
                {message.sender === 'impala' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-impala-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Bot size={12} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-impala-600">Impala AI</span>
                  </div>
                )}
                <div className={`${message.sender === 'user' ? 'text-white' : 'text-stone-700'}`}>
                  {formatMessageContent(message.content)}
                </div>
                <div className={`text-xs mt-2 ${message.sender === 'user' ? 'text-impala-200' : 'text-stone-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-stone-100 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-impala-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Bot size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-impala-600">Impala AI</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-impala-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-impala-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-impala-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-stone-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Impala about investments, vaults, or portfolio advice..."
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-impala-300 focus:ring-2 focus:ring-impala-100"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`px-6 rounded-xl font-bold flex items-center gap-2 transition-all ${
                isLoading || !input.trim()
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-impala-500 hover:bg-impala-600 text-white shadow-lg shadow-impala-200 hover:-translate-y-1'
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2 text-center">
            Impala AI provides suggestions based on your risk profile. Always do your own research! 🦌
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpalaAIChat;
