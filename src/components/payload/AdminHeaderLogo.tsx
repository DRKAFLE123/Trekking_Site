'use client';
import React from 'react';

export const AdminHeaderLogo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 16px 8px 8px',
      margin: '6px 0',
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
        marginRight: '6px', // Extra spacing to prevent overlay
      }}>
        {/* Using <img> instead of next/image to avoid loader issues in admin */}
        <img
          src="/finalofficiallogo.jpeg"
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
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flexGrow: 1 }}>
        <span className="brand-title" style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 800,
          fontSize: '15px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.01em',
        }}>
          Nature Heaven
        </span>
        <span className="brand-subtitle" style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 500,
          fontSize: '10px',
          whiteSpace: 'nowrap',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Trek & Expedition
        </span>
      </div>
    </div>
  );
};

export default AdminHeaderLogo;
