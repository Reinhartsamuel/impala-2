import React, { useState } from 'react';
import { UserProfile, Vault, Quest, VaultCategory, PortfolioPosition } from '../types';
import { VAULTS, QUESTS } from '../constants';
import { Flame, Trophy, Coins, ChevronRight, Lock, LayoutDashboard, PieChart } from 'lucide-react';
import VaultDetail from './VaultDetail';
import Portfolio from './Portfolio';
import ImpalaMascot from './ImpalaMascot';

interface DashboardProps {
  user: UserProfile;
  impalaMessage: string;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onDeposit: (vaultId: string, amount: number) => void;
  positions: PortfolioPosition[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, impalaMessage, onUpdateUser, onDeposit, positions }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'portfolio'>('explore');
  const [selectedVault, setSelectedVault] = useState<Vault | null>(null);
  const [activeCategory, setActiveCategory] = useState<VaultCategory | 'All'>('All');

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
      {/* Top Bar */}
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

      {/* Impala Interaction Area */}
      <div className="bg-gradient-to-r from-impala-100 to-orange-50 rounded-3xl p-6 mb-8 flex items-center justify-between relative overflow-hidden shadow-sm border border-impala-200">
          <div className="relative z-10 max-w-[60%]">
             <h3 className="font-bold text-impala-900 mb-1">Daily Wisdom</h3>
             <p className="text-impala-800 text-sm leading-relaxed mb-4 opacity-90 italic">"{impalaMessage}"</p>
             <button className="bg-white text-impala-600 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                New Tip
             </button>
          </div>
          <div className="absolute right-4 -bottom-6 z-10">
             <ImpalaMascot mood="happy" className="" />
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Main Navigation Tabs (Mobile style on top for desktop view too for simplicity) */}
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
      </div>

      {activeTab === 'explore' ? (
          <>
            {/* Quests Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
                    <Trophy className="text-yellow-500" size={20} /> Active Quests
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {QUESTS.map(quest => {
                        const isCompleted = user.completedQuests.includes(quest.id);
                        return (
                        <div key={quest.id} className={`min-w-[240px] p-4 rounded-2xl border-2 flex flex-col justify-between transition-all
                            ${isCompleted ? 'bg-green-50 border-green-200 opacity-60' : 'bg-white border-stone-100 shadow-sm'}`}>
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
                            {isCompleted && (
                                <div className="mt-3 flex items-center gap-1 text-green-600 text-xs font-bold">
                                    <CheckCircle size={14} /> Completed
                                </div>
                            )}
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
    </div>
  );
};

// Helper Icon
const CheckCircle = ({ size }: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default Dashboard;