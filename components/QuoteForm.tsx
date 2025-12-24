
import React, { useState, useMemo } from 'react';
import { Product, Order as Quote, OrderItem as QuoteItem } from '../types';
import { generateQuotePDF } from '../services/pdfService';
import { professionalizeQuoteIntro } from '../services/geminiService';

interface QuoteFormProps {
  products: Product[];
  onSave: (quote: Quote) => void;
  nextId: number;
  goToHistory: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ products, onSave, nextId, goToHistory }) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCpf, setClientCpf] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false);

  const paymentOptions = [
    { id: 'Pix', label: 'Pix ⚡', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'Credito', label: 'Crédito 💳', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'Debito', label: 'Débito 💳', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { id: 'Dinheiro', label: 'Dinheiro 💵', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  ];

  const addItem = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem: QuoteItem = {
      productId: product.id,
      productName: product.name,
      quantity: quantity,
      unitPrice: product.salePrice
    };

    setItems([...items, newItem]);
    setSelectedProductId('');
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  }, [items, discountPercentage]);

  const handleSave = async () => {
    if (!clientName || items.length === 0) return;

    const newQuote: Quote = {
      id: nextId,
      clientName,
      clientEmail,
      clientCpf,
      clientPhone,
      date: new Date().toISOString(),
      items,
      subtotal: totals.subtotal,
      discountPercentage,
      total: totals.total,
      paymentMethod,
      status: 'Pendente',
      observations
    };

    onSave(newQuote);
    generateQuotePDF(newQuote);
    goToHistory();
  };

  const handleAiImprovement = async () => {
    setIsGeneratingIntro(true);
    const intro = await professionalizeQuoteIntro(clientName, items.length);
    setObservations(prev => (prev ? `${intro}\n\n${prev}` : intro));
    setIsGeneratingIntro(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Novo Pedido Encantado</h1>
          <p className="text-slate-500 font-medium italic">Preencha os dados para criar uma venda mágica.</p>
        </div>
        <div className="w-16 h-16 bg-pink-100 rounded-3xl flex items-center justify-center text-3xl shadow-inner border-2 border-white">✨</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Cliente */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center text-sm">👤</span>
              Quem é o Pequeno(a) Cliente?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  required
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-300 focus:bg-white outline-none font-bold transition-all"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="Ex: Maria Alice Silva"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                <input
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-300 focus:bg-white outline-none font-bold transition-all"
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <input
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-300 focus:bg-white outline-none font-bold transition-all"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  placeholder="mamae@exemplo.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF (Opcional)</label>
                <input
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-sky-300 focus:bg-white outline-none font-bold transition-all"
                  value={clientCpf}
                  onChange={e => setClientCpf(e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Itens */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center text-sm">👗</span>
              Escolha as Peças
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Produto do Cabideiro</label>
                <select
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all appearance-none"
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                >
                  <option value="">Selecione uma roupinha...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Tam: {p.size}) - R$ {p.salePrice.toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-32 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all text-center"
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              <button
                type="button"
                onClick={addItem}
                disabled={!selectedProductId}
                className="bg-slate-800 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-slate-900 disabled:opacity-50 transition-all w-full md:w-auto shadow-lg shadow-slate-100"
              >
                Adicionar
              </button>
            </div>

            <div className="mt-6 border-2 border-pink-50 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-pink-50/50 text-[10px] font-black text-pink-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4 text-center">Qtd</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-50/50">
                  {items.map((item, idx) => (
                    <tr key={idx} className="text-sm font-bold text-slate-700">
                      <td className="px-6 py-4">{item.productName}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black">{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4">R$ {(item.unitPrice * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => removeItem(idx)} className="text-red-300 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-300 font-medium italic">Sua sacolinha está vazia... 🧸</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar de Conclusão */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-pink-50 shadow-sm space-y-6 flex flex-col h-full sticky top-8">
            <h3 className="text-lg font-black text-slate-800">Finalizar Pedido</h3>
            
            {/* Pagamento */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Forma de Pagamento</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`px-3 py-2.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-wider transition-all ${
                      paymentMethod === opt.id 
                        ? `${opt.color.replace(' border-', ' border-').replace('50', '200')} border-current shadow-sm scale-[1.02]` 
                        : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desconto */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mimo Especial (Desconto %)</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-5 py-3 bg-pink-50/30 border-2 border-pink-100 rounded-2xl focus:border-pink-300 outline-none font-black text-pink-600 transition-all pr-12"
                  value={discountPercentage}
                  onChange={e => setDiscountPercentage(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-pink-300">%</span>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-slate-50 p-6 rounded-[2rem] space-y-3 border-2 border-white shadow-inner">
              <div className="flex justify-between items-center text-sm font-bold text-slate-400">
                <span>Subtotal</span>
                <span>R$ {totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-pink-500">
                  <span>Desconto ({discountPercentage}%)</span>
                  <span>- R$ {totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-black text-slate-800 uppercase tracking-widest">Total Final</span>
                <span className="text-2xl font-black text-sky-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total)}
                </span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observações</label>
                  <button 
                    onClick={handleAiImprovement}
                    disabled={isGeneratingIntro || !clientName}
                    className="text-[10px] bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-pink-100 disabled:opacity-50 transition-all border border-pink-100"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    IA Refinar
                  </button>
                </div>
                <textarea
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-[2rem] focus:border-sky-300 focus:bg-white outline-none h-28 resize-none text-xs font-bold text-slate-600 leading-relaxed"
                  placeholder="Recadinho especial, prazos de entrega..."
                  value={observations}
                  onChange={e => setObservations(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!clientName || items.length === 0}
              className="w-full bg-pink-500 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-100 disabled:bg-slate-200 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98]"
            >
              Gerar Pedido & PDF 🎀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
