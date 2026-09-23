export type TrekLite = {
  title: string;
  slug: string;
  duration?: number;
  difficulty?: string;
  price?: number;
  discountedPrice?: number;
};

export type RegionGroup = { name: string; slug: string; treks: { title: string; slug: string }[] };

export type Rep = {
  country: string;
  code: string; // lowercase ISO 3166-1 alpha-2, drives the flag
  name: string;
  whatsApp: string;
  hours?: string;
  isDefault?: boolean;
};

export type MenuItem = {
  title: string;
  kind: "link" | "treks" | "travel-info" | "company" | "top-treks" | "custom";
  href?: string;
  items?: { label: string; href: string }[];
};

export type NavData = {
  logoUrl: string | null;
  menu: MenuItem[];
  countries: { name: string; slug: string; count: number }[];
  regions: RegionGroup[];
  travelInfo: { title: string; items: { slug: string; title: string }[] }[];
  company: { label: string; href: string }[];
  topTreks: TrekLite[];
  reps: Rep[];
  promo: { text: string; linkLabel?: string; linkHref?: string } | null;
};
