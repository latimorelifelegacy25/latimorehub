import React from 'react';
import { BRAND, PAHS_URL, PUBLIC_NAV_ITEMS } from '../../lib/constants';
import { trackEvent } from '../../lib/tracking';
import CTAButton from './CTAButton';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activePath?: string;
}

const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, activePath }) => {
  if (!isOpen) return null;

  const currentPath = normalizePath(
    activePath ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#071A33] text-white lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
      <div className="flex min-h-screen flex-col px-5 pb-8 pt-5">
        <div className="flex items-start justify-between gap-4">
          <a href="/" className="flex items-center gap-3" onClick={onClose} aria-label="Latimore Life & Legacy home">
            <img
              src={BRAND.logoPath}
              alt="Latimore Life & Legacy logo"
              className="h-12 w-12 rounded-full object-contain"
            />
            <div>
              <p className="text-base font-black leading-tight">Latimore Life & Legacy</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#D6A641]">
                {BRAND.tagline}
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-2 rounded-full p-3 text-5xl font-light leading-none text-white transition-colors hover:text-[#D6A641] focus:outline-none focus:ring-4 focus:ring-[#D6A641]/30"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-3" aria-label="Mobile menu">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const href = item.href === '/pahs' ? PAHS_URL : item.href;
            const active = normalizePath(item.href) === currentPath;

            if (item.href === '/join') {
              return (
                <CTAButton
                  key={item.href}
                  href={href}
                  fullWidth
                  size="lg"
                  variant="gold"
                  eventName="mobile_nav_join_click"
                  className="mt-3 rounded-2xl py-4 text-center"
                  onClick={onClose}
                >
                  {item.label}
                </CTAButton>
              );
            }

            if (item.href === '/pahs') {
              return (
                <CTAButton
                  key={item.href}
                  href={href}
                  fullWidth
                  size="lg"
                  variant="outline"
                  eventName="mobile_nav_pahs_click"
                  className="rounded-2xl border-[#D6A641] bg-[#071A33] py-4 text-center text-[#D6A641] hover:bg-[#0D2A4A] hover:text-[#D6A641]"
                  onClick={onClose}
                >
                  {item.label}
                </CTAButton>
              );
            }

            return (
              <a
                key={item.href}
                href={href}
                onClick={() => {
                  trackEvent('mobile_nav_link_click', { label: item.label, href });
                  onClose();
                }}
                className={`rounded-2xl px-2 py-3 text-2xl font-black tracking-tight transition-colors focus:outline-none focus:ring-4 focus:ring-[#D6A641]/30 ${
                  active ? 'text-[#D6A641]' : 'text-white hover:text-[#D6A641]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-white/75">
          <p className="font-bold text-white">{BRAND.business}</p>
          <p>{BRAND.phoneDisplay} · {BRAND.email}</p>
          <p className="mt-2 text-[#D6A641]">{BRAND.hashtag}</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
