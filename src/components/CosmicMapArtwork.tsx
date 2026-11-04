import React from 'react';

export const CosmicMapArtwork: React.FC = () => (
  <svg
    viewBox="0 0 340 360"
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
    fill="none"
  >
    <defs>
      <linearGradient id="cosmic-map-hull" x1="170" y1="50" x2="170" y2="285" gradientUnits="userSpaceOnUse">
        <stop stopColor="#67E8F9" />
        <stop offset="1" stopColor="#818CF8" />
      </linearGradient>
    </defs>
    <circle cx="170" cy="176" r="118" stroke="#38BDF8" strokeDasharray="3 8" strokeWidth="1.5" />
    <circle cx="170" cy="176" r="90" stroke="#A78BFA" strokeWidth="1" />
    <path
      d="m170 55 27 66 40 33-24 13 13 78-56-26-56 26 13-78-24-13 40-33 27-66Z"
      fill="url(#cosmic-map-hull)"
      fillOpacity=".14"
      stroke="url(#cosmic-map-hull)"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <path d="m158 205 12 48 12-48m-53-37-23 42m88-42 23 42" stroke="#FDE68A" strokeLinecap="round" strokeWidth="4" />
    <circle cx="170" cy="145" r="12" fill="#67E8F9" fillOpacity=".28" stroke="#BAE6FD" strokeWidth="2" />
    <path d="m84 102 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1 4-9Zm174 116 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1 3-7Z" fill="#FDE68A" />
  </svg>
);
