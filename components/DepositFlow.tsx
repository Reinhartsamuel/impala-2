import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Copy, CheckCircle2, Wallet, ArrowRight, ArrowDownCircle, RefreshCcw } from 'lucide-react';
import ImpalaMascot from './ImpalaMascot';

interface DepositFlowProps {
  onDepositComplete: (amount: number) => void;
}

const ASSETS = [
  { symbol: 'USDC', name: 'USD Coin', icon: '💲' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' }
];

const CHAINS = [
  { id: 'mantle', name: 'Mantle Sepolia', type: 'evm' },
  { id: 'btc', name: 'Bitcoin', type: 'btc' },
  { id: 'base', name: 'Base', type: 'evm' },
  { id: 'arb', name: 'Arbitrum', type: 'evm' },
  { id: 'sol', name: 'Solana', type: 'svm' },
];

const DepositFlow: React.FC<DepositFlowProps> = ({ onDepositComplete }) => {
  const { login, authenticated, user } = usePrivy();
  const [step, setStep] = useState<'login' | 'select' | 'transfer' | 'verifying'>('login');
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [selectedChain, setSelectedChain] = useState(CHAINS[0]);
  const [copied, setCopied] = useState(false);

  // Auto-advance if already logged in
  React.useEffect(() => {
    if (authenticated && step === 'login') {
      setStep('select');
    }
  }, [authenticated, step]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAddress = () => {
    if (selectedChain.type === 'evm') return user?.wallet?.address || '0x71C...39A2';
    if (selectedChain.type === 'svm') return 'Sol...Address...Mock';
    if (selectedChain.type === 'btc') return 'bc1...Bitcoin...Address';
    return '0x...';
  };

  const handleVerify = () => {
    setStep('verifying');
    // Simulate blockchain verification
    setTimeout(() => {
      onDepositComplete(5000); // Simulate receiving $5000
    }, 2500);
  };

  // 1. LOGIN STEP
  if (!authenticated || step === 'login') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto p-6 text-center">
        <div className="mb-8 relative">
           <ImpalaMascot
             mood="excited"
             message="Let's create your secure vault! It's the first step to your empire."
             className="scale-125 origin-bottom"
           />
           {/* Animated Pointer */}
           <div className="absolute -right-8 bottom-0 animate-bounce-slight text-4xl">👇</div>
        </div>

        <h2 className="text-3xl font-display font-bold text-stone-800 mb-2">Create Your Wallet</h2>
        <p className="text-stone-500 mb-8">Connect securely with social login or your existing wallet to start earning.</p>

        <button
          onClick={login}
          className="w-full py-4 bg-impala-500 hover:bg-impala-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-impala-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 animate-pulse-fast"
        >
          <Wallet size={24} />
          Connect & Start
        </button>
        <p className="mt-4 text-xs text-stone-400">Powered by Privy. Secure & Non-custodial.</p>
      </div>
    );
  }

  // 2. VERIFYING STEP
  if (step === 'verifying') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <ImpalaMascot mood="happy" message="Funds spotted! Confirming transaction..." />
         <div className="mt-8 flex flex-col items-center">
            <RefreshCcw className="animate-spin text-impala-500 mb-4" size={48} />
            <p className="font-bold text-stone-600">Checking blockchain...</p>
         </div>
      </div>
    );
  }

  // 3. DEPOSIT/TRANSFER STEP
  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-impala-100">
        {/* Header */}
        <div className="bg-impala-50 p-6 border-b border-impala-100 text-center relative">
          <ImpalaMascot
            mood="happy"
            message="Your vault is ready! Now, let's add some fuel."
            className="absolute -top-12 -left-4 w-20 h-20 sm:w-24 sm:h-24 hidden sm:block"
          />
          <h2 className="text-2xl font-display font-bold text-stone-800">Deposit Funds</h2>
          <p className="text-sm text-stone-500 font-medium">Quest 1: The Foundation</p>
        </div>

        <div className="p-6">
          {/* Asset Selection */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">1. Select Asset</label>
            <div className="grid grid-cols-3 gap-3">
              {ASSETS.map(asset => (
                <button
                  key={asset.symbol}
                  onClick={() => setSelectedAsset(asset)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                    ${selectedAsset.symbol === asset.symbol
                      ? 'border-impala-500 bg-impala-50 text-impala-700'
                      : 'border-stone-100 hover:border-impala-200 text-stone-600'}`}
                >
                  <span className="text-2xl">{asset.icon}</span>
                  <span className="font-bold text-sm">{asset.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chain Selection */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-stone-500 mb-2 uppercase tracking-wide">2. Select Network</label>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {CHAINS.map(chain => {
                // Simple filter logic for demo
                const disabled = (selectedAsset.symbol === 'BTC' && chain.id !== 'btc') || (selectedAsset.symbol !== 'BTC' && chain.id === 'btc');
                if (disabled) return null;

                return (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className={`px-4 py-2 rounded-xl border-2 font-bold text-sm whitespace-nowrap transition-all
                      ${selectedChain.id === chain.id
                        ? 'border-impala-500 bg-impala-50 text-impala-700'
                        : 'border-stone-100 hover:border-impala-200 text-stone-600'}`}
                  >
                    {chain.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Address Display */}
          <div className="bg-stone-50 rounded-2xl p-6 mb-8 text-center border border-dashed border-stone-300 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-sm text-xs font-bold text-stone-400 flex items-center gap-1">
                <ArrowDownCircle size={14} /> Send to this address
             </div>

             <div className="font-mono text-sm sm:text-lg break-all text-stone-700 mb-4 font-bold bg-white p-3 rounded-lg border border-stone-100">
               {getAddress()}
             </div>

             <button
               onClick={() => handleCopy(getAddress())}
               className="inline-flex items-center gap-2 text-impala-600 font-bold hover:text-impala-700 transition-colors"
             >
               {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
               {copied ? 'Copied!' : 'Copy Address'}
             </button>

             <div className="mt-4 text-xs text-stone-400 bg-blue-50 text-blue-700 p-2 rounded-lg inline-block">
                Only send <strong>{selectedAsset.name}</strong> on <strong>{selectedChain.name}</strong> network.
             </div>
          </div>

          {/* Action */}
          <button
            onClick={handleVerify}
            className="w-full py-4 bg-impala-500 hover:bg-impala-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-impala-200 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            I have sent the funds <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositFlow;
