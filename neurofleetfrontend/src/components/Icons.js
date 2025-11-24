// import React from 'react';

// const iconConfig = {
//   size: {
//     sm: 16,
//     md: 24,
//     lg: 32,
//     xl: 48,
//   },
// };

// export const DashboardIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
//       <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
//       <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
//       <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   );
// };

// export const VehicleIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M5 11L7.5 7H16.5L19 11M5 11V17H19V11M5 11H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <circle cx="8" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
//       <circle cx="16" cy="17" r="2" stroke="currentColor" strokeWidth="2" />
//       <path d="M8 7V5C8 4.44772 8.44772 4 9 4H15C15.5523 4 16 4.44772 16 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const BookingIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
//       <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <path d="M8 2V6M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <circle cx="12" cy="16" r="1.5" fill="currentColor" />
//       <circle cx="8" cy="16" r="1.5" fill="currentColor" />
//       <circle cx="16" cy="16" r="1.5" fill="currentColor" />
//     </svg>
//   );
// };

// export const MaintenanceIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const RouteIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="2" />
//       <circle cx="18" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
//       <path d="M6 9C6 12.5 8 15 12 16C16 17 18 15.5 18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
//     </svg>
//   );
// };

// export const UserIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
//       <path d="M6 21C6 17.686 8.686 15 12 15C15.314 15 18 17.686 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const SettingsIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
//       <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const LogoutIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const AlertIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" strokeWidth="1" />
//     </svg>
//   );
// };

// export const ChartIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <path d="M7 16l4-8 4 4 4-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const LocationIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
//     </svg>
//   );
// };

// export const FilterIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const SearchIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
//       <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const CheckIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const CloseIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const BatteryIcon = ({ size = 'md', className = '', level = 100 }) => {
//   const s = iconConfig.size[size];
//   const fillWidth = Math.max(2, (level / 100) * 14);

//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <rect x="2" y="7" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
//       <path d="M20 11h2v2h-2z" fill="currentColor" />
//       <rect x="4" y="9" width={fillWidth} height="6" rx="1" fill="currentColor" />
//     </svg>
//   );
// };

// export const SpeedIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//       <circle cx="12" cy="12" r="3" fill="currentColor" />
//     </svg>
//   );
// };

// export const DownloadIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const CalendarIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
//       <path d="M3 10h18M8 2v4m8-4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

// export const TrendingUpIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//       <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// };

// export const RevenueIcon = ({ size = 'md', className = '' }) => {
//   const s = iconConfig.size[size];
//   return (
//     <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className={className}>
//       <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
//       <path d="M12 6v12m4-10c0 1.5-1.79 2-4 2s-4 .5-4 2 1.79 2 4 2 4 .5 4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//     </svg>
//   );
// };

import React from 'react';

const getSize = (size) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  return sizes[size] || sizes.md;
};

export const VehicleIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8M8 11h8m-8 4h8M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
);

export const BookingIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

export const RouteIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

export const MaintenanceIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const LocationIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const CalendarIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const LogoutIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const FilterIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

export const DownloadIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const ChartIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export const TrendingUpIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export const RevenueIcon = ({ size = 'md', className = '' }) => (
  <svg className={`${getSize(size)} ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
export const UserIcon = ({ size = 'md', className = '' }) => (
  <svg
    className={`${getSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

export const DashboardIcon = ({ size = 'md', className = '' }) => (
  <svg
    className={`${getSize(size)} ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z"
    />
  </svg>
);
