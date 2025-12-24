
import React, { useState, useEffect } from 'react';
import { View, Product, Order } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import QuoteForm from './components/QuoteForm';
import QuoteHistory from './components/QuoteHistory';
import CustomerList from './components/CustomerList';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('pequeno_estilo_products');
    const savedOrders = localStorage.getItem('pequeno_estilo_orders');

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts: Product[] = [
        { id: '1', name: 'Macacão Plush Ursinho', description: 'Tecido macio e antialérgico', size: 'M', cost: 45.00, margin: 60, salePrice: 112.50, stock: 15, category: 'Bebê' },
        { id: '2', name: 'Conjunto Moletom Dino', description: 'Capuz com detalhes de dinossauro', size: '4', cost: 65.00, margin: 55, salePrice: 144.44, stock: 8, category: 'Menino' },
        { id: '3', name: 'Vestido Floral Verão', description: 'Algodão leve com estampa exclusiva', size: '2', cost: 55.00, margin: 65, salePrice: 157.14, stock: 4, category: 'Menina' },
      ];
      setProducts(initialProducts);
      localStorage.setItem('pequeno_estilo_products', JSON.stringify(initialProducts));
    }

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pequeno_estilo_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pequeno_estilo_orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (p: Product) => setProducts([...products, p]);
  const updateProduct = (updatedP: Product) => {
    setProducts(products.map(p => p.id === updatedP.id ? updatedP : p));
  };
  const deleteProduct = (id: string) => setProducts(products.filter(p => p.id !== id));

  const addOrder = (o: Order) => {
    setOrders([o, ...orders]);
    const updatedProducts = products.map(p => {
      const item = o.items.find(i => i.productId === p.id);
      if (item) return { ...p, stock: Math.max(0, p.stock - item.quantity) };
      return p;
    });
    setProducts(updatedProducts);
  };

  const updateOrderStatus = (id: number, newStatus: Order['status']) => {
    const orderToUpdate = orders.find(o => o.id === id);
    if (!orderToUpdate) return;
    const oldStatus = orderToUpdate.status;

    if (newStatus === 'Cancelado' && oldStatus !== 'Cancelado') {
      const updatedProducts = products.map(p => {
        const item = orderToUpdate.items.find(i => i.productId === p.id);
        if (item) return { ...p, stock: p.stock + item.quantity };
        return p;
      });
      setProducts(updatedProducts);
    } else if (oldStatus === 'Cancelado' && newStatus !== 'Cancelado') {
      const updatedProducts = products.map(p => {
        const item = orderToUpdate.items.find(i => i.productId === p.id);
        if (item) return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        return p;
      });
      setProducts(updatedProducts);
    }
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );

  function renderView() {
    switch (currentView) {
      case 'dashboard': return <Dashboard quotes={orders} products={products} />;
      case 'inventory': return <Inventory products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />;
      case 'new-quote': return <QuoteForm products={products} onSave={addOrder} nextId={orders.length + 1} goToHistory={() => setCurrentView('history')} />;
      case 'history': return <QuoteHistory quotes={orders} onUpdateStatus={updateOrderStatus} />;
      case 'customers': return <CustomerList quotes={orders} />;
      default: return <Dashboard quotes={orders} products={products} />;
    }
  }
};

export default App;
