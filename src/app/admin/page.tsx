'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  Tag
} from 'lucide-react';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  totalCategories: number;
  totalScents: number;
  totalSizes: number;
  totalOrders: number;
  totalRevenue: number;
}

interface ProductItem {
  id: number;
  name: string;
  nameAr?: string;
  slug: string;
  mainImage: string;
  basePrice: string | number;
  isActive: boolean;
  category: {
    name: string;
  };
  variants: Array<{ id: number }>;
}

interface OrderItem {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: string | number;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    totalScents: 0,
    totalSizes: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentProducts, setRecentProducts] = useState<ProductItem[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes, scentRes, sizeRes, ordRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
          fetch('/api/admin/scents'),
          fetch('/api/admin/sizes'),
          fetch('/api/admin/orders'),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const scentData = await scentRes.json();
        const sizeData = await sizeRes.json();
        const ordData = await ordRes.json();

        const prods: ProductItem[] = prodData.products || [];
        const cats = catData.categories || [];
        const scents = scentData.scents || [];
        const sizes = sizeData.sizes || [];
        const orders: OrderItem[] = ordData.orders || [];

        const activeProds = prods.filter((p) => p.isActive).length;
        const revenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

        setStats({
          totalProducts: prods.length,
          activeProducts: activeProds,
          totalCategories: cats.length,
          totalScents: scents.length,
          totalSizes: sizes.length,
          totalOrders: orders.length,
          totalRevenue: revenue,
        });

        setRecentProducts(prods.slice(0, 5));
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payee':
      case 'livree':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">Payée / Livrée</span>;
      case 'expediee':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">Expédiée</span>;
      case 'annulee':
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-300">Annulée</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">En attente</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#123D35] border-t-[#C89748] rounded-full animate-spin" />
          <p className="text-sm text-[#123D35]/70 font-medium">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#123D35] to-[#1A5449] p-6 md:p-8 rounded-2xl text-[#FAF7F2] shadow-xl border border-[#C89748]/30">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#DFB26E] font-semibold">
            Portail Boutique AL HURRA
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#FAF7F2] mt-1">
            Tableau de Bord
          </h1>
          <p className="text-sm text-[#FAF7F2]/80 mt-1 max-w-xl">
            Gérez en temps réel vos produits, catégories, variantes de parfums et commandes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 bg-[#C89748] hover:bg-[#DFB26E] text-[#0B2520] font-semibold px-4 py-2.5 rounded-xl shadow transition-all active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 bg-[#0B2520]/60 hover:bg-[#0B2520] border border-[#C89748]/30 text-[#FAF7F2] px-4 py-2.5 rounded-xl transition-all text-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#DFB26E]" />
            <span>Commandes</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Products Stat */}
        <div className="bg-white p-5 rounded-2xl border border-[#2D3533]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64746E] uppercase tracking-wider">Produits</p>
            <h3 className="text-2xl font-bold text-[#123D35] mt-1">{stats.totalProducts}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{stats.activeProducts} actifs en ligne</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#123D35]/10 text-[#123D35] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Categories Stat */}
        <div className="bg-white p-5 rounded-2xl border border-[#2D3533]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64746E] uppercase tracking-wider">Catégories</p>
            <h3 className="text-2xl font-bold text-[#123D35] mt-1">{stats.totalCategories}</h3>
            <p className="text-xs text-[#64746E] mt-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#C89748]" />
              <span>Rayons du catalogue</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#C89748]/15 text-[#C89748] flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Scents / Sizes Stat */}
        <div className="bg-white p-5 rounded-2xl border border-[#2D3533]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64746E] uppercase tracking-wider">Variétés</p>
            <h3 className="text-2xl font-bold text-[#123D35] mt-1">
              {stats.totalScents + stats.totalSizes}
            </h3>
            <p className="text-xs text-[#64746E] mt-1">
              {stats.totalScents} parfums · {stats.totalSizes} formats
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Orders / Sales Stat */}
        <div className="bg-white p-5 rounded-2xl border border-[#2D3533]/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#64746E] uppercase tracking-wider">Commandes</p>
            <h3 className="text-2xl font-bold text-[#123D35] mt-1">{stats.totalOrders}</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{stats.totalRevenue.toFixed(2)} MAD</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C89748] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid of Sections: Products & Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products List Preview */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#123D35]">Catalogue Produits</h3>
                <p className="text-xs text-[#64746E]">Derniers produits enregistrés</p>
              </div>
              <Link
                href="/admin/products"
                className="text-xs font-semibold text-[#123D35] hover:text-[#C89748] flex items-center gap-1 transition-colors"
              >
                <span>Tout gérer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentProducts.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#64746E]">Aucun produit enregistré pour le moment.</p>
              ) : (
                recentProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-[#F8F4EC] relative overflow-hidden shrink-0 border border-[#2D3533]/10">
                        {p.mainImage ? (
                          <Image
                            src={p.mainImage}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-gray-400 m-auto mt-3" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#2D3533] truncate">{p.name}</p>
                        <p className="text-xs text-[#64746E] truncate">{p.category?.name || 'Sans catégorie'}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#123D35]">{Number(p.basePrice).toFixed(2)} MAD</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {p.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              href="/admin/products"
              className="w-full py-2.5 px-4 bg-[#F8F4EC] hover:bg-[#123D35] hover:text-[#FAF7F2] text-[#123D35] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Ajouter ou modifier des produits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Orders Preview */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D3533]/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#123D35]">Dernières Commandes</h3>
                <p className="text-xs text-[#64746E]">Suivi des ventes récentes</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-semibold text-[#123D35] hover:text-[#C89748] flex items-center gap-1 transition-colors"
              >
                <span>Toutes les commandes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#64746E]">Aucune commande reçue pour le moment.</p>
              ) : (
                recentOrders.map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#2D3533]">
                        {o.orderNumber}
                      </p>
                      <p className="text-xs text-[#64746E]">
                        {o.customer ? `${o.customer.firstName} ${o.customer.lastName}` : 'Client invité'}
                        {o.customer?.phone ? ` · ${o.customer.phone}` : ''}
                      </p>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-right shrink-0 space-y-1">
                      <p className="text-sm font-bold text-[#123D35]">
                        {Number(o.totalAmount).toFixed(2)} MAD
                      </p>
                      <div>{getStatusBadge(o.status)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <Link
              href="/admin/orders"
              className="w-full py-2.5 px-4 bg-[#F8F4EC] hover:bg-[#123D35] hover:text-[#FAF7F2] text-[#123D35] text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Gérer les commandes & expéditions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
