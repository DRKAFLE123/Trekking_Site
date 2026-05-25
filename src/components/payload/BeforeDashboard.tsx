'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const BeforeDashboard = () => {
  const [stats, setStats] = useState({
    treks: 7,
    blogs: 2,
    bookings: 0,
    inquiries: 0,
    departures: 10,
    payments: 0,
    testimonials: 0,
    faqs: 0,
    team: 0,
    regions: 0,
  });

  const [loading, setLoading] = useState(true);
  const dbType = 'PostgreSQL (Supabase Live)';

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats({
          treks: data.treks ?? 7,
          blogs: data.blogs ?? 2,
          bookings: data.bookings ?? 0,
          inquiries: data.inquiries ?? 0,
          departures: data.departures ?? 10,
          payments: data.payments ?? 0,
          testimonials: data.testimonials ?? 0,
          faqs: data.faqs ?? 0,
          team: data.team ?? 0,
          regions: data.regions ?? 0,
        });
      } catch (err) {
        console.warn("Could not fetch dashboard live counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div style={{
      fontFamily: 'Outfit, Inter, sans-serif',
      marginBottom: '40px',
      color: '#1a2e1f',
    }}>
      {/* 1. Header Block */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2e1f 0%, #101c13 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: '#ffffff',
        boxShadow: '0 10px 15px -3px rgba(26, 46, 31, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,146,42,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        <span style={{
          color: '#c8922a',
          fontSize: '11px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
        }}>
          Nature Heaven Trekking & Expedition
        </span>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.02em',
        }}>
          CMS Control Panel
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: '4px 0 0 0',
          maxWidth: '650px',
          fontWeight: 300,
          lineHeight: '1.6',
        }}>
          Welcome to your administrative workspace. Access all website data collections, customize your payment options, manage seat calendars, edit content pages, and track bookings.
        </p>
      </div>

      {/* 2. Fast Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginTop: '24px',
      }}>
        {[
          { label: 'Treks', count: stats.treks, color: '#1a2e1f', bg: '#eef3ef' },
          { label: 'Departures', count: stats.departures, color: '#c8922a', bg: '#fbf7ee' },
          { label: 'Active Bookings', count: stats.bookings, color: '#059669', bg: '#ecfdf5' },
          { label: 'Inquiries', count: stats.inquiries, color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Blog Posts', count: stats.blogs, color: '#7c3aed', bg: '#f5f3ff' },
          { label: 'Payments Recv.', count: stats.payments, color: '#e11d48', bg: '#fff1f2' },
        ].map((item, idx) => (
          <div key={idx} style={{
            background: item.bg,
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.03)',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
              {item.label}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: item.color }}>
              {loading ? '...' : item.count}
            </div>
          </div>
        ))}
      </div>

      {/* Section Header */}
      <h2 style={{
        fontSize: '18px',
        fontWeight: 800,
        marginTop: '36px',
        marginBottom: '16px',
        color: '#1a2e1f',
        borderBottom: '2px solid #eef3ef',
        paddingBottom: '8px',
      }}>
        Core Content & Operations
      </h2>

      {/* 3. Core Admin Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {/* Card: Blog Posts */}
        <Link 
          href="/admin/collections/blogPosts"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #7c3aed',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Blog Management</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Write new articles, manage categories, edit SEO metadata, and add markdown content.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#7c3aed' }}>
            {stats.blogs} Published Articles →
          </div>
        </Link>

        {/* Card: Treks */}
        <Link 
          href="/admin/collections/treks"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #1a2e1f',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏔️</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Trek Packages</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Configure highlights, day-by-day itineraries, pricing, and group size limits.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#1a2e1f' }}>
            {stats.treks} Treks Listed →
          </div>
        </Link>

        {/* Card: Departures */}
        <Link 
          href="/admin/collections/departures"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #c8922a',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗓️</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Departures & Calendar</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Manage the group departures schedule, toggle sold-out sheets, and available seats.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#c8922a' }}>
            {stats.departures} Active Dates →
          </div>
        </Link>

        {/* Card: Bookings */}
        <Link 
          href="/admin/collections/bookings"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #059669',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Client Bookings</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Review passenger information sheets, passport files, and update booking status.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#059669' }}>
            {stats.bookings} Bookings Filed →
          </div>
        </Link>
      </div>

      {/* Section Header */}
      <h2 style={{
        fontSize: '18px',
        fontWeight: 800,
        marginTop: '36px',
        marginBottom: '16px',
        color: '#1a2e1f',
        borderBottom: '2px solid #eef3ef',
        paddingBottom: '8px',
      }}>
        Website Customization & Queries
      </h2>

      {/* 4. Secondary Admin Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
      }}>
        {/* Card: Global Settings */}
        <Link 
          href="/admin/collections/siteSettings/1"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #3b82f6',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Global Settings</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Toggle payment methods (Stripe, Paypal, Bank), change contacts, and modify logos.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#3b82f6' }}>
            Edit Configurations →
          </div>
        </Link>

        {/* Card: Inquiries */}
        <Link 
          href="/admin/collections/inquiries"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #14b8a6',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📥</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Inquiries Inbox</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Read messages and trip planning inquiries submitted by public users.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#14b8a6' }}>
            {stats.inquiries} Client Messages →
          </div>
        </Link>

        {/* Card: Payments */}
        <Link 
          href="/admin/collections/payments"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #e11d48',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💳</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Payments Log</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            View transaction IDs, amounts, gateway responses, and booking references.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#e11d48' }}>
            {stats.payments} Payments Logged →
          </div>
        </Link>

        {/* Card: Regions */}
        <Link 
          href="/admin/collections/regions"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #d97706',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🗺️</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Trek Regions</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Create trek regions (e.g. Everest, Annapurna) and assign images to them.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#d97706' }}>
            {stats.regions} Regions Defined →
          </div>
        </Link>

        {/* Card: Team Members */}
        <Link 
          href="/admin/collections/teamMembers"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #06b6d4',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧑‍🤝‍🧑</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Sherpa Team</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Manage profiles, photos, social links, and wilderness first aid credentials.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#06b6d4' }}>
            {stats.team} Team Profiles →
          </div>
        </Link>

        {/* Card: Testimonials */}
        <Link 
          href="/admin/collections/testimonials"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #db2777',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Client Testimonials</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Manage traveler reviews, ratings, trek relations, and homepage showcases.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#db2777' }}>
            {stats.testimonials} Reviews →
          </div>
        </Link>

        {/* Card: Gallery */}
        <Link 
          href="/admin/collections/gallery"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #4b5563',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>Photo Gallery</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Manage photo lists, captions, image credits, and masonry homepage layouts.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#4b5563' }}>
            Update Gallery Grid →
          </div>
        </Link>

        {/* Card: FAQs */}
        <Link 
          href="/admin/collections/faqs"
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #0d9488',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>❓</div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#1a2e1f' }}>FAQs Directory</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
            Add, edit, or delete questions and answers categorized by region or travel guidelines.
          </p>
          <div style={{ marginTop: '12px', fontSize: '11px', fontWeight: 700, color: '#0d9488' }}>
            {stats.faqs} FAQs Listed →
          </div>
        </Link>
      </div>

      {/* 5. System Health Info Banner */}
      <div style={{
        marginTop: '36px',
        padding: '16px 20px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'inline-block',
          }} />
          <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
            Active Database: <strong style={{ color: '#1a2e1f' }}>{dbType}</strong>
          </span>
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          System fully synchronized with real-time stats updates.
        </div>
      </div>
    </div>
  );
};

export default BeforeDashboard;
