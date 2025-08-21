'use client';
import Link from 'next/link';

import { ModeToggle } from './mode-toggle';

export default function Header() {
  const links = [
    { to: '/', label: 'Lincoln Institute Directory' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-8/10 flex-row items-center justify-between px-2 py-1">
        <div className="flex items-center gap-4">
          <nav aria-label="Main navigation" className="flex gap-6 text-lg">
            {links.map(({ to, label }) => {
              return (
                <Link
                  className="font-semibold hover:underline"
                  href={to}
                  key={to}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
