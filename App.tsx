import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import DepositFlow from './components/DepositFlow';
import { OnboardingData, RiskProfileType, UserProfile, PortfolioPosition } from './types';
import { generateImpalaGreeting, getSmartTip } from './services/geminiService';

const DEFAULT_USER: UserProfile = {
  name: "Explorer",
  onboarded: false,
  riskProfile: RiskProfileType.Balanced,
  walletBalance: 0, // Starts at 0 to trigger deposit flow
  totalInvested: 0,
  xp: 0,
  streak: 0,
  completedQuests: []
};

const App: React.FC = () => {
  const { ready, authenticated, user: privyUser } = usePrivy();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [impalaMessage, setImpalaMessage] = useState("Let's get started!");
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [view, setView] = useState<'loading' | 'onboarding' | 'deposit' | 'dashboard'>('loading');

  // Initial State Management
  useEffect(() => {
    if (!ready) return;

    if (!user.onboarded) {
      setView('onboarding');
    } else if (user.onboarded && (!authenticated || user.walletBalance === 0)) {
      // If onboarded but not logged in OR balance is 0, go to deposit flow
      setView('deposit');
    } else {
      setView('dashboard');
    }
  }, [ready, authenticated, user.onboarded, user.walletBalance]);

  const handleOnboardingComplete = async (data: OnboardingData, riskProfile: RiskProfileType) => {
    // Generate AI greeting based on profile
    const greeting = await generateImpalaGreeting(riskProfile, data);
    setImpalaMessage(greeting);

    setUser(prev => ({
      ...prev,
      onboarded: true,
      riskProfile: riskProfile,
      name: "Future Whale"
    }));
    // View will automatically switch to 'deposit' via useEffect
  };

  const handleDepositComplete = (amount: number) => {
    setUser(prev => ({
      ...prev,
      walletBalance: amount,
      streak: 1,
      completedQuests: [...prev.completedQuests, 'q1'] // Quest 1 (First Step) done
    }));
    setImpalaMessage("Funds received! The empire building begins now. 🏰");
  };

  const handleInvest = (vaultId: string, amount: number) => {
      if (user.walletBalance < amount) return;

      // Update positions
      setPositions(prev => {
          const existing = prev.find(p => p.vaultId === vaultId);
          if (existing) {
              return prev.map(p => p.vaultId === vaultId ? { ...p, amount: p.amount + amount } : p);
          }
          return [...prev, { vaultId, amount, profit: 0 }];
      });

      // Update User
      setUser(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - amount,
          totalInvested: prev.totalInvested + amount,
          xp: prev.xp + 50 // XP for investing
      }));

      // Trigger a new Tip
      getSmartTip("investing").then(tip => setImpalaMessage(tip));
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-impala-50">
        <div className="animate-pulse flex flex-col items-center">
           <div className="w-16 h-16 bg-impala-200 rounded-full mb-4"></div>
           <div className="h-4 w-32 bg-impala-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-stone-800 bg-impala-50 selection:bg-impala-200">
      <main className="max-w-4xl mx-auto min-h-screen flex flex-col">
        {view === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
        
        {view === 'deposit' && (
          <div className="flex-1 flex flex-col justify-center fade-in">
             <DepositFlow onDepositComplete={handleDepositComplete} />
          </div>
        )}

        {view === 'dashboard' && (
          <div className="p-4 sm:p-6 fade-in">
             <Dashboard 
                user={user} 
                impalaMessage={impalaMessage}
                onUpdateUser={(u) => setUser(prev => ({ ...prev, ...u }))}
                onDeposit={handleInvest}
                positions={positions}
             />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;