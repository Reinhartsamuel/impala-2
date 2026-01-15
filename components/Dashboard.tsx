import React, { useState, useEffect } from 'react';
import { UserProfile, Vault, Quest, VaultCategory, PortfolioPosition } from '../types';
import { VAULTS, QUESTS } from '../constants/constants.ts';
import { Flame, Trophy, Coins, ChevronRight, Lock, LayoutDashboard, PieChart, Wallet, ArrowRight, Sparkles, MessageSquare, Brain, CheckCircle2 } from 'lucide-react';
import VaultDetail from './VaultDetail';
import Portfolio from './Portfolio';
import ImpalaMascot from './ImpalaMascot';
import DepositFlow from './DepositFlow';
import ImpalaAIChat from './ImpalaAIChat';

interface DashboardProps {
  user: UserProfile;
  impalaMessage: string;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onDeposit: (vaultId: string, amount: number) => void;
  positions: PortfolioPosition[];
  onDepositComplete: (amount: number) => void;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, impalaMessage, onUpdateUser, onDeposit, positions, onDepositComplete, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'portfolio' | 'account'>('explore');
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [activeCategory, setActiveCategory] = useState<VaultCategory | 'All'>('All');
  const [showDepositGuide, setShowDepositGuide] = useState(false);
  const [showDepositFlow, setShowDepositFlow] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [depositMessage, setDepositMessage] = useState("");

  useEffect(() => {
    // Show deposit guide if user has just onboarded and has 0 balance
    if (user.onboarded && user.walletBalance === 0 && positions.length === 0) {
      setShowDepositGuide(true);
      setDepositMessage("Welcome to your empire! First, let's fuel your vault with some funds.");
    } else {
      setShowDepositGuide(false);
    }
  }, [user.onboarded, user.walletBalance, positions.length]);

  const filteredVaults = activeCategory === 'All'
    ? VAULTS
    : VAULTS.filter(v => v.category === activeCategory);

  const handleDeposit = (amount: number) => {
    if (selectedVault) {
        onDeposit(selectedVault.id, amount);

        // Check Quest 1: First Step
        if (!user.completedQuests.includes('q1') && amount >= 50) {
            onUpdateUser({
                completedQuests: [...user.completedQuests, 'q1'],
                xp: user.xp + 100
            });
        }
    }
  };

  const getVaultById = (id: string) => VAULTS.find(v => v.id === id);

  return (
    <div className="pb-20 md:pb-0">
  {/* Deposit Guide Overlay for New Users */}
  {showDepositGuide && !showDepositFlow && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Sparkles className="text-yellow-500 animate-pulse" size={24} />
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <ImpalaMascot
              mood="excited"
              message={depositMessage}
              className="scale-125"
            />
            <div className="absolute -right-8 -top-4 animate-bounce text-3xl">👉</div>
          </div>

          <h2 className="text-2xl font-display font-bold text-stone-800 mb-2">First Step: Fuel Your Vault</h2>
          <p className="text-stone-500 mb-6">Deposit funds to start building your empire and complete your first quest!</p>

          <button
            onClick={() => setShowDepositFlow(true)}
            className="w-full py-4 bg-impala-500 hover:bg-impala-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-impala-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mb-3"
          >
            <Wallet size={24} />
            Deposit Now
            <ArrowRight size={20} />
          </button>

          <button
            onClick={() => setShowDepositGuide(false)}
            className="text-sm text-stone-400 hover:text-stone-600 font-medium"
          >
            I'll do it later
          </button>
        </div>
      </div>
    </div>
  )}

  {/* Deposit Flow Modal */}
  {showDepositFlow && (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setShowDepositFlow(false)}
          className="absolute top-4 right-4 z-10 text-stone-400 hover:text-stone-600 bg-white rounded-full p-2 shadow-md"
        >
          ✕
        </button>
        <DepositFlow onDepositComplete={(amount) => {
          if (onDepositComplete) {
            onDepositComplete(amount);
          }
          setShowDepositFlow(false);
          setShowDepositGuide(false);
        }} />
      </div>
    </div>
  )}

  {/* AI Chat Modal */}
  {showAIChat && (
    <ImpalaAIChat
      userRiskProfile={user.riskProfile}
      portfolioPositions={positions}
      walletBalance={user.walletBalance}
      isOpen={showAIChat}
      onClose={() => setShowAIChat(false)}
    />
  )}

      {/* Top Bar with Highlighted Deposit Button for New Users */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-display font-bold text-stone-800">Hello, {user.name}!</h1>
           <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
             <span className="px-2 py-0.5 bg-impala-100 text-impala-700 rounded-md text-xs font-bold uppercase">{user.riskProfile}</span>
             <span>•</span>
             <span>Level {Math.floor(user.xp / 100) + 1} Investor</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
          {showDepositGuide && (
            <div className="relative">
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                !
              </div>
            </div>
          )}
          <button
            onClick={() => setShowAIChat(true)}
            className="relative bg-gradient-to-r from-impala-500 to-orange-500 text-white p-2 rounded-xl hover:shadow-lg transition-shadow flex items-center gap-1 group"
            title="Ask Impala AI for investment advice"
          >
            <Brain size={18} />
            <span className="text-xs font-bold hidden sm:inline">AI Guide</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </button>
          <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-orange-600 font-bold">
                  <Flame size={18} fill="currentColor" />
                  <span>{user.streak} Days</span>
              </div>
              <div className="flex items-center gap-1 text-purple-600 font-bold text-sm">
                  <Trophy size={14} />
                  <span>{user.xp} XP</span>
              </div>
          </div>
          <div className="w-10 h-10 bg-impala-200 rounded-full border-2 border-white shadow-md overflow-hidden">
             {/* Avatar placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-impala-400 to-impala-600"></div>
          </div>
        </div>
      </div>

      {/* Impala Interaction Area with Deposit Guidance */}
      <div className="bg-gradient-to-r from-impala-100 to-orange-50 rounded-3xl p-6 mb-8 flex items-center justify-between relative overflow-hidden shadow-sm border border-impala-200">
          <div className="relative z-10 max-w-[60%]">
             <h3 className="font-bold text-impala-900 mb-1">Daily Wisdom</h3>
             <p className="text-impala-800 text-sm leading-relaxed mb-4 opacity-90 italic">"{showDepositGuide ? "Your empire awaits! Start by depositing funds to unlock your first quest. 🚀" : impalaMessage}"</p>
             {showDepositGuide ? (
               <button
                 onClick={() => setShowDepositFlow(true)}
                 className="bg-white text-impala-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow flex items-center gap-2 animate-pulse"
               >
                 <Wallet size={14} />
                 Start with Deposit
               </button>
             ) : (
               <button className="bg-white text-impala-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                  New Tip
               </button>
             )}
          </div>
          <div className="absolute right-4 -bottom-6 z-10">
             <ImpalaMascot
               mood={showDepositGuide ? "excited" : "happy"}
               className="cursor-pointer"
               message={showDepositGuide ? "Click the wallet icon to begin! 💰" : undefined}
               onClick={() => setShowAIChat(true)}
             />
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Main Navigation Tabs with Deposit Highlight */}
      <div className="flex gap-4 mb-6 border-b border-stone-200 pb-1">
        <button
            onClick={() => setActiveTab('explore')}
            className={`pb-3 px-2 font-bold transition-all relative
            ${activeTab === 'explore' ? 'text-impala-600' : 'text-stone-400 hover:text-stone-600'}`}
        >
            Explore Vaults
            {activeTab === 'explore' && <div className="absolute bottom-0 left-0 w-full h-1 bg-impala-500 rounded-t-full"></div>}
        </button>
        <button
             onClick={() => setActiveTab('portfolio')}
            className={`pb-3 px-2 font-bold transition-all relative
            ${activeTab === 'portfolio' ? 'text-impala-600' : 'text-stone-400 hover:text-stone-600'}`}
        >
            My Portfolio
             {activeTab === 'portfolio' && <div className="absolute bottom-0 left-0 w-full h-1 bg-impala-500 rounded-t-full"></div>}
        </button>
        <button
             onClick={() => setActiveTab('account')}
            className={`pb-3 px-2 font-bold transition-all relative
            ${activeTab === 'account' ? 'text-impala-600' : 'text-stone-400 hover:text-stone-600'}`}
        >
            Account
             {activeTab === 'account' && <div className="absolute bottom-0 left-0 w-full h-1 bg-impala-500 rounded-t-full"></div>}
        </button>
        {showDepositGuide && (
          <div className="relative ml-auto">
            <button
              onClick={() => setShowDepositFlow(true)}
              className="pb-3 px-4 font-bold text-impala-600 flex items-center gap-2 animate-pulse relative"
            >
              <Wallet size={18} />
              Deposit
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
          </div>
        )}
      </div>

      {activeTab === 'explore' ? (
          <>
            {/* Quests Section with First Quest Highlight */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} /> Active Quests
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {QUESTS.map(quest => {
                        const isCompleted = user.completedQuests.includes(quest.id);
                        const isFirstQuest = quest.id === 'q1' && !isCompleted && showDepositGuide;

                        return (
                        <div key={quest.id} className={`min-w-[240px] p-4 rounded-2xl border-2 flex flex-col justify-between transition-all relative
                            ${isCompleted ? 'bg-green-50 border-green-200 opacity-60' :
                              isFirstQuest ? 'bg-gradient-to-r from-impala-50 to-yellow-50 border-2 border-impala-300 shadow-lg' :
                              'bg-white border-stone-100 shadow-sm'}`}>

                            {isFirstQuest && (
                              <div className="absolute -top-2 -right-2">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping"></div>
                                  <div className="relative bg-yellow-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                    !
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* AI Chat Floating Button for Mobile */}
                            <button
                              onClick={() => setShowAIChat(true)}
                              className="fixed bottom-24 right-4 sm:hidden z-40 bg-gradient-to-r from-impala-500 to-orange-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 animate-pulse"
                              title="Ask Impala AI"
                            >
                              <Brain size={24} />
                            </button>

                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${quest.isDaily ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                        {quest.isDaily ? 'DAILY' : 'MAIN'}
                                    </span>
                                    <span className="text-xs font-black text-stone-400">+{quest.xpReward} XP</span>
                                </div>
                                <h3 className="font-bold text-stone-800 leading-tight mb-1">{quest.title}</h3>
                                <p className="text-xs text-stone-500">{quest.description}</p>
                            </div>
                            {isCompleted ? (
                            <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-bold">
                                <CheckCircle2 size={14} /> Completed
                            </div>
                        ) : isFirstQuest ? (
                            <div className="mt-3 flex items-center gap-1 text-impala-600 text-xs font-bold animate-pulse">
                                <Wallet size={14} />
                                Deposit to complete
                            </div>
                        ) : null}
                        </div>
                    )})}
                </div>
            </div>

            {/* Vaults Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                {['All', ...Object.values(VaultCategory)].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors
                            ${activeCategory === cat
                                ? 'bg-stone-800 text-white'
                                : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-100'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Vaults Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVaults.map(vault => (
                    <div
                        key={vault.id}
                        onClick={() => setSelectedVault(vault)}
                        className="group bg-white rounded-3xl p-5 border border-stone-100 shadow-sm hover:shadow-xl hover:border-impala-200 transition-all cursor-pointer relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                             <Coins size={80} />
                         </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-impala-50 flex items-center justify-center text-2xl border border-impala-100">
                                {vault.category === 'Savings' ? '🐷' : vault.category === 'Staking' ? '🥩' : vault.category === 'Yield' ? '🌾' : '📊'}
                            </div>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold
                                ${vault.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                                  vault.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {vault.riskLevel}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-stone-800 mb-1 relative z-10">{vault.name}</h3>
                        <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-4 relative z-10">{vault.protocol} • {vault.chain}</p>

                        <div className="flex items-end justify-between relative z-10">
                            <div>
                                <p className="text-xs text-stone-400 font-medium">APY</p>
                                <p className="text-2xl font-black text-impala-500">{vault.apy}%</p>
                            </div>
                            <div className="bg-stone-50 p-2 rounded-full group-hover:bg-impala-500 group-hover:text-white transition-colors text-stone-300">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
      ) : (
          <Portfolio positions={positions} vaults={VAULTS} totalInvested={user.totalInvested} balance={user.walletBalance} />
      )}

      {/* Modal */}
      {selectedVault && (
        <VaultDetail
            vault={selectedVault}
            onClose={() => setSelectedVault(null)}
            onDeposit={handleDeposit}
            userBalance={user.walletBalance}
        />
      )}

      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-stone-100">
          <h2 className="text-xl font-display font-bold text-stone-800 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            {/* User Profile Section */}
            <div className="bg-impala-50 rounded-2xl p-5 border border-impala-100">
              <h3 className="font-bold text-impala-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-impala-400 to-impala-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">👤</span>
                </div>
                Profile Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-stone-500 mb-1">Name</p>
                  <p className="font-medium text-stone-800">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-1">Risk Profile</p>
                  <span className="px-3 py-1 bg-impala-100 text-impala-700 rounded-md text-sm font-bold uppercase">
                    {user.riskProfile}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-1">Investor Level</p>
                  <p className="font-medium text-stone-800">Level {Math.floor(user.xp / 100) + 1}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500 mb-1">Current Streak</p>
                  <p className="font-medium text-stone-800 flex items-center gap-1">
                    <Flame size={16} className="text-orange-500" />
                    {user.streak} days
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-impala-50 to-orange-50 rounded-2xl p-5 border border-impala-200">
              <h3 className="font-bold text-impala-900 mb-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">📊</span>
                </div>
                Investment Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-impala-700">{user.xp}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-1">Quests Completed</p>
                  <p className="text-2xl font-bold text-impala-700">{user.completedQuests.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-1">Wallet Balance</p>
                  <p className="text-2xl font-bold text-impala-700">${user.walletBalance.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-1">Total Invested</p>
                  <p className="text-2xl font-bold text-impala-700">${user.totalInvested.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Logout Section */}
            <div className="bg-gradient-to-r from-stone-50 to-stone-100 rounded-2xl p-5 border border-stone-200">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🔒</span>
                </div>
                Account Security
              </h3>
              <p className="text-sm text-stone-500 mb-4">
                You are securely logged in via Privy. Your wallet and personal data are protected.
              </p>
              <button
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
              <p className="text-xs text-stone-400 mt-3 text-center">
                You'll be redirected to the login screen
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
