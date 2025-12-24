
import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', cost: 0, margin: 0, salePrice: 0, stock: 0, category: '', description: '', size: ''
  });

  // Novos estados para registro de compra
  const [purchaseQty, setPurchaseQty] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);

  useEffect(() => {
    const cost = formData.cost || 0;
    const margin = formData.margin || 0;
    let calculatedSalePrice = 0;
    // Cálculo baseado em Markup: Preço = Custo / (1 - Margem/100)
    if (margin < 100) {
      calculatedSalePrice = cost / (1 - margin / 100);
    } else {
      calculatedSalePrice = cost;
    }
    if (calculatedSalePrice !== formData.salePrice) {
      setFormData(prev => ({ ...prev, salePrice: Number(calculatedSalePrice.toFixed(2)) }));
    }
  }, [formData.cost, formData.margin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalProduct = {
      ...formData,
      id: editingProduct ? editingProduct.id : `PROD-${Date.now()}`,
      name: formData.name || '',
      description: formData.description || '',
      size: formData.size || 'G',
      cost: formData.cost || 0,
      margin: formData.margin || 0,
      salePrice: formData.salePrice || 0,
      stock: formData.stock || 0,
      category: formData.category || 'Geral',
    } as Product;

    if (editingProduct) {
      onUpdate(finalProduct);
    } else {
      onAdd(finalProduct);
    }
    setIsAdding(false);
    resetForm();
  };

  const handleApplyPurchase = () => {
    if (purchaseQty <= 0 || purchasePrice <= 0) {
      alert("Por favor, insira uma quantidade e um preço de compra válidos.");
      return;
    }

    const currentStock = formData.stock || 0;
    const currentCost = formData.cost || 0;

    // Fórmula de Preço Médio Ponderado:
    // Novo Custo = ((Estoque Atual * Custo Atual) + (Qtd Comprada * Preço Compra)) / (Estoque Atual + Qtd Comprada)
    const newTotalStock = currentStock + purchaseQty;
    const newAverageCost = ((currentStock * currentCost) + (purchaseQty * purchasePrice)) / newTotalStock;

    setFormData(prev => ({
      ...prev,
      stock: newTotalStock,
      cost: Number(newAverageCost.toFixed(2))
    }));

    // Resetar campos de compra após aplicar
    setPurchaseQty(0);
    setPurchasePrice(0);
  };

  const resetForm = () => {
    setFormData({ name: '', cost: 0, margin: 0, salePrice: 0, stock: 0, category: '', description: '', size: '' });
    setPurchaseQty(0);
    setPurchasePrice(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Nosso Cabideiro</h1>
          <p className="text-slate-500 font-medium italic">Gerencie as roupinhas e acessórios da loja.</p>
        </div>
        <button
          onClick={() => { setIsAdding(true); setEditingProduct(null); resetForm(); }}
          className="bg-amber-400 hover:bg-amber-500 text-white px-8 py-4 rounded-[2rem] font-black transition-all shadow-lg shadow-amber-100 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Novo Item
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-y-auto max-h-[95vh] animate-in zoom-in duration-300">
            <div className="p-8 bg-pink-50 border-b border-pink-100 flex justify-between items-center sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-pink-600">{editingProduct ? 'Ajustar Peça' : 'Nova Peça'}</h3>
                <p className="text-pink-400 text-sm font-bold uppercase tracking-widest">Detalhes do Produto</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="bg-white p-2 rounded-2xl text-pink-300 hover:text-pink-500 shadow-sm transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Seção de Registro de Compra (Apenas na Edição) */}
              {editingProduct && (
                <div className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">📦</span>
                    <h4 className="text-sm font-black text-amber-700 uppercase tracking-widest">Registrar Nova Compra</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Qtd Comprada</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-300 outline-none font-bold"
                        value={purchaseQty}
                        onChange={e => setPurchaseQty(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Valor Un. Compra (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 bg-white border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-300 outline-none font-bold"
                        value={purchasePrice}
                        onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPurchase}
                    className="w-full bg-amber-400 text-white py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-500 transition-all shadow-md shadow-amber-100"
                  >
                    Compras
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nome da Peça</label>
                    <input
                      required
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tamanho</label>
                    <input
                      required
                      placeholder="RN, 2, P..."
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all text-center"
                      value={formData.size}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Custo Médio Un. (R$)</label>
                    <input
                      type="number" step="0.01" required
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all"
                      value={formData.cost}
                      onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Margem Lucro (%)</label>
                    <input
                      type="number" step="0.1" required
                      className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-pink-300 focus:bg-white outline-none font-bold transition-all"
                      value={formData.margin}
                      onChange={e => setFormData({ ...formData, margin: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="p-5 bg-sky-50 rounded-3xl border-2 border-sky-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Preço de Venda Final</p>
                    <p className="text-2xl font-black text-sky-600">R$ {formData.salePrice?.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <label className="block text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">Total em Estoque</label>
                    <input
                      type="number" required
                      className="w-20 px-3 py-2 bg-white border-2 border-sky-200 rounded-xl focus:border-sky-400 outline-none font-black text-center text-sky-700"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full bg-pink-500 text-white py-4 rounded-[2rem] font-black text-lg hover:bg-pink-600 transition-all shadow-xl shadow-pink-100">
                    {editingProduct ? 'Salvar Alterações' : 'Colocar no Cabide'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-pink-50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Peça / Categoria</th>
                <th className="px-6 py-5 text-center">Tamanho</th>
                <th className="px-6 py-5 text-center">Preço Final</th>
                <th className="px-6 py-5 text-center">No Estoque</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-pink-50/30 transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-base">{product.name}</p>
                    <p className="text-xs font-bold text-pink-400">{product.category}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-black border border-amber-100">
                      {product.size}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <p className="font-black text-slate-800">R$ {product.salePrice.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Custo Médio: R$ {product.cost.toFixed(2)}</p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black ${
                      product.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 5 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingProduct(product); setFormData(product); setIsAdding(true); }} className="p-3 bg-white text-sky-400 hover:text-sky-600 rounded-2xl shadow-sm border border-sky-50 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDelete(product.id)} className="p-3 bg-white text-red-300 hover:text-red-500 rounded-2xl shadow-sm border border-red-50 transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
