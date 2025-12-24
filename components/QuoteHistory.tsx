
import React from 'react';
import { Order as Quote } from '../types';
import { generateQuotePDF } from '../services/pdfService';

interface QuoteHistoryProps {
  quotes: Quote[];
  onUpdateStatus?: (id: number, status: Quote['status']) => void;
}

const QuoteHistory: React.FC<QuoteHistoryProps> = ({ quotes, onUpdateStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vendido': return 'bg-emerald-100 text-emerald-700';
      case 'Cancelado': return 'bg-rose-100 text-rose-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Baú de Pedidos</h1>
          <p className="text-slate-500 font-medium italic">Histórico de todas as roupinhas vendidas.</p>
        </div>
        <div className="text-4xl">📚</div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Nº / Data</th>
                <th className="px-8 py-5">Mamãe/Papai</th>
                <th className="px-8 py-5">Pagamento</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-pink-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800">#{quote.id.toString().padStart(4, '0')}</p>
                    <p className="text-[10px] font-bold text-slate-400">{new Date(quote.date).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800">{quote.clientName}</p>
                    <p className="text-[10px] font-bold text-pink-400">{quote.clientPhone}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {quote.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-black text-slate-800">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(quote.total)}
                    </p>
                    {quote.discountPercentage > 0 && (
                      <p className="text-[10px] font-bold text-pink-500">Mimo de {quote.discountPercentage}%</p>
                    )}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <select
                      value={quote.status}
                      onChange={(e) => onUpdateStatus?.(quote.id, e.target.value as Quote['status'])}
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-transparent focus:ring-0 cursor-pointer appearance-none transition-all ${getStatusColor(quote.status)}`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Vendido">Vendido</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => generateQuotePDF(quote)}
                      className="p-3 text-sky-400 hover:text-sky-600 bg-white border border-sky-50 rounded-2xl shadow-sm transition-all hover:scale-110 active:scale-95"
                      title="Baixar PDF"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {quotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl opacity-50">🕳️</div>
                      <p className="text-slate-400 font-bold italic tracking-wide">O baú está vazio por enquanto...</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default QuoteHistory;
