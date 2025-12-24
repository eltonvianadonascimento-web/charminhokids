
import React from 'react';
import { Order as Quote, Product } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  quotes: Quote[];
  products: Product[];
}

const Dashboard: React.FC<DashboardProps> = ({ quotes, products }) => {
  const totalSales = quotes.filter(q => q.status === 'Vendido').reduce((acc, q) => acc + q.total, 0);
  const totalOrders = quotes.length;
  const pendingOrders = quotes.filter(q => q.status === 'Pendente').length;
  const lowStock = products.filter(p => p.stock < 5).length;

  const stats = [
    { label: 'Faturamento', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSales), icon: '💰', bg: 'bg-green-100', text: 'text-green-700' },
    { label: 'Pedidos do Mês', value: totalOrders, icon: '🛍️', bg: 'bg-pink-100', text: 'text-pink-700' },
    { label: 'Aguardando', value: pendingOrders, icon: '🧸', bg: 'bg-amber-100', text: 'text-amber-700' },
    { label: 'Reposição', value: lowStock, icon: '⚠️', bg: 'bg-sky-100', text: 'text-sky-700' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          <span className="text-3xl">👋</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Olá, Lojista!</h1>
          <p className="text-slate-500">Veja como está o brilho da sua boutique hoje.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.bg} p-6 rounded-[2rem] border-4 border-white shadow-xl shadow-slate-200/50 transition-transform hover:scale-105`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center">
                 <div className={`w-2 h-2 rounded-full ${stat.text.replace('text-', 'bg-')}`}></div>
              </div>
            </div>
            <p className={`text-xs font-black uppercase tracking-widest opacity-70 ${stat.text}`}>{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Movimentação <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Pedidos recentes</span>
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quotes.slice(0, 7).reverse().map(q => ({ name: `Nº ${q.id}`, total: q.total }))}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#fef2f2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} />
                <Tooltip 
                  cursor={{fill: '#fff1f2', radius: 10}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                />
                <Bar dataKey="total" fill="#f472b6" radius={[12, 12, 12, 12]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-pink-400 p-8 rounded-[2.5rem] text-white shadow-xl shadow-pink-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
          <h3 className="text-xl font-bold mb-6 relative z-10">Fila de Cabide 👗</h3>
          <div className="space-y-4 relative z-10">
            {products.filter(p => p.stock < 5).length > 0 ? (
              products.filter(p => p.stock < 5).slice(0, 4).map(p => (
                <div key={p.id} className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/30">
                  <div>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-[10px] opacity-80">Tam: {p.size} • Ref: {p.id.slice(0,4)}</p>
                  </div>
                  <span className="bg-white text-pink-500 px-3 py-1 rounded-full text-xs font-black">{p.stock}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 opacity-80 italic text-sm">Nenhum item em falta! 🎉</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
