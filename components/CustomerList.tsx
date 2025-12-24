
import React from 'react';
import { Order as Quote } from '../types';

interface CustomerListProps {
  quotes: Quote[];
}

interface CustomerSummary {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  totalSpent: number;
  quotesCount: number;
}

const CustomerList: React.FC<CustomerListProps> = ({ quotes }) => {
  // Extract unique customers based on CPF or Name
  const customersMap = new Map<string, CustomerSummary>();

  quotes.forEach(quote => {
    const key = quote.clientCpf || quote.clientName;
    if (customersMap.has(key)) {
      const existing = customersMap.get(key)!;
      existing.totalSpent += quote.total;
      existing.quotesCount += 1;
    } else {
      customersMap.set(key, {
        name: quote.clientName,
        email: quote.clientEmail,
        cpf: quote.clientCpf,
        phone: quote.clientPhone,
        totalSpent: quote.total,
        quotesCount: 1,
      });
    }
  });

  const customers = Array.from(customersMap.values());

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Base de Clientes</h1>
        <p className="text-slate-500">Dados cadastrados através dos pedidos gerados.</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">CPF</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold text-center">Pedidos</th>
                <th className="px-6 py-4 font-semibold text-right">Volume Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{customer.name}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.cpf || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {customer.phone || 'Não informado'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                      {customer.quotesCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(customer.totalSpent)}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-slate-500 font-medium">Nenhum cliente cadastrado ainda.</p>
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

export default CustomerList;
