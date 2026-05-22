// Site settings stats type
export interface SiteStats {
  clients: string;
  years: string;
  treks: string;
  rating: string;
}

// Site settings contact info type
export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
}

// Site settings social links type
export interface SocialLinks {
  youtube?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

// Site settings affiliation type
export interface Affiliation {
  name: string;
  logo: string; // Cloudinary public ID or URL
  url: string;
}

// Site Settings Document
export interface SiteSettings {
  siteName: string;
  logo?: string; // Cloudinary public ID or URL
  heroVideoUrl?: string;
  heroHeadline: string;
  heroSubheadline?: string;
  stats?: SiteStats;
  contactInfo?: ContactInfo;
  emergencyNumbers?: string[];
  socialLinks?: SocialLinks;
  affiliations?: Affiliation[];
}

// Region Document
export interface Region {
  id: string | number;
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string; // Cloudinary public ID or URL
  mapCenter?: {
    lat: number;
    lng: number;
  };
  trekCount?: number;
  treks?: Trek[];
}

// Itinerary Day inside Trek
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
  distance?: string;
  altitude?: number;
}

// GPS Waypoint inside Trek
export interface GPSWaypoint {
  lat: number;
  lng: number;
  label: string;
  altitude?: number;
}

// Trek Document
export interface Trek {
  id: string | number;
  _id?: string;
  title: string;
  slug: string;
  region: Region;

  duration: number;
  price: number;
  discountedPrice?: number;
  difficulty: "easy" | "moderate" | "hard" | "extreme";
  maxAltitude: number;
  groupSize?: number;
  startPoint?: string;
  endPoint?: string;
  highlights?: string[];
  overview?: any[]; // Portable text blocks
  dayByDayItinerary?: ItineraryDay[];
  inclusions?: string[];
  exclusions?: string[];
  heroImage?: string; // Cloudinary public ID or URL
  gallery?: string[]; // Cloudinary public IDs or URLs
  gpsCoordinates?: GPSWaypoint[];
  isBestSeller?: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

// Team Member Document
export interface TeamMember {
  id: string | number;
  _id?: string;
  name: string;
  role: string;
  photo?: string; // Cloudinary public ID or URL
  bio?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

// Testimonial Document
export interface Testimonial {
  id: string | number;
  _id?: string;
  clientName: string;
  country: string;
  rating: number;
  reviewText: string;
  date?: string;
  photo?: string; // Cloudinary public ID or URL
  trek?: {
    title: string;
    slug: string;
  };
}

// FAQ Document
export interface Faq {
  id: string | number;
  _id?: string;
  question: string;
  answer: any[]; // Portable text blocks
  category?: string;
  order?: number;
}

// Blog Post Document
export interface BlogPost {
  id: string | number;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  author: {
    name: string;
    photo?: string; // Cloudinary public ID or URL
    bio?: string;
  };
  publishedAt: string;
  readTime?: string;
  coverImage?: string; // Cloudinary public ID or URL
  excerpt: string;
  body?: any[]; // Portable text blocks
  relatedTreks?: Array<{
    title: string;
    slug: string;
    price: number;
    discountedPrice?: number;
    duration: number;
    heroImage?: string; // Cloudinary public ID or URL
  }>;
}
