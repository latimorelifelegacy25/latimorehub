import React from 'react';
import { BRAND } from '../../lib/constants';

export interface TrustBadgesProps {
  className?: string;
}

const badges = [
  BRAND.license,
  BRAND.nipr,
  'Independent Insurance Advisor',
  `${BRAND.counties.length} Central PA Counties Served`,
];

const TrustBadges: React.FC<TrustBadgesProps> = ({ className = '' }) => {
  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`} aria-label="Trust badges">
      {badges.map((badge) => (
        <li
          key={badge}
          className="rounded-full border border-[#D6A641]/30 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#071A33] shadow-sm"
        >
          {badge}
        </li>
      ))}
    </ul>
  );
};

export default TrustBadges;
