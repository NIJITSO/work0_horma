'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';

interface OrderItemProduct {
  name: string;
  slug: string;
  mainImage: string;
}

interface OrderItemVariant {
  id: number;
  sku: string;
  product: OrderItemProduct;
  scent?: { name: string } | null;
  size?: { name: string; value: string } | null;
}

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: string | number;
  totalPrice: string | number;
  productVariant: OrderItemVariant;
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  address?: string | null;
  city?: string | null;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: string | number;
  shippingAddress: string;
  createdAt: string;
  customer?: Customer | null;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.orders) setOrders(data.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert(data.error || 'Erreur lors du changement de statut');
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payee':
        return {
          label: 'Payée',
          classes: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
        };
      case 'expediee':
        return {
          label: 'Expédiée',
          classes: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: Truck,
        };
      case 'livree':
        return {
          label: 'Livrée',
          classes: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: Check,
        };
      case 'annulee':
        return {
          label: 'Annulée',
          classes: 'bg-rose-100 text-rose-800 border-rose-300',
          icon: RotateCcw,
        };
      default:
        return {
          label: 'En attente',
          classes: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
        };
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.firstName && o.customer.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer?.lastName && o.customer.lastName.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer?.phone && o.customer.phone.includes(search)) ||
      (o.customer?.city && o.customer.city.toLowerCase().includes(search.toLowerCase())) ||
      o.shippingAddress.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#123D35]">Gestion des Commandes</h1>
          <p className="text-xs text-[#64746E]">
            Visualisez les commandes clients, préparez les colis et mettez à jour les statuts de livraison.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-2 bg-[#123D35] hover:bg-[#1A5449] text-[#FAF7F2] font-semibold px-4 py-2 rounded-xl shadow transition-all cursor-pointer text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="N° commande, client, téléphone, ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F8F4EC]/60 border border-[#2D3533]/10 rounded-xl focus:outline-none focus:border-[#123D35]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'en_attente', label: 'En attente' },
            { id: 'payee', label: 'Payée' },
            { id: 'expediee', label: 'Expédiée' },
            { id: 'livree', label: 'Livrée' },
            { id: 'annulee', label: 'Annulée' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-[#123D35] text-[#FAF7F2] shadow-xs font-semibold'
                  : 'bg-[#F8F4EC] text-[#64746E] hover:text-[#123D35]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-[#123D35] flex flex-col items-center gap-3 bg-white rounded-2xl border border-[#2D3533]/10">
            <div className="w-8 h-8 border-3 border-[#123D35] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">Chargement des commandes...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#64746E] bg-white rounded-2xl border border-[#2D3533]/10 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-sm font-semibold text-[#123D35]">Aucune commande trouvée</p>
            <p className="text-xs text-gray-400">
              Les commandes passées par vos clients sur la boutique s&apos;afficheront ici.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const badge = getStatusBadge(order.status);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#2D3533]/10 p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#2D3533]/10 flex items-center justify-center text-[#123D35]">
                      <ShoppingBag className="w-5 h-5 text-[#C89748]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#123D35]">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${badge.classes}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#64746E]">Statut :</span>
                    <div className="relative">
                      <select
                        value={order.status}
                        disabled={updatingId === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold bg-[#FAF7F2] border border-[#2D3533]/15 rounded-xl text-[#123D35] focus:outline-none focus:border-[#123D35] cursor-pointer disabled:opacity-50"
                      >
                        <option value="en_attente">En attente</option>
                        <option value="payee">Payée</option>
                        <option value="expediee">Expédiée</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  </div>
                </div>

                {/* Details row: Customer + Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#FAF7F2]/60 p-3.5 rounded-xl border border-[#2D3533]/5">
                  <div className="space-y-1">
                    <p className="font-semibold text-[#123D35] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C89748]" />
                      <span>
                        {order.customer
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : 'Client Invité'}
                      </span>
                    </p>
                    {order.customer?.phone && (
                      <p className="text-[#64746E] flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.customer.phone}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="font-semibold text-[#123D35] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C89748]" />
                      <span>Adresse de livraison :</span>
                    </p>
                    <p className="text-[#64746E]">
                      {order.shippingAddress || 'Non renseignée'}
                      {order.customer?.city ? ` — ${order.customer.city}` : ''}
                    </p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="divide-y divide-gray-100 text-xs">
                  {order.items?.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-md bg-[#123D35]/10 flex items-center justify-center text-[#123D35]">
                          <Layers className="w-3 h-3 text-[#C89748]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#123D35]">
                            {item.productVariant?.product?.name || 'Produit'}
                          </p>
                          <p className="text-[11px] text-[#64746E]">
                            {item.productVariant?.scent?.name
                              ? `Parfum: ${item.productVariant.scent.name}`
                              : ''}
                            {item.productVariant?.scent?.name && item.productVariant?.size?.value
                              ? ' · '
                              : ''}
                            {item.productVariant?.size?.value
                              ? `Format: ${item.productVariant.size.value}`
                              : ''}
                            {' · '}
                            <span className="font-mono text-gray-400">
                              SKU: {item.productVariant?.sku}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-gray-500 text-[11px]">
                          {item.quantity} × {Number(item.unitPrice).toFixed(2)} MAD
                        </p>
                        <p className="font-bold text-[#123D35]">
                          {Number(item.totalPrice).toFixed(2)} MAD
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total row */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#64746E]">Montant Total TTC :</span>
                  <span className="text-base font-bold text-[#123D35]">
                    {Number(order.totalAmount).toFixed(2)} MAD
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
