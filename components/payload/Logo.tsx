import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '15px' }}>
      <div style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '3px solid #f59e0b',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        transition: 'transform 0.3s ease'
      }}>
        <img
          src="/finalofficiallogo.jpeg"
          alt="Nature Heaven Logo"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#ffffff',
          margin: 0,
          fontFamily: 'Playfair Display, Georgia, serif',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)'
        }}>
          NATURE HEAVEN
        </h1>
        <p style={{
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#f59e0b',
          margin: '4px 0 0 0',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          Trek & Expedition
        </p>
      </div>
    </div>
  );
};
