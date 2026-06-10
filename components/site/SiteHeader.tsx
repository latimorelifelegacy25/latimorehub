import React, { useState } from 'react';
import { BRAND, DESKTOP_NAV_ITEMS, PRIMARY_CTA } from '../../lib/constants';
import { trackEvent } from '../../lib/tracking';
import CTAButton from './CTAButton';
import MobileMenu from './MobileMenu';

export interface SiteHeaderProps {
  activePath?: string;
}

const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';

const SiteHeader: React.FC<SiteHeaderProps> = ({ activePath }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = normalizePath(
    activePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Latimore Life & Legacy home">
            <img
              src={BRAND.logoPath}
              alt="Latimore Life & Legacy logo"
              className="h-11 w-11 rounded-full object-contain"
            />
            <div className="leading-tight">
              <p className="text-sm font-black text-[#071A33] sm:text-base">Latimore Life & Legacy</p>
              <p className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#D6A641] sm:block">
                {BRAND.tagline}
              </p>
            </div>
          </a>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const itemPath = item.href.startsWith('http') ? '/pahs' : item.href;
              const active = normalizePath(itemPath) === currentPath;
              return (
                <a
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => trackEvent('desktop_nav_link_click', { label: item.label, href: item.href })}
                  className={`text-xs font-black uppercase tracking-[0.16em] transition-colors ${
                    active ? 'text-[#D6A641]' : 'text-[#071A33] hover:text-[#D6A641]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <CTAButton href={PRIMARY_CTA.href} size="sm" eventName="header_primary_cta_click">
              {PRIMARY_CTA.label}
            </CTAButton>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-[#071A33] shadow-sm lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <span className="block h-0.5 w-6 bg-[#071A33]" />
            <span className="mt-1.5 block h-0.5 w-6 bg-[#071A33]" />
            <span className="mt-1.5 block h-0.5 w-6 bg-[#071A33]" />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} activePath={currentPath} />
    </>
  );
};

export default SiteHeader;
