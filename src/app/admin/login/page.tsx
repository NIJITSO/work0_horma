'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@alhurra.ma');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Identifiants invalides');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2520] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1A5449] rounded-full blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C89748] rounded-full blur-[160px] opacity-20 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#123D35]/90 border border-[#C89748]/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10 text-[#F8F4EC]">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C89748]/20 border border-[#C89748]/40 mb-4 text-[#C89748]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif tracking-widest text-[#DFB26E] uppercase mb-1">
            AL HURRA
          </h1>
          <p className="text-xs text-[#FAF7F2]/60 uppercase tracking-wider">
            Portail d&apos;Administration Sécurisé
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-[#FAF7F2]/80 uppercase tracking-wider mb-2">
              Adresse E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C89748]/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alhurra.ma"
                className="w-full bg-[#0B2520]/80 border border-[#C89748]/20 rounded-xl pl-10 pr-4 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#C89748] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-[#FAF7F2]/80 uppercase tracking-wider">
                Mot de Passe
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C89748]/70" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B2520]/80 border border-[#C89748]/20 rounded-xl pl-10 pr-11 py-3 text-sm text-[#FAF7F2] placeholder-[#FAF7F2]/30 focus:outline-none focus:border-[#C89748] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#FAF7F2]/40 hover:text-[#C89748] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C89748] to-[#DFB26E] text-[#0B2520] font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C89748]/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0B2520] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#C89748]/15 text-center text-xs text-[#FAF7F2]/50 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C89748]" />
          <span>Accès réservé au personnel autorisé AL HURRA</span>
        </div>
      </div>
    </div>
  );
}
