""use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaWhatsapp, FaChevronDown, FaSearch, FaPhoneAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const pathname = usePathname();
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const [siteRes, regionsRes] = await Promise.all([
        fetch('/api/site-settings'),
        fetch('/api/regions')
      ]);
      const siteData = await siteRes.json();
      const regionsData = await regionsRes.json();
      setSiteSettings(siteData);
      setRegions(regionsData);
      setLoading(false);
    }
    fetchData();
  }, []);
  const { siteName, contactInfo } = siteSettings || {};

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = [
    {
      title: "Nepal Trips",
      dropdown: true,
      key: "trips",
      items: regions.map(r => ({ label: `${r.name} Region`, href: `/regions/${r.slug}` })),
    },
    {
      title: "Travel Info",
      dropdown: true,
   
<truncated 14378 bytes>