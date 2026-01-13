import React from 'react';
import { PortfolioPosition, Vault } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface PortfolioProps {
  positions: PortfolioPosition[];
  vaults: Vault[];
  totalInvested: number;
  balance: number;
}

const COLORS = ['#fb923c', '#fdba74', '#fed7aa', '#f97316', '#ea580c'];

const Portfolio: React.FC<PortfolioProps> = ({ positions, vaults, totalInvested, balance }) => {
  
  const data = positions.map(pos => {
      const vault = vaults.find(v => v.id === pos.vaultId);
      return {
          name: vault?.name || 'Unknown',
          value: pos.amount,
          profit: pos.profit
      };
  });

  const totalValue = totalInvested + positions.reduce((acc, curr) => acc + curr.profit, 0);

  if (positions.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-stone-300 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-3xl">
                  👻
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">No investments yet</h3>
              <p className="text-stone-500 max-w-xs mx-auto">Start your wealth journey by depositing into a vault from the Explore tab!</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
        {/* Total Balance Card */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-impala-500 rounded-full blur-[80px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
                <p className="text-stone-400 font-medium text-sm mb-1">Total Portfolio Value</p>
                <h2 className="text-4xl font-display font-bold mb-4">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                
                <div className="flex gap-4">
                     <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 flex items-center gap-2 border border-white/10">
                        <div className="bg-green-500/20 p-1 rounded-full text-green-400">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                             <p className="text-xs text-stone-400">Total Profit</p>
                             <p className="font-bold text-green-400">+${positions.reduce((acc, c) => acc + c.profit, 0).toFixed(2)}</p>
                        </div>
                     </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10">
                           <p className="text-xs text-stone-400">Wallet Cash</p>
                           <p className="font-bold">${balance.toLocaleString()}</p>
                      </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 min-h-[300px] flex flex-col">
                <h3 className="font-bold text-stone-800 mb-4">Allocation</h3>
                <div className="flex-1 w-full h-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* List */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
                 <h3 className="font-bold text-stone-800 mb-4">Your Positions</h3>
                 <div className="space-y-4">
                     {positions.map(pos => {
                         const vault = vaults.find(v => v.id === pos.vaultId);
                         if (!vault) return null;
                         return (
                             <div key={pos.vaultId} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 transition-colors">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-lg shadow-sm">
                                         {vault.category === 'Savings' ? '🐷' : '🌾'}
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-stone-800 text-sm">{vault.name}</h4>
                                         <p className="text-xs text-stone-500">{vault.protocol}</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <p className="font-bold text-stone-800">${pos.amount.toLocaleString()}</p>
                                     <p className="text-xs font-bold text-green-500 flex items-center justify-end gap-1">
                                         <ArrowUpRight size={10} /> ${pos.profit}
                                     </p>
                                 </div>
                             </div>
                         )
                     })}
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Portfolio;