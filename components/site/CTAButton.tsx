import React from 'react';
import { trackEvent, type TrackingPayload } from '../../lib/tracking';

type CTAButtonVariant = 'gold' | 'navy' | 'outline' | 'ghost';
type CTAButtonSize = 'sm' | 'md' | 'lg';

export interface CTAButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  variant?: CTAButtonVariant;
  size?: CTAButtonSize;
  fullWidth?: boolean;
  eventName?: string;
  eventPayload?: TrackingPayload;
}

const variantClasses: Record<CTAButtonVariant, string> = {
  gold: 'bg-[#D6A641] text-[#071A33] border-[#D6A641] hover:bg-[#c79732]',
  navy: 'bg-[#071A33] text-white border-[#071A33] hover:bg-[#0D2A4A]',
  outline: 'bg-transparent text-[#D6A641] border-[#D6A641] hover:bg-[#D6A641] hover:text-[#071A33]',
  ghost: 'bg-white/10 text-white border-white/20 hover:bg-white/20',
};

const sizeClasses: Record<CTAButtonSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-7 py-4 text-base',
};

const CTAButton: React.FC<CTAButtonProps> = ({
  href,
  children,
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  eventName,
  eventPayload,
  className = '',
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      className={[
        'inline-flex items-center justify-center rounded-full border-2 font-black uppercase tracking-[0.18em] shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#D6A641]/30',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      onClick={(event) => {
        if (eventName) {
          trackEvent(eventName, { href, label: typeof children === 'string' ? children : undefined, ...eventPayload });
        }
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </a>
  );
};

export default CTAButton;
