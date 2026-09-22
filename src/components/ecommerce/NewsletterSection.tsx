'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, Check } from 'lucide-react';

export function NewsletterSection() {
  const { t, isRtl } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!isValidEmail(email)) {
      setErrorMessage(
        t('يرجى إدخال بريد إلكتروني صحيح.', 'Veuillez saisir une adresse e-mail valide.')
      );
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      // Simulate newsletter API registration
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubscribed(true);
      setEmail('');
    } catch {
      setErrorMessage(
        t('حدث خطأ. يرجى المحاولة مرة أخرى.', 'Une erreur est survenue. Veuillez réessayer.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#123D35] text-[#FFFCF7] py-14 sm:py-20 relative overflow-hidden">
      {/* Background Islamic Geometric Pattern Accent */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#C89748_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#C89748]/20 border border-[#C89748] mb-4 text-[#C89748]">
          <Sparkles className="w-5 h-5" />
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-bold tracking-wide mb-3">
          {isRtl ? (
            <>
              انضمي إلى عالم <span dir="ltr" className="inline-block">AL HURRA</span>
            </>
          ) : (
            <>
              Rejoignez l’univers <span className="inline-block">AL HURRA</span>
            </>
          )}
        </h2>

        <p className="text-xs sm:text-sm text-[#FFFCF7]/80 max-w-xl mx-auto font-light leading-relaxed mb-8">
          {t(
            'اكتشفي نصائحنا للعناية والجمال، وتعرّفي على أحدث منتجاتنا، واستفيدي من خصم 10٪ على طلبك الأول.',
            'Recevez nos conseils beauté, découvrez nos nouveautés et profitez de 10 % de réduction sur votre première commande.'
          )}
        </p>

        {isSubscribed ? (
          <div
            role="status"
            className="bg-[#1A5449] border border-[#C89748]/40 rounded-xl p-6 max-w-md mx-auto flex items-center justify-center gap-3 animate-in fade-in"
          >
            <Check className="w-6 h-6 text-[#C89748] shrink-0" />
            <span className="font-semibold text-sm leading-relaxed">
              {t(
                'مرحباً بكِ في عالم الحرة! تم تسجيل اشتراكك بنجاح.',
                'Bienvenue dans l’univers Al Hurra ! Votre inscription a bien été enregistrée.'
              )}
            </span>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  name="email"
                  id="newsletter-email"
                  autoComplete="email"
                  required
                  value={email}
                  disabled={isLoading}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={t('أدخلي بريدك الإلكتروني...', 'Votre adresse e-mail...')}
                  style={{
                    direction: email ? 'ltr' : (isRtl ? 'rtl' : 'ltr'),
                    textAlign: email ? 'left' : (isRtl ? 'right' : 'left'),
                  }}
                  className="w-full bg-[#FFFCF7] text-[#2D3533] px-4 py-3.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C89748] placeholder:text-[#64746E] disabled:opacity-75 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto shrink-0 bg-[#C89748] hover:bg-[#B88636] disabled:opacity-75 disabled:cursor-not-allowed text-[#FFFCF7] font-semibold text-xs uppercase tracking-widest px-7 py-3.5 rounded-lg transition-all shadow-md flex items-center justify-center min-w-[130px]"
              >
                {isLoading
                  ? t('جارٍ الاشتراك...', 'INSCRIPTION...')
                  : t('اشتركي', 'S’INSCRIRE')}
              </button>
            </form>

            {errorMessage && (
              <p className="text-red-300 text-xs mt-2.5 font-medium animate-in fade-in" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
