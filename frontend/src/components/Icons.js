import React from 'react';

const iconConfig = {
  size: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  },
};

export const DashboardIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export const VehicleIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 11L7.5 7H16.5L19 11M5 11V17H19V11M5 11H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const BookingIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      <circle cx="8" cy="16" r="1.5" fill="currentColor" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
};

export const MaintenanceIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const RouteIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M6 9C6 12.5 8 15 12 16C16 17 18 15.5 18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
    </svg>
  );
};

export const UserIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const SettingsIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const LogoutIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AlertIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

export const ChartIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 16l4-8 4 4 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const LocationIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export const FilterIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SearchIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const CheckIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CloseIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const BatteryIcon = ({ size = 'md', className = '', level = 100 }) => {
  const s = iconConfig.size[size];
  const fillWidth = Math.max(2, (level / 100) * 14);
  
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M20 11h2v2h-2z" fill="currentColor" />
      <rect x="4" y="9" width={fillWidth} height="6" rx="1" fill="currentColor" />
    </svg>
  );
};

export const SpeedIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
};

export const DownloadIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const CalendarIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 10h18M8 2v4m8-4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const TrendingUpIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const RevenueIcon = ({ size = 'md', className = '' }) => {
  const s = iconConfig.size[size];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 6v12m4-10c0 1.5-1.79 2-4 2s-4 .5-4 2 1.79 2 4 2 4 .5 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
