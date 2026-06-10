import React from 'react';
import { trackEvent } from '../../lib/tracking';
import type { FunnelKey } from '../../lib/interest-map';

export interface FunnelCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  eventName: string;
  funnel: FunnelKey | string;
  className?: string;
}

const FunnelCard: React.FC<FunnelCardProps> = ({
  title,
  description,
  cta,
  href,
  eventName,
  funnel,
  className = '',
}) => {
  return (
    <a
      href={href}
      onClick={() => trackEvent(eventName, { funnel, title, href })}
      className={`group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D6A641] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#D6A641]/30 ${className}`}
    >
      <div className="mb-5 inline-flex w-fit rounded-full bg-[#F8F3E8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#071A33]">
        {funnel}
      </div>
      <h3 className="text-xl font-black text-[#071A33] transition-colors group-hover:text-[#0D2A4A]">
        {title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#D6A641]">
        {cta}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </a>
  );
};

export default FunnelCard;
