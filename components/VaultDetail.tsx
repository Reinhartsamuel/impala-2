import React, { useState } from 'react';
import { X, TrendingUp, ShieldCheck, AlertCircle, Wallet } from 'lucide-react';
import { Vault } from '../types';

interface VaultDetailProps {
  vault: Vault;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  userBalance: number;
}

const VaultDetail: React.FC<VaultDetailProps> = ({ vault, onClose, onDeposit, userBalance }) => {
  const [amount, setAmount] = useState<string>('');
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDeposit = () => {
    setIsDepositing(true);
    setTimeout(() => {
        onDeposit(Number(amount));
        setIsDepositing(false);
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-stone-50 border-b border-stone-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                    ${vault.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
                      vault.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {vault.riskLevel} Risk
                </span>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-wider">{vault.chain}</span>
            </div>
            <h2 className="text-2xl font-display font-bold text-stone-800">{vault.name}</h2>
            <p className="text-sm text-stone-500 font-medium">Strategy by {vault.protocol}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white rounded-full text-stone-400 hover:text-stone-800 shadow-sm border border-stone-100">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-impala-50 rounded-2xl p-4 text-center border border-impala-100">
                    <p className="text-stone-500 text-xs font-bold uppercase mb-1">APY</p>
                    <p className="text-2xl font-black text-impala-600">{vault.apy}%</p>
                </div>
                 <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-100">
                    <p className="text-stone-500 text-xs font-bold uppercase mb-1">TVL</p>
                    <p className="text-xl font-bold text-stone-700">{vault.tvl}</p>
                </div>
                 <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-100">
                    <p className="text-stone-500 text-xs font-bold uppercase mb-1">24H</p>
                    <p className={`text-xl font-bold ${vault.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {vault.change24h > 0 ? '+' : ''}{vault.change24h}%
                    </p>
                </div>
            </div>

            <p className="text-stone-600 mb-6 leading-relaxed">
                {vault.description}
            </p>

            <div className="space-y-4 mb-8">
                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl text-blue-800 text-sm">
                    <ShieldCheck className="shrink-0" size={18} />
                    <span>Audited smart contracts. Principal protection priority.</span>
                 </div>
                  <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl text-stone-600 text-sm">
                    <AlertCircle className="shrink-0" size={18} />
                    <span>Fees: {vault.fee}. No lock-up period.</span>
                 </div>
            </div>

            {/* Deposit Form */}
            <div className="bg-white border-2 border-stone-100 rounded-2xl p-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-stone-600">Deposit Amount</span>
                    <span className="text-stone-400">Balance: ${userBalance.toLocaleString()}</span>
                </div>
                <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">$</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 bg-stone-50 rounded-xl font-bold text-xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-impala-400"
                    />
                     <button
                        onClick={() => setAmount(userBalance.toString())}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold bg-white px-2 py-1 rounded-lg border border-stone-200 text-impala-500 hover:bg-impala-50"
                    >
                        MAX
                    </button>
                </div>
                <button
                    onClick={handleDeposit}
                    disabled={!amount || Number(amount) <= 0 || Number(amount) > userBalance || isDepositing}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                        ${!amount || Number(amount) <= 0 || Number(amount) > userBalance
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-impala-500 text-white hover:bg-impala-600 shadow-lg shadow-impala-200 hover:-translate-y-1'
                        }`}
                >
                    {isDepositing ? (
                        <>Processing...</>
                    ) : (
                        <><Wallet size={20} /> Deposit Now</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetail;
