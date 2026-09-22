import type { Metadata } from 'next';
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
  title: 'AL HURRA — مستحضرات تجميل مغربية فاخرة وطبيعية | Soins Marocains Précieux',
  description: 'AL HURRA - العلامة المغربية لمستحضرات التجميل الطبيعية المستوحاة من كنوز المغرب. زيت الأركان، النيلة الزرقاء، ماء الورد، الصابون الطبيعي.',
  keywords: 'Al Hurra, AL HURRA, مستحضرات تجميل مغربية, زيت أركان, نيلة زرقاء, حمام مغربي, كوزميتيك طبيعي, argan oil, moroccan cosmetics, bio maroc',
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
    locale: 'ar_MA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
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
