import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
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
  const { ready, authenticated, user: privyUser, login } = usePrivy();
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [impalaMessage, setImpalaMessage] = useState("Let's get started!");
  const [positions, setPositions] = useState<PortfolioPosition[]>([]);
  const [view, setView] = useState<'loading' | 'login' | 'onboarding' | 'dashboard'>('loading');

  // Initial State Management
  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      // User is not authenticated - show login screen
      setView('login');
    } else if (!user.onboarded) {
      // User is authenticated but not onboarded
      setView('onboarding');
    } else {
      // User is authenticated and onboarded
      setView('dashboard');
    }
  }, [ready, authenticated, user.onboarded]);

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
    // View will automatically switch to 'dashboard' via useEffect
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
        {view === 'login' && (
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="mb-8 relative">
              <div className="w-32 h-32 bg-gradient-to-br from-impala-200 to-impala-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🦌</span>
              </div>
              <div className="absolute -right-8 bottom-0 animate-bounce-slight text-4xl">👇</div>
            </div>

            <h1 className="text-4xl font-display font-bold text-stone-800 mb-2">Welcome to Impala</h1>
            <p className="text-stone-500 mb-8 text-lg">Your playful gateway to onchain wealth building</p>

            <div className="max-w-md w-full">
              <button
                onClick={login}
                className="w-full py-4 bg-impala-500 hover:bg-impala-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-impala-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 animate-pulse-fast mb-6"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Connect with Privy
              </button>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
                <p className="text-sm text-stone-500 mb-4">Powered by Privy • Secure & Non-custodial</p>
                <p className="text-xs text-stone-400">Login with email, Google, Twitter, or your wallet</p>
                <p className="text-xs text-stone-400 mt-2">Default network: Mantle Sepolia</p>
              </div>
            </div>
          </div>
        )}

        {view === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {view === 'dashboard' && (
          <div className="p-4 sm:p-6 fade-in">
             <Dashboard
                user={user}
                impalaMessage={impalaMessage}
                onUpdateUser={(u) => setUser(prev => ({ ...prev, ...u }))}
                onDeposit={handleInvest}
                positions={positions}
                onDepositComplete={handleDepositComplete}
             />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
