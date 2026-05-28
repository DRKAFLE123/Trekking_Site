'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BeforeNav = () => {
  const pathname = usePathname();
  const isActive = pathname === '/admin' || pathname === '/admin/';

  return (
    <div style={{
      padding: '0 12px',
      marginBottom: '4px',
      marginTop: '8px'
    }}>
      <Link
        href="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          color: isActive ? '#c8922a' : '#e2f4e8',
          background: isActive ? 'rgba(200, 146, 42, 0.15)' : 'transparent',
          border: isActive ? '1.5px solid rgba(200, 146, 42, 0.3)' : '1px solid transparent',
          fontWeight: isActive ? '800' : '600',
          fontSize: '12px',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#e2f4e8';
          }
        }}
      >
        <span style={{ fontSize: '14px' }}>📊</span>
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.02em' }}>Dashboard</span>
      </Link>
      
      {/* Visual divider separator */}
      <div style={{
        height: '1px',
        background: 'rgba(255, 255, 255, 0.08)',
        marginTop: '8px',
        marginBottom: '4px'
      }} />
    </div>
  );
};

export default BeforeNav;
