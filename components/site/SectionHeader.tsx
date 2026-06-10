import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) => {
  const isCentered = align === 'center';

  return (
    <div className={`${isCentered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-[#D6A641]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-black tracking-tight text-[#071A33] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
