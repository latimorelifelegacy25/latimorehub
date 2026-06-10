export const BRAND = {
  business: 'Latimore Life & Legacy LLC',
  founder: 'Jackson M. Latimore Sr.',
  tagline: 'Protecting Today. Securing Tomorrow.',
  hashtag: '#TheBeatGoesOn',
  phone: '717-615-2613',
  phoneDisplay: '(717) 615-2613',
  email: 'jackson1989@latimorelegacy.com',
  website: 'https://www.latimorelifelegacy.com',
  counties: ['Schuylkill County', 'Luzerne County', 'Northumberland County'] as const,
  // Uses the live public site's hosted brand mark instead of generated placeholder text.
  logoPath: 'https://www.latimorelifelegacy.com/logo.png',
  license: 'PA DOI License #1268820',
  nipr: 'NIPR #21638507',
  address: '1544 Route 61 Hwy S, Ste 6104, Pottsville, PA 17901',
} as const;

export const PAHS_URL =
  'https://www.latimorelifelegacy.com/pahs?utm_source=PAHSsign&utm_medium=organic&utm_campaign=allsponsor';

export const BRAND_COLORS = {
  navy: '#071A33',
  navyLight: '#0D2A4A',
  gold: '#D6A641',
  cream: '#F8F3E8',
  white: '#FFFFFF',
  slate: '#334155',
} as const;

export const PUBLIC_NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Education', href: '/education' },
  { label: 'Blog', href: '/blog' },
  { label: 'Join Our Team', href: '/join' },
  { label: 'Contact', href: '/contact' },
  { label: 'PAHS Football 2026', href: '/pahs' },
] as const;

export const DESKTOP_NAV_ITEMS = PUBLIC_NAV_ITEMS.map((item) =>
  item.href === '/pahs' ? { ...item, href: PAHS_URL } : item,
);

export const PRIMARY_CTA = {
  label: 'Book Consultation',
  href: 'https://latimorelifelegacy.fillout.com',
} as const;
