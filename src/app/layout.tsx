import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { defaultLocale } from '@/lib/i18n/config';

import './globals.css';

export const metadata: Metadata = {
  title: 'FBGM Robotics: Window Cleaners, Drones, Humanoids & Vacuum Robots',
  description: 'Discover cutting-edge robots at FBGM: window cleaning robots, drones, humanoid robots and smart vacuum robots.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
