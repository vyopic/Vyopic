import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <img
      src="/assets/aistudio/smart-photo-maker-logo_223ab006.svg"
      alt="Smart Photo Maker Logo"
      style={size ? { width: size, height: size } : undefined}
      className={`object-contain ${className}`}
    />
  );
};

export const LogoIconSVG: React.FC<{ className?: string; fill?: string }> = ({
  className = 'w-8 h-8',
  fill = 'currentColor'
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
    >
      <rect x="8" y="8" width="40" height="40" fill={fill} rx="2" />
      <path d="M52 48 L52 8 A40 40 0 0 1 92 48 Z" fill={fill} />
      <path d="M48 52 L8 52 A40 40 0 0 0 48 92 Z" fill={fill} />
      <circle cx="72" cy="72" r="10" fill={fill} />
    </svg>
  );
};
