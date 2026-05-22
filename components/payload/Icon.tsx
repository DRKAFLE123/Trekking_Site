import React from 'react';

export const Icon: React.FC = () => {
  return (
    <div style={{
      width: '34px',
      height: '34px',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1.5px solid #f59e0b',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2px',
      margin: 'auto'
    }}>
      <img
        src="/officiallogo.jpeg"
        alt="Nature Heaven Icon"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
};
