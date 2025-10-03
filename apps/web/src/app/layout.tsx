import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../index.css';
import { Analytics } from '@vercel/analytics/react';
import Header from '@/components/header';
import Providers from '@/components/providers';
import {
  DatasetStructuredData,
  LincolnInstituteStructuredData,
  WebsiteStructuredData,
} from '@/components/structured-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default:
      'The Lincoln Institute Directory - Historical Student Records 1866-1922',
    template: '%s | The Lincoln Institute Directory',
  },
  description:
    'Explore historical student records from The Lincoln Institute, a Philadelphia charity that operated from 1866-1922. Search through Civil War orphan records and student directories from this important educational institution.',
  keywords: [
    'Lincoln Institute',
    'Philadelphia history',
    'Civil War orphans',
    'historical records',
    'student directory',
    '1866-1922',
    'Mary McHenry Cox',
    'educational history',
    'Pennsylvania history',
  ],
  authors: [{ name: 'Heidi Sproat and Mike Bertram' }],
  creator: 'Heidi Sproat and Mike Bertram',
  publisher: 'The Lincoln Institute Directory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lincoln-institute-directory.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title:
      'The Lincoln Institute Directory - Historical Student Records 1866-1922',
    description:
      'Explore historical student records from The Lincoln Institute, a Philadelphia charity that operated from 1866-1922.',
    url: 'https://lincoln-institute-directory.vercel.app', // Update with your actual domain
    siteName: 'The Lincoln Institute Directory',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this
        width: 1200,
        height: 630,
        alt: 'The Lincoln Institute Directory - Historical Student Records',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'The Lincoln Institute Directory - Historical Student Records 1866-1922',
    description:
      'Explore historical student records from The Lincoln Institute, a Philadelphia charity that operated from 1866-1922.',
    images: ['/og-image.jpg'], // You'll need to create this
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2 focus:shadow"
          href="#main-content"
        >
          Skip to main content
        </a>
        <Providers>
          <div className="grid h-svh grid-rows-[auto_1fr]">
            <Header />
            {children}
          </div>
        </Providers>
        <Analytics />
        <LincolnInstituteStructuredData />
        <WebsiteStructuredData />
        <DatasetStructuredData />
      </body>
    </html>
  );
}
