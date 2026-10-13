'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
}

interface PortalLayoutClientProps {
  navItems: NavItem[];
  portalLabel: string;
  loginPath: string;
  homeLink?: { href: string; label: string };
}

const BrandLogo = ({ portalLabel }: { portalLabel: string }) => (
  <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'rgba(176,96,64,0.12)' }}>
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#b06040' }}>
      <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
        <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
        <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
        <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
        <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
      </svg>
    </div>
    <div>
      <p className="text-sm font-extrabold leading-none" style={{ color: '#1a0c05' }}>Apna Bhatta</p>
      <p className="text-[10px] mt-1 font-bold uppercase tracking-widest" style={{ color: '#b06040' }}>{portalLabel}</p>
    </div>
  </div>
);

export default function PortalLayoutClient({ navItems, portalLabel, loginPath, homeLink }: PortalLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(loginPath);
  };

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <>
      {/* ════ DESKTOP SIDEBAR ════ */}
      <aside
        className="hidden lg:flex lg:w-64 flex-col fixed inset-y-0 left-0 z-30"
        style={{ background: '#fdfaf8', borderRight: '1px solid rgba(176,96,64,0.1)' }}
      >
        <BrandLogo portalLabel={portalLabel} />

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                style={active
                  ? { background: '#b06040', color: '#fff', boxShadow: '0 4px 12px rgba(176,96,64,0.2)' }
                  : { color: '#564b42' }
                }
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#f1ece7'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-5 pt-3 space-y-2 border-t" style={{ borderColor: 'rgba(176,96,64,0.1)' }}>
          {homeLink && (
            <Link href={homeLink.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition hover:bg-[#f1ece7]"
              style={{ color: '#564b42' }}>
              🏠 {homeLink.label}
            </Link>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition"
            style={{ color: '#c0392b', background: '#fdf0ee' }}
          >
            <span>🚪</span> {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* ════ MOBILE BOTTOM NAV ════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{
          background: '#fdfaf8',
          borderTop: '1px solid rgba(176,96,64,0.15)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        {navItems.map(item => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all"
              style={{ color: active ? '#b06040' : '#a89888' }}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-bold leading-tight">{item.label}</span>
              {active && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ background: '#b06040' }} />
              )}
            </Link>
          );
        })}
        {/* Logout in mobile bottom nav */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all"
          style={{ color: '#c0392b' }}
        >
          <span className="text-xl leading-none">🚪</span>
          <span className="text-[10px] font-bold leading-tight">{loggingOut ? '...' : 'Logout'}</span>
        </button>
      </nav>
    </>
  );
}
