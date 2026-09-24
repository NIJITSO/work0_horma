import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Cairo, Montserrat, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { Providers } from '../components/Providers';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zaynaatlas.com'),
  title: 'AL HURRA — Soins Marocains Précieux & Naturels | مستحضرات تجميل مغربية فاخرة',
  description: 'AL HURRA - La marque marocaine de cosmétiques naturels inspirés des trésors du Maroc. Huile d’argan, nila bleue, eau de rose, savons naturels.',
  keywords: 'Al Hurra, AL HURRA, soins marocains, cosmétiques naturels, argan bio, nila bleu, savon noir, argan oil, moroccan cosmetics',
  openGraph: {
    title: 'AL HURRA — La beauté marocaine, naturellement précieuse',
    description: 'Des soins authentiques inspirés des trésors du Maroc. Ingrédients naturels, efficacité prouvée, beauté révélée.',
    url: 'https://zaynaatlas.com',
    siteName: 'AL HURRA',
    images: [
      {
        url: '/images/homePage/hero.jpeg',
        width: 1600,
        height: 900,
        alt: 'AL HURRA',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedLang = cookieStore.get('alhurra_lang')?.value;
  const lang = (savedLang === 'ar' || savedLang === 'fr') ? savedLang : 'fr';
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${cairo.variable} ${montserrat.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFFCF7] text-[#2D3533] selection:bg-[#C89748] selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
