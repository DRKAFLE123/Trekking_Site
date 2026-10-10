// Duotone line icons for the B2B partner page: 24px grid, 2px round strokes,
// soft tinted fill for the secondary shape. Colour comes from `currentColor`
// (stroke) and the --icon-tint CSS variable (fill), so one set serves any surface.
import React from "react";

type P = { className?: string; title?: string };

const Svg = ({ className = "h-7 w-7", title, children }: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
  >
    {children}
  </svg>
);
const T = { fill: "var(--icon-tint, rgba(46,125,50,.16))", stroke: "none" } as const;

export const IconOperator = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" style={T} />
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18M11 13v2h2v-2" />
  </Svg>
);
export const IconAgency = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" style={T} />
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </Svg>
);
export const IconDmc = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" style={T} />
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Svg>
);
export const IconPlatform = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" style={T} />
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4M7 9l2 2-2 2M12 13h4" />
  </Svg>
);
export const IconClub = (p: P) => (
  <Svg {...p}>
    <path d="M3 20 9.5 8l3.5 6 2-3 6 9Z" style={T} />
    <path d="M3 20 9.5 8l3.5 6 2-3 6 9ZM9.5 8l1.5-3 1.5 3" />
    <path d="M17 4v5M17 4h3l-1 1.2L20 6.5h-3" />
  </Svg>
);
export const IconGroup = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.5" style={T} />
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.3A6.5 6.5 0 0 1 21.5 20" />
  </Svg>
);
export const IconTag = (p: P) => (
  <Svg {...p}>
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z" style={T} />
    <path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9Z" />
    <circle cx="7.5" cy="7.5" r="1.5" />
    <path d="M10 15.5 15.5 10" />
  </Svg>
);
export const IconWhiteLabel = (p: P) => (
  <Svg {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" style={T} />
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h5M8 16h3" />
    <path d="m14.5 15.5 1.5 1.5 3-3" />
  </Svg>
);
export const IconCalendar = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" style={T} />
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4M8 14h2M14 14h2M8 17.5h2" />
  </Svg>
);
export const IconShield = (p: P) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6Z" style={T} />
    <path d="M12 3 5 6v5.5c0 4.4 3 8.2 7 9.5 4-1.3 7-5.1 7-9.5V6Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);
export const IconPermit = (p: P) => (
  <Svg {...p}>
    <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" style={T} />
    <path d="M6 3h9l4 4v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM15 3v4h4" />
    <circle cx="12" cy="13.5" r="2.5" />
    <path d="m10.5 15.5-1 3.5 2.5-1 2.5 1-1-3.5" />
  </Svg>
);
export const IconSupport = (p: P) => (
  <Svg {...p}>
    <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
    <rect x="3" y="13" width="4" height="6" rx="1.5" style={T} />
    <rect x="17" y="13" width="4" height="6" rx="1.5" style={T} />
    <rect x="3" y="13" width="4" height="6" rx="1.5" />
    <rect x="17" y="13" width="4" height="6" rx="1.5" />
    <path d="M19 19a3 3 0 0 1-3 3h-2" />
  </Svg>
);
export const IconMedia = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" style={T} />
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="9.5" r="1.8" />
    <path d="m21 16-5-5-8 9" />
  </Svg>
);
export const IconBolt = (p: P) => (
  <Svg {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7Z" style={T} />
    <path d="M13 2 4 14h7l-1 8 9-12h-7Z" />
  </Svg>
);
export const IconSend = (p: P) => (
  <Svg {...p}>
    <path d="M21 3 3 10.5l7 2.5 2.5 7Z" style={T} />
    <path d="M21 3 3 10.5l7 2.5 2.5 7ZM10 13l11-10" />
  </Svg>
);
export const IconDocs = (p: P) => (
  <Svg {...p}>
    <rect x="7" y="3" width="13" height="16" rx="2" style={T} />
    <path d="M17 19v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h2" />
    <rect x="7" y="3" width="13" height="16" rx="2" />
    <path d="M10.5 8h6M10.5 11.5h6M10.5 15h3.5" />
  </Svg>
);
export const IconHandshake = (p: P) => (
  <Svg {...p}>
    <path d="M2 11l4-4 4 2 3-2 4 1 5 3-6 6-3-1-2 2-3-2Z" style={T} />
    <path d="m11 17 2 2 2-2M8.5 14.5l2.5 2.5M2 11l4-4 4 2M22 10l-5-3-4-1-3 3 2.5 2.5L15 9l4 4" />
    <path d="M6 7 2 11l7 6" />
  </Svg>
);
export const IconMountain = (p: P) => (
  <Svg {...p}>
    <path d="m2 20 7-12 4 6 2-3 7 9Z" style={T} />
    <path d="m2 20 7-12 4 6 2-3 7 9ZM7.2 11.2 9 10l1.6 1.5" />
  </Svg>
);
export const IconCheck = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" style={T} />
    <path d="m8 12 3 3 5-6" />
  </Svg>
);
export const IconWallet = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="6" width="18" height="14" rx="2" style={T} />
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <path d="M3 10h18M16 15h2M6 6l9-3 1 3" />
  </Svg>
);
export const IconBuilding = (p: P) => (
  <Svg {...p}>
    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" style={T} />
    <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16M15 10h4a1 1 0 0 1 1 1v10M2 21h20M8 8h3M8 12h3M8 16h3" />
  </Svg>
);
