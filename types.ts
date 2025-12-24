
export interface Product {
  id: string;
  name: string;
  description: string;
  size: string;       // Tamanho (RN, P, M, G, 1, 2, 4...)
  cost: number;
  margin: number;
  salePrice: number;
  stock: number;
  category: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  clientName: string;
  clientEmail: string;
  clientCpf: string;
  clientPhone: string;
  date: string;
  items: QuoteItem[];
  total: number;
  subtotal: number;
  discountPercentage: number;
  paymentMethod: string;
  status: 'Pendente' | 'Vendido' | 'Cancelado';
  observations?: string;
}

export type QuoteItem = OrderItem; // Alias para compatibilidade

export type View = 'dashboard' | 'inventory' | 'new-quote' | 'history' | 'customers';
