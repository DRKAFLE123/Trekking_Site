"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FaCheck,
  FaArrowLeft,
  FaArrowRight,
  FaShieldAlt,
  FaCalendarAlt,
  FaUsers,
  FaLock,
  FaPrint,
  FaCheckCircle,
  FaPlus,
  FaMinus,
  FaInfoCircle,
  FaExclamationCircle
} from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

interface GroupDiscount {
  minPersons: number;
  maxPersons: number;
  pricePerPerson: number;
}

interface TrekSummary {
  id: string | number;
  title: string;
  slug: string;
  duration: number;
  price: number;
  discountedPrice?: number;
  groupDiscounts: GroupDiscount[];
}

interface BookingStepperProps {
  trek: TrekSummary;
}

const ADDONS_LIST = [
  { id: "single_supplement", title: "Single Room Supplement", description: "Private rooms in Kathmandu hotels and mountain teahouses", price: 250 },
  { id: "heli_upgrade", title: "Helicopter Return Upgrade", description: "Scenic chopper return flight directly to Lukla/Kathmandu", price: 450 },
  { id: "extra_hotel", title: "Extra Kathmandu Hotel Night", description: "Additional night pre/post trek in 3-star boutique hotel", price: 80 }
];

const COUNTRIES_LIST = [
  "United States", "United Kingdom", "Canada", "Australia", "New Zealand", 
  "Germany", "France", "Netherlands", "Switzerland", "Singapore", 
  "Japan", "India", "Nepal", "Spain", "Italy", "Norway", 
  "Sweden", "Denmark", "Finland", "Austria", "Belgium", "Malaysia",
  "South Africa", "Brazil", "Mexico", "South Korea", "Hong Kong"
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatDateFriendly = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const datePart = dateStr.split("T")[0];
    const [y, m, d] = datePart.split("-").map(Number);
    const dateObj = (y && m && d) ? new Date(y, m - 1, d) : new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  } catch (e) {
    return dateStr;
  }
};

export default function BookingStepper({ trek }: BookingStepperProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters parsing
  const initialGuests = Number(searchParams.get("guests")) || 2;
  const initialStartDate = searchParams.get("startDate") || "";
  const initialEndDate = searchParams.get("endDate") || "";
  const initialDepartureId = searchParams.get("departure") || "";

  // ----------------------------------------------------
  // STATES
  // ----------------------------------------------------
  const [currentStep, setCurrentStep] = useState(1);
  const [guestsCount, setGuestsCount] = useState(initialGuests);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedAddons, setSelectedAddons] = useState<Record<string, boolean>>({});

  // Departures Fetching States
  const [departures, setDepartures] = useState<any[]>([]);
  const [loadingDepartures, setLoadingDepartures] = useState(true);
  const [selectedDeparture, setSelectedDeparture] = useState<any | null>(null);
  
  // Two-Month Calendar View State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(() => {
    if (initialStartDate) return new Date(initialStartDate);
    return new Date();
  });

  // Hover preview for the fixed-duration schedule calendar
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Contact Details (Step 2 - Lead Traveler)
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    country: "",
    flightArrivalDate: "",
    flightDepartureDate: ""
  });


  // Payment Options (Step 3)
  const [paymentType, setPaymentType] = useState<"full" | "advance_10" | "pay_later">("full");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "esewa" | "khalti" | "bank_transfer">("stripe");
  
  // Gateways inputs
  const [creditCard, setCreditCard] = useState({ number: "", expiry: "", cvc: "" });
  const [walletPhone, setWalletPhone] = useState("");
  const [walletOtp, setWalletOtp] = useState("");
  
  // Submission Statuses
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [bookingResponse, setBookingResponse] = useState<any>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [siteSettings, setSiteSettings] = useState<any>(null);

  const getActivePaymentMethods = () => {
    const methods = [];
    const settings = siteSettings?.paymentSettings;

    if (!siteSettings) {
      return [
        { id: "stripe", label: "Credit Card" },
        { id: "paypal", label: "PayPal" },
        { id: "bank_transfer", label: "SWIFT Bank" }
      ];
    }

    if (settings?.enableStripe !== false) {
      methods.push({ id: "stripe", label: "Credit Card" });
    }
    if (settings?.enablePaypal !== false) {
      methods.push({ id: "paypal", label: "PayPal" });
    }
    if (settings?.enableLocalWallets === true) {
      methods.push({ id: "esewa", label: "eSewa" });
      methods.push({ id: "khalti", label: "Khalti" });
    }
    if (settings?.enableBankTransfer !== false) {
      methods.push({ id: "bank_transfer", label: "SWIFT Bank" });
    }

    return methods;
  };

  // ----------------------------------------------------
  // EFFECTS
  // ----------------------------------------------------

  // Fetch site settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/site-settings");
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (err) {
        console.error("Error fetching site settings in BookingStepper:", err);
      }
    }
    fetchSettings();
  }, []);

  // Filter and auto-select payment methods based on settings
  useEffect(() => {
    const active = getActivePaymentMethods();
    if (active.length > 0) {
      const isStillActive = active.some(m => m.id === paymentMethod);
      if (!isStillActive) {
        setPaymentMethod(active[0].id as any);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteSettings]);
  
  // Fetch Departures
  useEffect(() => {
    async function fetchDepartures() {
      try {
        setLoadingDepartures(true);
        const res = await fetch(`/api/public/departures?slug=${trek.slug}`);
        if (res.ok) {
          const data = await res.json();
          const list = data.departures || [];
          setDepartures(list);
          
          // If we had a departure ID query param, match it
          if (initialDepartureId) {
            const matched = list.find((dep: any) => String(dep.id) === String(initialDepartureId));
            if (matched) {
              setSelectedDeparture(matched);
              setStartDate(matched.startDate);
              setEndDate(matched.endDate);
            }
          } else if (initialStartDate) {
            const matched = list.find((dep: any) => dep.startDate === initialStartDate);
            if (matched) {
              setSelectedDeparture(matched);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching departures:", err);
      } finally {
        setLoadingDepartures(false);
      }
    }
    fetchDepartures();
  }, [trek.slug, initialStartDate, initialDepartureId]);

  // Calculate trip end date from the fixed trek duration (inclusive of the start day)
  useEffect(() => {
    if (!selectedDeparture && startDate) {
      const [y, m, d] = startDate.split("T")[0].split("-").map(Number);
      if (!y || !m || !d) return;
      const end = new Date(y, m - 1, d);
      end.setDate(end.getDate() + (trek.duration - 1));
      setEndDate(`${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`);
    }
  }, [startDate, selectedDeparture, trek.duration]);

  // ----------------------------------------------------
  // CALENDAR LOGIC HELPERS
  // ----------------------------------------------------
  const findDepartureForDate = (date: Date) => {
    if (!departures || departures.length === 0) return null;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    
    return departures.find((dep: any) => {
      const depDate = new Date(dep.startDate);
      const depY = depDate.getFullYear();
      const depM = String(depDate.getMonth() + 1).padStart(2, '0');
      const depD = String(depDate.getDate()).padStart(2, '0');
      const depStr = `${depY}-${depM}-${depD}`;
      return dateStr === depStr;
    });
  };

  const selectDepartureFromCalendar = (dep: any) => {
    setSelectedDeparture(dep);
    setStartDate(dep.startDate);
    setEndDate(dep.endDate);
  };

  const selectCustomDate = (dateStr: string) => {
    setSelectedDeparture(null);
    setStartDate(dateStr);
  };

  // ----------------------------------------------------
  // FIXED-DURATION SCHEDULE CALENDAR (matches trek detail planner)
  // ----------------------------------------------------
  const tripDays = trek.duration || 1;
  const startOfToday = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();
  const addDays = (date: Date, n: number) => { const d = new Date(date); d.setDate(d.getDate() + n); d.setHours(0, 0, 0, 0); return d; };
  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const parseISODate = (s: string): Date | null => {
    if (!s) return null;
    const [y, m, d] = s.split("T")[0].split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d); dt.setHours(0, 0, 0, 0); return dt;
  };
  const fmtISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const selectScheduleDate = (date: Date) => {
    setSelectedDeparture(null);
    setStartDate(fmtISODate(date));
  };

  const renderScheduleMonth = (mDate: Date) => {
    const year = mDate.getFullYear();
    const month = mDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    const selStart = parseISODate(startDate);
    const rangeStart = selStart || hoverDate;
    const rangeEnd = rangeStart ? addDays(rangeStart, tripDays - 1) : null;

    return (
      <div className="flex flex-col gap-2">
        <div className="text-center font-serif font-black text-xs text-[#1A1A2E] py-2 bg-slate-50 border border-slate-200/60 rounded-xl uppercase tracking-wider">
          {MONTHS[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[9px] uppercase text-[#6B6B6B] border-b border-[#E5E5E5] pb-1.5 mt-1">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mt-1.5">
          {blanks.map((_, idx) => (<div key={`blank-${idx}`} className="aspect-square"></div>))}
          {days.map((day) => {
            const date = new Date(year, month, day); date.setHours(0, 0, 0, 0);
            const past = date < startOfToday;
            const isRangeStart = rangeStart && isSameDay(date, rangeStart);
            const isRangeEnd = rangeEnd && isSameDay(date, rangeEnd);
            const inRange = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;

            let cellStyle = "bg-white text-[#1A1A2E] border border-slate-200 hover:border-[#2E7D32] hover:bg-emerald-50 cursor-pointer";
            if (past) {
              cellStyle = "text-slate-300 line-through cursor-not-allowed";
            } else if (isRangeStart || isRangeEnd) {
              cellStyle = "bg-[#2E7D32] text-white font-black border border-[#2E7D32] shadow-sm cursor-pointer";
            } else if (inRange) {
              cellStyle = "bg-emerald-100 text-emerald-900 font-bold cursor-pointer";
            }

            return (
              <button
                key={`day-${day}`}
                type="button"
                disabled={past}
                onClick={() => { if (!past) selectScheduleDate(date); }}
                onMouseEnter={() => { if (!past) setHoverDate(date); }}
                onMouseLeave={() => setHoverDate(null)}
                className={`aspect-square w-full rounded-xl flex items-center justify-center select-none transition text-[11px] ${cellStyle}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ----------------------------------------------------
  // PRICING CALCULATIONS
  // ----------------------------------------------------
  const getUnitPrice = (paxCount: number) => {
    const tier = trek.groupDiscounts.find(d => paxCount >= d.minPersons && paxCount <= d.maxPersons);
    return tier ? tier.pricePerPerson : (trek.discountedPrice || trek.price);
  };

  const paxPrice = getUnitPrice(guestsCount);
  const totalBasePrice = paxPrice * guestsCount;
  
  // Addons total
  const addonsTotal = ADDONS_LIST.reduce((total, addon) => {
    if (selectedAddons[addon.id]) {
      return total + (addon.price * guestsCount);
    }
    return total;
  }, 0);

  const originalPricePP = trek.price || Math.round(paxPrice * 1.15);
  const discountTotal = (originalPricePP - paxPrice) * guestsCount;
  // Tourism/insurance fee removed from checkout — the team upsells travel
  // insurance and add-ons in person. Kept as 0 so downstream refs (payload,
  // summary) stay valid without further changes.
  const taxTotal = 0;
  const totalPrice = totalBasePrice + addonsTotal + taxTotal;
  
  const advancePercentage = siteSettings?.paymentSettings?.advancePaymentPercentage ?? 10;
  const enablePayLater = siteSettings?.paymentSettings?.enableBookNowPayLater !== false;
  const advanceAmount = Math.round(totalPrice * (advancePercentage / 100));

  const paymentDueNow = paymentType === "pay_later" ? 0 : (paymentType === "advance_10" ? advanceAmount : totalPrice);

  // Form validations for each stepper with descriptive error messaging
  const validateStep = (shouldSetError = true): boolean => {
    if (shouldSetError) setStepError(null);
    if (currentStep === 1) {
      if (!startDate || !endDate) {
        if (shouldSetError) setStepError("Please select your trip start date from the calendar below.");
        return false;
      }
      if (guestsCount < 1) {
        if (shouldSetError) setStepError("Please select at least 1 guest traveler.");
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!contactInfo.fullName.trim()) {
        if (shouldSetError) setStepError("Lead Customer Contact: Full Name is required.");
        return false;
      }
      if (!contactInfo.email.trim()) {
        if (shouldSetError) setStepError("Lead Customer Contact: Email Address is required.");
        return false;
      }
      if (!contactInfo.phone.trim()) {
        if (shouldSetError) setStepError("Lead Customer Contact: Contact Number is required.");
        return false;
      }
      if (!contactInfo.country.trim()) {
        if (shouldSetError) setStepError("Lead Customer Contact: Please select your Country.");
        return false;
      }
      // Passport / per-traveler profiles are intentionally NOT collected here.
      // The team gathers passport details and traveler profiles before
      // departure, keeping the online booking short and high-converting.
      return true;
    }
    if (currentStep === 3) {
      if (paymentType === "pay_later") return true;

      if (paymentMethod === "stripe") {
        const cleanCard = creditCard.number.replace(/\s+/g, '');
        if (cleanCard.length < 15) {
          if (shouldSetError) setStepError("Payment Details: Please enter a valid Credit Card number.");
          return false;
        }
        if (!creditCard.expiry) {
          if (shouldSetError) setStepError("Payment Details: Please enter card Expiry Date.");
          return false;
        }
        if (creditCard.cvc.length < 3) {
          if (shouldSetError) setStepError("Payment Details: Please enter a valid CVC security code.");
          return false;
        }
      }
      if (paymentMethod === "esewa" || paymentMethod === "khalti") {
        if (walletPhone.length < 10) {
          if (shouldSetError) setStepError("Payment Details: Please enter a valid 10-digit mobile number.");
          return false;
        }
        if (walletOtp.length < 4) {
          if (shouldSetError) setStepError("Payment Details: Please enter the OTP security code sent to your phone.");
          return false;
        }
      }
      return true; // PayPal and Bank Transfer
    }
    return false;
  };

  const isStepValid = () => {
    return validateStep(false);
  };

  const handleNextStep = () => {
    if (validateStep(true)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setStepError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddonChange = (addonId: string) => {
    setSelectedAddons(prev => ({ ...prev, [addonId]: !prev[addonId] }));
  };

  // ----------------------------------------------------
  // SUBMISSION LOGIC
  // ----------------------------------------------------
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(true)) {
      return;
    }

    if (!recaptchaToken) {
      setStepError("Please complete the reCAPTCHA validation.");
      return;
    }

    setSubmitting(true);

    // Map Lead contact full name into firstName/lastName for API compatibility
    const contactParts = contactInfo.fullName.trim().split(" ");
    const contactFirstName = contactParts[0] || "Guest";
    const contactLastName = contactParts.slice(1).join(" ") || "Traveler";

    // We only collect the lead customer online now. Send a single traveler
    // record built from the lead so the API treats this as a real booking
    // (an empty travelers array would be routed to the inquiry flow instead).
    // Passport number/expiry are left blank and collected in person; the
    // Bookings collection only requires name/nationality/gender/dob, so we
    // pass the lead's country as nationality and neutral placeholders the
    // operations team updates before departure.
    const mappedTravelers = [
      {
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactInfo.email,
        nationality: contactInfo.country || "To be provided",
        gender: "other",
        dob: "1990-01-01",
        passportNumber: "",
        passportExpiry: "",
      },
    ];

    const bookingPayload = {
      trekSlug: trek.slug,
      departureId: selectedDeparture?.id || undefined,
      startDate,
      endDate,
      travelersCount: guestsCount,
      travelers: mappedTravelers,
      customerDetails: {
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactInfo.email,
        phone: contactInfo.phone,
        country: contactInfo.country
      },
      basePrice: totalBasePrice,
      discount: discountTotal,
      tax: taxTotal,
      totalPrice,
      paymentType,
      paymentMethod,
      paymentId: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      adminRemarks: `Checkout via website booking stepper. Lead-only booking — collect passport + traveler profiles for all ${guestsCount} traveler(s) before departure.`,
      recaptchaToken
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBookingResponse(data);
        setSubmitSuccess(true);
      } else {
        throw new Error(data.error || "Failed to submit booking transaction.");
      }
    } catch (err: any) {
      alert(err.message || "An unexpected error occurred during reservation. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // CALENDAR RENDER GRID
  // ----------------------------------------------------
  const renderCalendarGrid = (mDate: Date) => {
    const year = mDate.getFullYear();
    const month = mDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const blanks = Array(firstDayIndex).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    
    return (
      <div className="flex flex-col gap-2">
        <div className="text-center font-serif font-black text-xs text-[#1A1A2E] py-2 bg-slate-50 border border-slate-200/60 rounded-xl uppercase tracking-wider">
          {MONTHS[month]} {year}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center font-extrabold text-[9px] uppercase text-[#6B6B6B] border-b border-[#E5E5E5] pb-1.5 mt-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mt-1.5">
          {blanks.map((_, idx) => (
            <div key={`blank-${idx}`} className="aspect-square"></div>
          ))}
          {days.map((day) => {
            const date = new Date(year, month, day);
            const dep = findDepartureForDate(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            const isSoldOut = dep?.status === "sold_out";
            const isLimited = dep?.status === "limited";
            const isSelected = selectedDeparture && 
              new Date(selectedDeparture.startDate).toDateString() === date.toDateString();
              
            let cellStyle = "bg-white text-slate-300 cursor-default border border-slate-50";
            let clickHandler = undefined;
            let displayElement = <span className="font-bold text-[11px]">{day}</span>;
            
            if (dep) {
              if (isSoldOut) {
                cellStyle = "bg-red-50 text-red-300 line-through cursor-not-allowed border border-red-100 flex flex-col items-center justify-center relative";
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px] text-red-400">{day}</span>
                    <span className="text-[6px] text-red-500 font-extrabold leading-none mt-0.5">FULL</span>
                  </div>
                );
              } else if (isLimited) {
                cellStyle = `bg-amber-50 text-amber-950 border border-amber-200 hover:border-amber-400 cursor-pointer flex flex-col items-center justify-center relative transition shadow-sm ${
                  isSelected ? "ring-2 ring-[#2E7D32] bg-amber-100 scale-[1.03]" : ""
                }`;
                clickHandler = () => selectDepartureFromCalendar(dep);
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px]">{day}</span>
                    <span className="text-[6px] text-amber-700 font-extrabold leading-none mt-0.5">{dep.availableSeats} LFT</span>
                  </div>
                );
              } else {
                cellStyle = `bg-emerald-50 text-emerald-950 border border-emerald-200 hover:border-emerald-500 cursor-pointer flex flex-col items-center justify-center relative transition shadow-sm ${
                  isSelected ? "ring-2 ring-[#2E7D32] bg-emerald-100 scale-[1.03]" : ""
                }`;
                clickHandler = () => selectDepartureFromCalendar(dep);
                displayElement = (
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-black text-[11px]">{day}</span>
                    <span className="text-[6px] text-emerald-700 font-extrabold leading-none mt-0.5">GO</span>
                  </div>
                );
              }
            } else {
              cellStyle = `bg-white text-slate-400 border border-slate-100/50 flex items-center justify-center aspect-square ${
                isToday ? "border-slate-300 bg-slate-50/50" : ""
              }`;
            }
            
            return (
              <button
                key={`day-${day}`}
                type="button"
                disabled={!dep || isSoldOut}
                onClick={clickHandler}
                className={`aspect-square w-full rounded-xl flex items-center justify-center select-none transition ${cellStyle}`}
              >
                {displayElement}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // SUCCESS SCREEN
  if (submitSuccess && bookingResponse) {
    const isSwift = paymentMethod === "bank_transfer";
    return (
      <div className="bg-white rounded-3xl border border-[#E5E5E5] p-8 md:p-12 shadow-2xl flex flex-col gap-8 text-center animate-fade-in print:border-0 print:shadow-none print:p-0">
        <div className="flex flex-col items-center gap-4 border-b border-[#E5E5E5] pb-8 print:border-b-2 print:pb-4">
          <FaCheckCircle className="h-16 w-16 text-green-500 animate-bounce print:hidden" />
          <h2 className="font-serif text-3xl font-black text-[#1a2e1f]">Booking Reservation Confirmed!</h2>
          <p className="text-sm text-[#6B6B6B] max-w-lg font-medium print:hidden">
            Your booking details are verified, permits locked, and itinerary reservations activated in our registers.
          </p>
          <div className="bg-[#1a2e1f] text-white rounded-xl px-5 py-3 mt-2 flex flex-col items-center gap-1 border border-white/10 select-all font-mono font-bold">
            <span className="text-[10px] text-white/60 tracking-widest uppercase">Booking ID Reference Number</span>
            <span className="text-xl text-[#F5A623]">{bookingResponse.bookingId}</span>
          </div>
        </div>

        <div className="text-left bg-slate-50 border border-[#E5E5E5] rounded-2xl p-6 md:p-8 flex flex-col gap-6 print:bg-white print:p-0 print:border-0">
          <h3 className="font-serif text-lg font-black text-[#1a2e1f] border-b border-[#E5E5E5] pb-2 uppercase tracking-wide">
            Invoice Summary Receipt
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
            <div className="flex flex-col gap-2.5">
              <div>
                <span className="text-[#6B6B6B]">Trek Destination:</span>
                <p className="font-black text-[#1A1A2E] text-sm mt-0.5">{trek.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B6B6B]">Start Date:</span>
                  <p className="font-black text-[#1A1A2E]">{startDate}</p>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">End Date:</span>
                  <p className="font-black text-[#1A1A2E]">{endDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B6B6B]">Total Duration:</span>
                  <p className="font-black text-[#1A1A2E]">{trek.duration} Days</p>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">Group Size:</span>
                  <p className="font-black text-[#1A1A2E]">{guestsCount} Travelers</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 md:border-l md:border-[#E5E5E5] md:pl-6">
              <div>
                <span className="text-[#6B6B6B]">Lead Customer:</span>
                <p className="font-black text-[#1A1A2E] text-sm mt-0.5">{contactInfo.fullName}</p>
              </div>
              <div>
                <span className="text-[#6B6B6B]">Contact Info:</span>
                <p className="font-black text-[#1A1A2E]">{contactInfo.email} | {contactInfo.phone}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#6B6B6B]">Billing Gateway:</span>
                  <p className="font-black text-green-700 uppercase">{paymentMethod.replace("_", " ")}</p>
                </div>
                <div>
                  <span className="text-[#6B6B6B]">Payment Status:</span>
                  <p className="font-black text-amber-700 uppercase">
                    {bookingResponse.paymentStatus === "paid" ? "Paid (Confirmed)" : "Pending Verification"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E5E5E5] pt-4 mt-2 text-xs">
            <div className="flex justify-between py-1.5 text-[#6B6B6B] font-semibold">
              <span>Base Trek Cost ({guestsCount} Travelers x ${paxPrice})</span>
              <span>${totalBasePrice} USD</span>
            </div>

            {addonsTotal > 0 && (
              <div className="flex justify-between py-1.5 text-[#6B6B6B] font-semibold border-b border-[#E5E5E5] pb-3">
                <span>Selected Addon Extras</span>
                <span>+${addonsTotal} USD</span>
              </div>
            )}

            <div className="flex justify-between py-3 font-black text-sm text-[#1A1A2E]">
              <span>Grand Total Cost:</span>
              <span>${totalPrice} USD</span>
            </div>

            <div className="flex justify-between py-3 font-black text-sm bg-green-50 border border-green-200 px-4 rounded-xl text-green-900 mt-2">
              <span>Amount Paid Now ({paymentType === "pay_later" ? "0% Pay Later" : (paymentType === "advance_10" ? `${advancePercentage}% Deposit` : "100% Full")}):</span>
              <span>${paymentDueNow} USD</span>
            </div>
          </div>
        </div>

        {isSwift && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-left flex flex-col gap-3 font-sans text-xs">
            <h4 className="font-black text-amber-900 uppercase">🏦 SWIFT Bank Wire Instructions</h4>
            <p className="text-[#3D3D3D] leading-relaxed">
              Please transfer the due amount of <strong>${paymentDueNow} USD</strong> to our official corporate account listed below within 7 days. Send the wire receipt copy to <strong>billing@summittrailtrekking.com</strong> to confirm the booking.
            </p>
            <div className="grid grid-cols-2 gap-2.5 font-semibold text-[11px] text-[#1A1A2E] bg-white border border-[#E5E5E5] p-4 rounded-xl font-mono mt-1">
              <span>Account Holder Name:</span>
              <strong>Nature Heaven Treks Pvt. Ltd.</strong>
              <span>Bank Name:</span>
              <strong>Global IME Bank Nepal</strong>
              <span>Account Number:</span>
              <strong>01234567890123</strong>
              <span>SWIFT / BIC Code:</span>
              <strong>GIBNPNKAXXX</strong>
            </div>
          </div>
        )}

        <div className="text-left flex flex-col gap-4 border-t border-[#E5E5E5] pt-8 print:hidden">
          <h4 className="font-serif text-lg font-black text-[#1a2e1f]">📝 Your Himalayan Preparation Checklist</h4>
          <ul className="flex flex-col gap-3 text-xs font-semibold">
            <li className="flex items-start gap-3">
              <span className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5">✓</span>
              <span><strong>Passport Check</strong>: Ensure your passport is valid for at least 6 months past your travel end date.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5">✓</span>
              <span><strong>Nepal Entry Visa</strong>: Obtain a tourist visa on arrival in Kathmandu Tribhuvan Airport ($50 USD for 30 days).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="p-0.5 rounded-full bg-green-100 text-green-600 mt-0.5">✓</span>
              <span><strong>Medical Travel Insurance</strong>: Verify your emergency policy explicitly covers high altitude search and rescue up to 6,000m.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 print:hidden">
          <button
            onClick={() => typeof window !== "undefined" && window.print()}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 border border-[#E5E5E5] text-[#1a2e1f] font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition"
          >
            <FaPrint /> Print Receipt
          </button>
          
          <button
            onClick={() => router.push(`/trips/${trek.slug}`)}
            className="w-full sm:w-auto bg-[#1a2e1f] hover:bg-[#1a2e1f]/90 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
          >
            Return to Trek Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Visual Step Tracker Indicator Bar */}
      <div className="bg-white border border-[#E5E5E5] rounded-2xl p-5 md:p-6 shadow-sm flex items-center justify-between">
        {[
          { step: 1, label: "Select Dates & Size" },
          { step: 2, label: "Contact Details" },
          { step: 3, label: "Secure Payment" }
        ].map((s) => {
          const isActive = currentStep === s.step;
          const isCompleted = currentStep > s.step;

          return (
            <div key={s.step} className="flex items-center gap-2 group grow last:grow-0">
              <div className="flex items-center gap-2 relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition duration-300 border ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                      ? "bg-[#1a2e1f] border-[#1a2e1f] text-white shadow-md font-extrabold"
                      : "bg-slate-50 border-[#E5E5E5] text-[#6B6B6B]"
                  }`}
                >
                  {isCompleted ? <FaCheck className="text-[10px]" /> : s.step}
                </div>
                <span className={`hidden sm:inline text-[11px] font-black tracking-wide uppercase transition ${
                  isActive ? "text-[#1a2e1f]" : "text-[#6B6B6B]"
                }`}>
                  {s.label}
                </span>
              </div>
              {s.step < 3 && (
                <div className={`h-0.5 grow mx-2 bg-slate-100 rounded transition duration-500 ${
                  isCompleted ? "bg-green-300" : ""
                }`}></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE STEP FORMS */}
        <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 md:p-8 shadow-sm flex flex-col gap-6">
          
          {/* STEP 1: SELECT DATES & SIZE */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-black text-[#1a2e1f]">Your Booking Details</h3>
                <p className="text-xs text-[#6B6B6B] mt-1 font-semibold">Confirm your trip and pick a start date below. The end date is calculated automatically from the fixed trip duration.</p>
              </div>

              {/* Selected Trip + Dates Summary */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase text-[#6B6B6B] tracking-wide">Select Your Trip</label>
                  <div className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2e1f]">
                    {trek.title} &ndash; {trek.duration} Days
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-[#6B6B6B] tracking-wide">Trip Start Date</label>
                    <div className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2e1f] flex items-center justify-between gap-2">
                      <span className={startDate ? "" : "text-slate-400 font-semibold"}>{startDate ? formatDateFriendly(startDate) : "Select a date below"}</span>
                      <FaCalendarAlt className="text-[#2E7D32] shrink-0" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-extrabold uppercase text-[#6B6B6B] tracking-wide">Trip End Date</label>
                    <div className="bg-slate-50 border border-[#E5E5E5] rounded-xl px-4 py-3 text-sm font-bold text-[#1a2e1f] flex items-center justify-between gap-2">
                      <span className={endDate ? "" : "text-slate-400 font-semibold"}>{endDate ? formatDateFriendly(endDate) : "Auto-calculated"}</span>
                      <FaCalendarAlt className="text-[#2E7D32] shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Size Stepper */}
              <div className="bg-[#F8F7F4] border border-[#E5E5E5] p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col text-center sm:text-left">
                  <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] tracking-wider">Number of Persons</span>
                  <span className="text-xs text-[#1a2e1f] font-bold mt-0.5">Select how many hikers are in your group</span>
                </div>
                
                <div className="flex items-center gap-4 bg-white border border-[#E5E5E5] rounded-xl px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setGuestsCount(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition text-slate-700 active:scale-95"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <span className="font-mono font-black text-lg text-[#1A1A2E] w-8 text-center">{guestsCount}</span>
                  <button
                    type="button"
                    onClick={() => setGuestsCount(prev => Math.min(25, prev + 1))}
                    className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition text-slate-700 active:scale-95"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Fixed-Duration Schedule Calendar */}
              <div className="border-t border-[#E5E5E5] pt-5">
                <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setCurrentMonthDate(prev => { const next = new Date(prev); next.setMonth(prev.getMonth() - 1); return next; })}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700 transition"
                  >
                    &lt;
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMonthDate(prev => { const next = new Date(prev); next.setMonth(prev.getMonth() + 1); return next; })}
                    className="w-7 h-7 rounded-lg bg-white border border-[#E5E5E5] hover:bg-slate-50 flex items-center justify-center font-bold text-slate-700 transition"
                  >
                    &gt;
                  </button>
                  <select
                    value={currentMonthDate.getMonth()}
                    onChange={(e) => { const m = parseInt(e.target.value); setCurrentMonthDate(prev => { const next = new Date(prev); next.setMonth(m); return next; }); }}
                    className="bg-white border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1A1A2E] cursor-pointer"
                  >
                    {MONTHS.map((name, i) => (
                      <option key={i} value={i}>{name}</option>
                    ))}
                  </select>
                  <select
                    value={currentMonthDate.getFullYear()}
                    onChange={(e) => { const y = parseInt(e.target.value); setCurrentMonthDate(prev => { const next = new Date(prev); next.setFullYear(y); return next; }); }}
                    className="bg-white border border-[#E5E5E5] rounded-lg px-2.5 py-1 text-xs font-bold text-[#1A1A2E] cursor-pointer"
                  >
                    {[new Date().getFullYear(), new Date().getFullYear() + 1].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderScheduleMonth(currentMonthDate)}
                  {(() => {
                    const nextMonth = new Date(currentMonthDate);
                    nextMonth.setMonth(currentMonthDate.getMonth() + 1);
                    return renderScheduleMonth(nextMonth);
                  })()}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#6B6B6B]">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span>Past dates are unavailable</span>
                </div>
              </div>

              {/* Premium Addons List */}
              <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-5">
                <h4 className="font-serif text-base font-black text-[#1a2e1f]">Premium Optional Upgrades</h4>
                <div className="flex flex-col gap-3">
                  {ADDONS_LIST.map((addon) => {
                    const isChecked = !!selectedAddons[addon.id];
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-start gap-4 border p-4 rounded-xl cursor-pointer transition select-none ${
                          isChecked
                            ? "border-green-300 bg-green-50/50 shadow-sm"
                            : "border-[#E5E5E5] bg-white hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAddonChange(addon.id)}
                          className="mt-1 rounded accent-[#2E7D32] h-4 w-4 cursor-pointer"
                        />
                        <div className="grow flex flex-col gap-1 min-w-0">
                          <div className="flex justify-between items-baseline flex-wrap gap-2">
                            <span className="font-sans font-black text-xs text-[#1a2e1f]">{addon.title}</span>
                            <span className="font-sans font-black text-xs text-green-800 shrink-0">+${addon.price} USD / PP</span>
                          </div>
                          <span className="text-[10px] text-[#6B6B6B] font-semibold">{addon.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LEAD CONTACT (minimal — passport/traveler details taken in person) */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-black text-[#1a2e1f]">2. Your Contact Details</h3>
                <p className="text-xs text-[#6B6B6B] mt-1 font-semibold">Just the essentials to confirm your booking. Our team will collect passport &amp; traveler details with you before departure.</p>
              </div>

              {/* Lead Customer Contact — 4 essential fields only */}
              <div className="flex flex-col gap-4 bg-slate-50 border border-[#E5E5E5] p-5 rounded-2xl">
                <h4 className="font-serif text-sm font-black text-[#1a2e1f] border-b border-[#E5E5E5] pb-1.5 uppercase tracking-wide">
                  Lead Traveler Contact
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={contactInfo.fullName}
                      onChange={(e) => setContactInfo({ ...contactInfo, fullName: e.target.value })}
                      className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="example@example.com"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">Contact Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 234 567 8900"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className="border border-[#E5E5E5] rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">Country of Residence *</label>
                    <select
                      required
                      value={contactInfo.country}
                      onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                      className="border border-[#E5E5E5] rounded-xl px-3 py-2.5 text-xs font-semibold bg-white focus:outline-none focus:border-[#2E7D32] cursor-pointer"
                    >
                      <option value="">Select Country</option>
                      {COUNTRIES_LIST.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Reassurance — why we don't ask for more now */}
              <div className="flex items-start gap-3 bg-[#2E7D32]/5 border border-[#2E7D32]/20 rounded-2xl p-4">
                <FaCheck className="text-[#2E7D32] text-sm shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#3D3D3D] leading-relaxed font-semibold">
                  <span className="text-[#1a2e1f] font-black">No passport upload needed to book.</span> Once your
                  spot is reserved, your dedicated specialist will help you complete passport details, traveler
                  profiles{guestsCount > 1 ? ` for all ${guestsCount} travelers` : ""}, insurance and any
                  add-ons — by email or on arrival in Kathmandu. Booking now takes under a minute.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SECURE PAYMENT GATEWAY */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="font-serif text-2xl font-black text-[#1a2e1f]">3. Secure Checkout & Deposit Payment</h3>
                <p className="text-xs text-[#6B6B6B] mt-1 font-semibold">Select your deposit preferences and pay securely via encrypted SSL financial gateways.</p>
              </div>

              {/* Split Deposit Preferences */}
              <div className="flex flex-col gap-3.5 bg-slate-50 border border-[#E5E5E5] p-5 rounded-2xl">
                <h4 className="font-serif text-sm font-black text-[#1a2e1f] border-b border-[#E5E5E5] pb-1.5 uppercase tracking-wide">
                  Choose Payment Preferences
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    onClick={() => setPaymentType("full")}
                    className={`border p-4 rounded-xl cursor-pointer transition flex items-start gap-3 select-none ${
                      paymentType === "full"
                        ? "border-green-300 bg-white shadow-sm ring-2 ring-[#2E7D32]/25"
                        : "border-[#E5E5E5] bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentType === "full"}
                      readOnly
                      className="mt-1 accent-[#2E7D32] h-4 w-4 cursor-pointer"
                    />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-[#1a2e1f]">Pay 100% Full Cost</span>
                      <span className="text-[9px] text-[#6B6B6B] font-semibold">Instantly secure complete booking vouchers</span>
                      <span className="text-xs text-[#2E7D32] font-black mt-2">${totalPrice} USD due</span>
                    </div>
                  </label>

                  {advancePercentage > 0 && (
                    <label
                      onClick={() => setPaymentType("advance_10")}
                      className={`border p-4 rounded-xl cursor-pointer transition flex items-start gap-3 select-none ${
                        paymentType === "advance_10"
                          ? "border-green-300 bg-white shadow-sm ring-2 ring-[#2E7D32]/25"
                          : "border-[#E5E5E5] bg-white hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentType === "advance_10"}
                        readOnly
                        className="mt-1 accent-[#2E7D32] h-4 w-4 cursor-pointer"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-[#1a2e1f]">Pay {advancePercentage}% Advance Deposit</span>
                        <span className="text-[9px] text-[#6B6B6B] font-semibold">Reserve spots today, settle remaining {100 - advancePercentage}% in Kathmandu</span>
                        <span className="text-xs text-[#2E7D32] font-black mt-2">${advanceAmount} USD due</span>
                      </div>
                    </label>
                  )}

                  {enablePayLater && (
                    <label
                      onClick={() => setPaymentType("pay_later")}
                      className={`border p-4 rounded-xl cursor-pointer transition flex items-start gap-3 select-none ${
                        paymentType === "pay_later"
                          ? "border-green-300 bg-white shadow-sm ring-2 ring-[#2E7D32]/25"
                          : "border-[#E5E5E5] bg-white hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentType === "pay_later"}
                        readOnly
                        className="mt-1 accent-[#2E7D32] h-4 w-4 cursor-pointer"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-[#1a2e1f]">Book Now, Pay Later (0%)</span>
                        <span className="text-[9px] text-[#6B6B6B] font-semibold">Submit a credit booking request subject to approval</span>
                        <span className="text-xs text-[#2E7D32] font-black mt-2">$0 USD due today</span>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Gateway Methods List */}
              {paymentType !== "pay_later" && (
                <div className="flex flex-col gap-4 border-t border-[#E5E5E5] pt-5">
                  <h4 className="font-serif text-sm font-black text-[#1a2e1f] uppercase tracking-wide">
                    Choose Payment Method
                  </h4>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {getActivePaymentMethods().map((m) => {
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`border px-3 py-3 rounded-xl font-bold text-xs flex flex-col items-center justify-center text-center transition gap-2 shadow-sm focus:outline-none ${
                          isSelected
                            ? "bg-[#1a2e1f] text-white border-[#1a2e1f]"
                            : "bg-white border-[#E5E5E5] text-[#3D3D3D] hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[10px] block">{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Gateway Inputs */}
                <div className="bg-[#F8F7F4] border border-[#E5E5E5] p-5 rounded-2xl mt-2">
                  
                  {paymentMethod === "stripe" && (
                    <div className="flex flex-col gap-3 animate-fade-in text-xs font-semibold">
                      <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-2 mb-1">
                        <h5 className="font-serif font-black text-xs text-[#1a2e1f]">Secure Credit Card Checkout</h5>
                        <FaShieldAlt className="text-green-600 text-sm" />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-extrabold uppercase text-[#6B6B6B]">Card Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="4111 2222 3333 4444"
                          maxLength={19}
                          value={creditCard.number}
                          onChange={(e) => setCreditCard({ ...creditCard, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                          className="border border-[#E5E5E5] bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase text-[#6B6B6B]">Expiration MM/YY *</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            value={creditCard.expiry}
                            onChange={(e) => setCreditCard({ ...creditCard, expiry: e.target.value })}
                            className="border border-[#E5E5E5] bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-extrabold uppercase text-[#6B6B6B]">CVC Code *</label>
                          <input
                            type="password"
                            required
                            placeholder="123"
                            maxLength={3}
                            value={creditCard.cvc}
                            onChange={(e) => setCreditCard({ ...creditCard, cvc: e.target.value.replace(/\D/g, '') })}
                            className="border border-[#E5E5E5] bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="flex flex-col items-center py-6 text-center gap-3 animate-fade-in text-xs font-semibold">
                      <span className="text-2xl">💳</span>
                      <h5 className="font-serif font-black text-sm text-[#1a2e1f]">PayPal Checkout Gateways</h5>
                      <p className="text-[#6B6B6B] max-w-sm">
                        Confirming will route safety procedures directly to secure PayPal interfaces to finalize the checkouts.
                      </p>
                    </div>
                  )}

                  {(paymentMethod === "esewa" || paymentMethod === "khalti") && (
                    <div className="flex flex-col gap-3 animate-fade-in text-xs font-semibold">
                      <h5 className="font-serif font-black text-xs text-[#1a2e1f] capitalize">
                        Nepal Local Digital Wallet: {paymentMethod.toUpperCase()}
                      </h5>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-extrabold uppercase text-[#6B6B6B] capitalize">
                          {paymentMethod} Registered Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9851234567"
                          value={walletPhone}
                          onChange={(e) => setWalletPhone(e.target.value.replace(/\D/g, ''))}
                          className="border border-[#E5E5E5] bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-extrabold uppercase text-[#6B6B6B]">Wallet OTP Code / PIN *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••"
                          maxLength={6}
                          value={walletOtp}
                          onChange={(e) => setWalletOtp(e.target.value)}
                          className="border border-[#E5E5E5] bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === "bank_transfer" && (
                    <div className="flex flex-col py-4 text-left gap-3 animate-fade-in text-xs font-semibold">
                      <h5 className="font-serif font-black text-xs text-[#1a2e1f] uppercase">Corporate Bank SWIFT Transfer</h5>
                      <p className="text-[#6B6B6B] leading-relaxed">
                        Completing checkout registers your trek reservation under <strong>&quot;Pending Bank SWIFT Verification&quot;</strong> status. Official wire invoice sheets are generated for you on the final confirmation receipt screens.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

              {/* ReCAPTCHA */}
              <div className="flex justify-center mt-5 mb-2">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy_key"}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>

              {/* Submit triggers */}
              <div className="border-t border-[#E5E5E5] pt-5 flex items-center justify-between mt-2 print:hidden">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-white border border-[#E5E5E5] hover:bg-slate-50 text-[#3D3D3D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition"
                >
                  <FaArrowLeft className="text-[10px]" /> Back
                </button>

                {/* Final Submit Button */}
                <div className="pt-4 border-t border-[#E5E5E5]">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#E84C1E] hover:bg-[#d14118] text-white font-black py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition disabled:opacity-70"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-white/20 border-t-white rounded-full"></span> Processing...</span>
                    ) : (
                      <>
                        <FaLock className="text-white/80" /> {paymentType === "pay_later" ? "Submit Booking Request" : "Confirm & Pay Now"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {stepError && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold px-4 py-3.5 rounded-xl flex items-start gap-2 animate-fade-in mt-4">
              <FaExclamationCircle className="shrink-0 mt-0.5 text-red-500 text-sm" />
              <span>{stepError}</span>
            </div>
          )}

          {/* Controls for Step 1 & 2 */}
          {currentStep < 3 && (
            <div className="border-t border-[#E5E5E5] pt-5 flex items-center justify-between mt-4">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="bg-white border border-[#E5E5E5] hover:bg-slate-50 text-[#3D3D3D] font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
              >
                <FaArrowLeft className="text-[10px]" /> Back
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#1a2e1f] hover:bg-[#1a2e1f]/90 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-[0.98] transition"
              >
                Next <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: BOOKING INVOICE SUMMARY PANEL */}
        <div className="lg:sticky lg:top-[120px] bg-[#1a2e1f] text-white rounded-3xl p-6 shadow-md border border-white/10 flex flex-col gap-5">
          <div className="border-b border-white/10 pb-3">
            <span className="text-[9px] uppercase tracking-wider text-green-400 font-extrabold block mb-0.5">Summary of Booking</span>
            <h4 className="font-serif font-black text-base text-white truncate">{trek.title}</h4>
            <span className="text-[10px] text-white/60 font-semibold">{trek.duration} Days | Premium Guided Trek</span>
          </div>

          <div className="flex flex-col gap-3 text-xs font-semibold text-white/90">
            {startDate ? (
              <div className="flex flex-col gap-2.5 bg-white/5 border border-white/10 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-green-400 shrink-0 text-sm" />
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-white/50 uppercase font-bold">Reservation Schedule</span>
                    <span className="text-[11px] font-black text-green-400">{formatDateFriendly(startDate)}</span>
                    <span className="text-[8px] uppercase text-white/40 font-bold my-0.5">until</span>
                    <span className="text-[11px] font-black text-[#F5A623]">{formatDateFriendly(endDate)}</span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] text-white/60">
                  <span>Total Duration:</span>
                  <span className="font-bold text-white">{trek.duration} Days</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-amber-300">
                <FaInfoCircle className="shrink-0 text-sm" />
                <span className="text-[10px]">Please select departure date</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <FaUsers className="text-green-400 shrink-0 text-sm" />
              <div className="flex flex-col">
                <span className="text-[9px] text-white/50 uppercase font-bold">Group Travelers</span>
                <span>{guestsCount} Persons (${paxPrice} USD / PP)</span>
              </div>
            </div>
          </div>

          {/* Selected Addons */}
          {Object.keys(selectedAddons).filter(k => selectedAddons[k]).length > 0 && (
            <div className="flex flex-col gap-2 border-b border-white/10 pb-3 text-[11px] font-semibold">
              <span className="text-[9px] text-white/50 uppercase font-bold">Selected Addons Upgrade:</span>
              {ADDONS_LIST.map((addon) => {
                if (selectedAddons[addon.id]) {
                  return (
                    <div key={addon.id} className="flex justify-between text-white/80">
                      <span>✓ {addon.title}</span>
                      <span>+${addon.price * guestsCount}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}

          {/* Checkout Calculations */}
          <div className="flex flex-col gap-2.5 text-xs border-b border-white/10 pb-3.5">
            <div className="flex justify-between text-white/70">
              <span>Base Trek Price</span>
              <span>${totalBasePrice} USD</span>
            </div>
            
            {addonsTotal > 0 && (
              <div className="flex justify-between text-white/70">
                <span>Selected Addons</span>
                <span>+${addonsTotal} USD</span>
              </div>
            )}
          </div>

          {/* Due Columns */}
          <div className="flex flex-col gap-3 font-semibold text-xs">
            <div className="flex justify-between font-black text-sm text-[#F5A623]">
              <span>Grand Total:</span>
              <span>${totalPrice} USD</span>
            </div>

            <div className="flex justify-between font-black py-2.5 border-t border-b border-white/10 my-1 text-white/95 items-baseline">
              <div className="flex flex-col">
                <span className="uppercase text-[9px] text-white/60 font-extrabold">Paid / Due Now:</span>
                <span className="text-[10px] text-green-400 font-bold">{paymentType === "pay_later" ? "0% Credit Booking" : (paymentType === "advance_10" ? "10% Advance Deposit" : "100% Full Payment")}</span>
              </div>
              <span className="text-base text-green-400 font-mono font-black">${paymentDueNow} USD</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[9px] text-white/40 font-bold mt-1 text-center">
            <FaShieldAlt className="text-green-400 text-sm shrink-0" />
            <span>256-bit Secure SSL Encrypted Gateway Session</span>
          </div>
        </div>

      </div>
    </div>
  );
}
