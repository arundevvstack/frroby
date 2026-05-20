'use client';

import { usePathname } from 'next/navigation';

export default function SiteShell({ children, navbar, footer }: { children: React.ReactNode, navbar?: React.ReactNode, footer?: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && (
        <a href="#main-content" className="skip-link">
          Skip to Content
        </a>
      )}
      {!isAdmin && navbar}
      {children}
      {!isAdmin && footer}
    </>
  );
}
