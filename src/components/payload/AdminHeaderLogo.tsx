'use client';
import React from 'react';

export const AdminHeaderLogo = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 12px 4px 0',
    textDecoration: 'none',
  }}>
    {/* Logo image */}
    <div style={{
      width: '44px',
      height: '44px',
      flexShrink: 0,
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.12)',
      border: '1.5px solid rgba(16,185,129,0.3)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    }}>
      {/* Using <img> instead of next/image to avoid loader issues in admin */}
      <img
        src="/logo.jpeg"
        alt="Nature Heaven Trek"
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>

    {/* Brand text */}
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 800,
        fontSize: '15px',
        color: '#ffffff',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}>
        Nature Heaven
      </span>
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 500,
        fontSize: '10px',
        color: '#6ee7b7',
        whiteSpace: 'nowrap',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        Trek & Expedition
      </span>
    </div>
  </div>
);

export default AdminHeaderLogo;
