import React from 'react';

export const Icon: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <img
        src="/logo.jpeg"
        alt="Nature Heaven"
        style={{ 
          maxWidth: '100%', 
          maxHeight: '100%', 
          objectFit: 'contain',
          display: 'block'
        }}
      />
    </div>
  );
};

export default Icon;
