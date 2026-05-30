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
  mapCoordinates?: string;
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
  heroImage?: string | any;
  heroHeadline: string;
  heroSubheadline?: string;
  stats?: SiteStats;
  contactInfo?: ContactInfo;
  emergencyNumbers?: string[];
  socialLinks?: SocialLinks;
  affiliations?: Affiliation[];
  blogsPageSettings?: {
    coverImage?: any;
    title?: string;
    subtitle?: string;
  };
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

export interface ItineraryDayMedia {
  id?: string;
  type: 'image' | 'video';
  image?: any; // Payload Media Upload reference or Cloudinary ID
  youtubeUrl?: string; // YouTube video link or ID
  title?: string; // Optional caption
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
  // New premium fields
  location?: string;
  trekDuration?: string;
  flightHours?: string;
  media?: ItineraryDayMedia[];
}

// Trip Info Section (named topic card)
export interface TripInfoSection {
  id?: string;
  title: string;
  icon?: string;
  content: any; // Lexical rich text
  image?: any;  // Optional upload image / chart
}

// Packing List Category
export interface PackingCategory {
  id?: string;
  category: string;
  items: Array<{ id?: string; item: string }>;
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

  // Basic specs
  duration: number;
  price: number;
  discountedPrice?: number;
  difficulty: "easy" | "moderate" | "hard" | "extreme";
  maxAltitude: number;
  groupSize?: number;
  startPoint?: string;
  endPoint?: string;
  bestSeason?: string;
  accommodationType?: string;
  mealsIncluded?: string;
  isBestSeller?: boolean;

  // Content
  overview?: any; // Lexical rich text
  highlights?: Array<{ id?: string; highlight: string } | string>;
  dayByDayItinerary?: ItineraryDay[];
  inclusions?: Array<{ id?: string; inclusion: string } | string>;
  exclusions?: Array<{ id?: string; exclusion: string } | string>;

  // Flight & briefing info (CMS plain text)
  flightInfoTitle?: string;
  flightInfo?: any;
  briefingInfoTitle?: string;
  briefingInfo?: any;

  // Trip Info sections (named topic cards)
  tripInfoSections?: TripInfoSection[];

  // Packing list (per-trek)
  packingList?: PackingCategory[];

  // Media
  heroImage?: any; // Payload media or Cloudinary
  mapImage?: any; // Payload media relationship
  youtubeVideoId?: string;
  gallery?: Array<{ id?: string; image: any } | string>;

  // GPS & map
  gpsCoordinates?: GPSWaypoint[];

  // Pricing
  groupDiscounts?: GroupDiscount[];

  // FAQs (trek-specific)
  faqs?: Array<{
    id?: string;
    question: string;
    category?: string;
    answer: any;
  }>;

  // SEO
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
  treks?: any[]; // Array of Trek objects or IDs
  order?: number;
}

// Blog Post Document
export interface BlogPost {
  id: string | number;
  _id?: string;
  title: string;
  slug: string;
  category: string;
  isFeatured?: boolean;
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

// Group Discount Tier inside Trek
export interface GroupDiscount {
  id?: string;
  minPersons: number;
  maxPersons: number;
  pricePerPerson: number;
}

// Departure Document
export interface Departure {
  id: string | number;
  _id?: string;
  trek: string | Trek;
  startDate: string;
  endDate: string;
  availableSeats: number;
  bookedSeats: number;
  status: "available" | "limited" | "sold_out" | "cancelled";
  priceOverride?: number;
  isGuaranteed?: boolean;
}

// Traveler Detail inside Booking
export interface Traveler {
  firstName: string;
  lastName: string;
  email?: string;
  nationality: string;
  gender: "male" | "female" | "other";
  dob: string;
  passportNumber?: string;
  passportExpiry?: string;
}

// Booking Document
export interface Booking {
  id: string | number;
  _id?: string;
  bookingId: string;
  trek: string | Trek;
  departure?: string | Departure;
  startDate: string;
  endDate: string;
  travelersCount: number;
  travelers: Traveler[];
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
  };
  basePrice: number;
  discount?: number;
  tax?: number;
  totalPrice: number;
  paymentType: "full" | "advance_10";
  paymentStatus: "unpaid" | "partial" | "paid" | "refunded";
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed";
  adminRemarks?: string;
}

// Inquiry Document
export interface Inquiry {
  id: string | number;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  trek: string | Trek;
  startDate?: string;
  travelers?: number;
  message: string;
  status: "new" | "contacted" | "resolved" | "closed";
}

// Payment Document
export interface Payment {
  id: string | number;
  _id?: string;
  booking: string | Booking;
  paymentId: string;
  amount: number;
  method: "stripe" | "paypal" | "esewa" | "khalti" | "bank_transfer";
  status: "pending" | "success" | "failed" | "refunded";
  transactionDetails?: string;
}
