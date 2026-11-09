import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  href?: string;
  className?: string;
}

export const LogoIcon: React.FC<{ sizeClass?: string; className?: string }> = ({ 
  sizeClass = 'w-10 h-10',
  className = '' 
}) => {
  return (
    <div className={`relative ${sizeClass} shrink-0 rounded-2xl bg-[#0b1026] p-1.5 border border-indigo-500/30 shadow-lg shadow-indigo-500/20 flex items-center justify-center overflow-hidden group ${className}`}>
      <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-transparent pointer-events-none" />
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(79,70,229,0.4)]"
      >
        <defs>
          <linearGradient id="jmSaffronComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFA84A" />
          </linearGradient>
          <linearGradient id="jmBlueComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="jmGreenComp" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>

        {/* Tech Grid Circle */}
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="3 3" />

        {/* Left Wing / 'J' - Citizen outreach (Saffron) */}
        <path
          d="M 28 36 C 28 27, 40 25, 48 33 L 42 41 C 38 37, 34 38, 34 43 L 34 56 C 34 64, 42 66, 48 61 L 52 68 C 42 75, 28 71, 28 58 Z"
          fill="url(#jmSaffronComp)"
        />

        {/* Right Wing / 'M' - Mitra support (Indigo to Blue) */}
        <path
          d="M 72 64 C 72 73, 60 75, 52 67 L 58 59 C 62 63, 66 62, 66 57 L 66 44 C 66 36, 58 34, 52 39 L 48 32 C 58 25, 72 29, 72 42 Z"
          fill="url(#jmBlueComp)"
        />

        {/* Central Bridge (Green) */}
        <path d="M 40 48 L 60 52" stroke="url(#jmGreenComp)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Central Neural Node */}
        <circle cx="50" cy="50" r="5.5" fill="#38BDF8" />
        <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />

        {/* Neural sparkle points */}
        <circle cx="34" cy="36" r="2.5" fill="#FFB74D" />
        <circle cx="66" cy="64" r="2.5" fill="#818CF8" />
        <circle cx="64" cy="34" r="2" fill="#34D399" />
        <circle cx="36" cy="66" r="2" fill="#38BDF8" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  subtitle = 'AI SMART GOVERNANCE',
  href,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-base', sub: 'text-[7px]' },
    md: { icon: 'w-10 h-10', text: 'text-lg sm:text-xl', sub: 'text-[8px] sm:text-[9px]' },
    lg: { icon: 'w-12 h-12', text: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px]' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl sm:text-4xl', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <LogoIcon sizeClass={currentSize.icon} />
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className={`font-black tracking-tight text-foreground uppercase block ${currentSize.text}`}>
              JANMITRA
            </span>
            <span className={`font-black tracking-wider bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-indigo-400 ${currentSize.text}`}>
              AI
            </span>
          </div>
          {subtitle && (
            <p className={`font-black text-muted-foreground uppercase tracking-widest mt-0.5 ${currentSize.sub}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};

export default Logo;
