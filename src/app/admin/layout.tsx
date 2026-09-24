'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AdminSession {
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminSession | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Check session
    fetch('/api/admin/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then((data) => {
        if (data.authenticated && data.admin) {
          setAdminUser(data.admin);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => {
        router.push('/admin/login');
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0B2520] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#DFB26E]">
          <div className="w-10 h-10 border-3 border-[#C89748] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-[#FAF7F2]/60">Vérification de session...</span>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/categories', label: 'Catégories', icon: Layers },
    { href: '/admin/variants', label: 'Variétés & Formats', icon: Sparkles },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#2D3533] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#123D35] text-[#FAF7F2] px-4 py-3 flex items-center justify-between border-b border-[#C89748]/20 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#DFB26E]" />
          <span className="font-serif tracking-widest text-[#DFB26E] font-bold">AL HURRA</span>
          <span className="text-[10px] bg-[#C89748]/20 text-[#DFB26E] px-2 py-0.5 rounded-full border border-[#C89748]/30">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#FAF7F2] hover:text-[#DFB26E] rounded-lg"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar for Desktop / Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#123D35] text-[#FAF7F2] flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Area */}
        <div className="p-6 border-b border-[#C89748]/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2520] border border-[#C89748]/30 flex items-center justify-center text-[#DFB26E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif tracking-widest text-lg text-[#DFB26E] font-bold leading-none">
                AL HURRA
              </h2>
              <span className="text-[11px] text-[#FAF7F2]/50 tracking-wider uppercase">
                Tableau de Bord
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#C89748] text-[#0B2520] shadow-md font-semibold'
                    : 'text-[#FAF7F2]/80 hover:bg-[#1A5449] hover:text-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#0B2520]' : 'text-[#DFB26E]'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-[#0B2520]" />}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Actions */}
        <div className="p-4 border-t border-[#C89748]/15 bg-[#0B2520]/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#1A5449] border border-[#C89748]/40 flex items-center justify-center text-xs font-bold text-[#DFB26E]">
              {adminUser?.name ? adminUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FAF7F2] truncate">{adminUser?.name || 'Administrateur'}</p>
              <p className="text-[11px] text-[#FAF7F2]/50 truncate">{adminUser?.email || 'admin@alhurra.ma'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#1A5449]/70 hover:bg-[#1A5449] text-[#FAF7F2] text-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#DFB26E]" />
              <span>Boutique</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-200 text-xs transition-colors cursor-pointer border border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
