import React, { useState } from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [historyOpen, setHistoryOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', color: 'text-pink-500' },
    { id: 'inventory', label: 'Cabideiro', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'text-amber-500' },
    { id: 'new-quote', label: 'Novo Pedido', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-sky-500' },
  ];

  return (
    <div className="w-20 md:w-64 bg-white border-r border-pink-100 flex flex-col h-screen sticky top-0">
      <div className="p-4 md:p-6 border-b border-pink-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-400 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-pink-100">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"/></svg>
        </div>
        <div className="hidden md:block">
          <span className="font-bold text-lg text-slate-800 tracking-tight block leading-tight">Charminho Kids</span>
          <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest">Boutique Infantil</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-pink-50 text-pink-600 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <svg className={`w-6 h-6 shrink-0 ${currentView === item.id ? 'text-pink-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-semibold hidden md:block">{item.label}</span>
          </button>
        ))}

        <div className="pt-4">
          <button
            onClick={() => setHistoryOpen(!historyOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold hidden md:block">Baú</span>
            </div>
            <svg className={`w-4 h-4 hidden md:block transition-transform ${historyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {historyOpen && (
            <div className="md:pl-10 mt-1 space-y-1">
              <button
                onClick={() => setCurrentView('history')}
                className={`w-full flex items-center px-4 py-2 rounded-xl transition-all ${
                  currentView === 'history' ? 'text-pink-600 font-bold bg-pink-50/50' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-sm">Vendas</span>
              </button>
              <button
                onClick={() => setCurrentView('customers')}
                className={`w-full flex items-center px-4 py-2 rounded-xl transition-all ${
                  currentView === 'customers' ? 'text-pink-600 font-bold bg-pink-50/50' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-sm">Clientes</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 mt-auto hidden md:block">
        <div className="bg-sky-50 p-4 rounded-3xl border border-sky-100">
          <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Dica Kids</p>
          <p className="text-xs text-sky-700 font-medium">Lembre de avisar as mamães sobre as novas chegadas!</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;