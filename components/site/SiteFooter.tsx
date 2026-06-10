import React from 'react';
import { BRAND, PUBLIC_NAV_ITEMS, PRIMARY_CTA } from '../../lib/constants';
import CTAButton from './CTAButton';

const SiteFooter: React.FC = () => {
  const year = new Date().getFullYear();
  const quickLinks = PUBLIC_NAV_ITEMS.filter((item) => item.href !== '/pahs');

  return (
    <footer className="bg-[#071A33] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <a href="/" className="flex items-center gap-3" aria-label="Latimore Life & Legacy home">
            <img
              src={BRAND.logoPath}
              alt="Latimore Life & Legacy logo"
              className="h-12 w-12 rounded-full object-contain"
            />
            <div>
              <p className="font-black">{BRAND.business}</p>
              <p className="text-sm text-[#D6A641]">{BRAND.tagline}</p>
            </div>
          </a>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
            Building Wealth. Preserving Futures. Creating Legacies. Serving families across {BRAND.counties.join(', ')}.
          </p>
          <p className="mt-4 text-sm font-bold text-[#D6A641]">{BRAND.hashtag}</p>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#D6A641]">Quick Links</h2>
          <nav className="mt-5 grid gap-3" aria-label="Footer navigation">
            {quickLinks.map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-white/75 transition-colors hover:text-[#D6A641]">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#D6A641]">Contact</h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-white/75">
            <p>{BRAND.phoneDisplay}</p>
            <p>{BRAND.email}</p>
            <p>{BRAND.address}</p>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#D6A641]">Get Started</h2>
          <p className="mt-5 text-sm leading-7 text-white/70">
            No pressure. No jargon. Start with education and build a plan around your life.
          </p>
          <CTAButton href={PRIMARY_CTA.href} eventName="footer_primary_cta_click" className="mt-6" fullWidth>
            {PRIMARY_CTA.label}
          </CTAButton>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs leading-6 text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {year} {BRAND.business}. All rights reserved.</p>
          <p>
            Licensed in Pennsylvania ({BRAND.license}, {BRAND.nipr}). For educational purposes only; not tax or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
