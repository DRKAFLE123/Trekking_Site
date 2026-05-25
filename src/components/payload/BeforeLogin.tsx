'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';

export const BeforeLogin = () => {
  useEffect(() => {
    // Dynamically insert password show/hide toggle
    const interval = setInterval(() => {
      const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
      if (passwordInput && !passwordInput.dataset.hasToggle) {
        passwordInput.dataset.hasToggle = 'true';

        const parent = passwordInput.parentElement;
        if (parent) {
          parent.style.position = 'relative';

          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.innerHTML = '👁️';
          toggleBtn.style.position = 'absolute';
          toggleBtn.style.right = '16px';
          toggleBtn.style.top = '50%';
          toggleBtn.style.transform = 'translateY(-50%)';
          toggleBtn.style.background = 'none';
          toggleBtn.style.border = 'none';
          toggleBtn.style.cursor = 'pointer';
          toggleBtn.style.fontSize = '16px';
          toggleBtn.style.zIndex = '10';
          toggleBtn.style.outline = 'none';
          toggleBtn.style.color = '#c8922a';
          toggleBtn.style.display = 'flex';
          toggleBtn.style.alignItems = 'center';
          toggleBtn.style.justifyContent = 'center';

          toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              toggleBtn.innerHTML = '🔒';
            } else {
              passwordInput.type = 'password';
              toggleBtn.innerHTML = '👁️';
            }
          });

          // Add right padding to password input so text doesn't overlap eye icon
          passwordInput.style.paddingRight = '45px';
          parent.appendChild(toggleBtn);
          clearInterval(interval);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      textAlign: 'center',
      marginBottom: '24px',
    }}>
      <h2 style={{
        fontFamily: 'Outfit, Inter, sans-serif',
        fontSize: '26px',
        fontWeight: 800,
        color: '#1a2e1f',
        margin: '0 0 12px 0',
      }}>
        Welcome Back
      </h2>
      <div style={{
        marginTop: '12px',
        fontSize: '13px',
      }}>
        <Link 
          href="/" 
          style={{
            color: '#c8922a',
            textDecoration: 'none',
            fontWeight: 700,
            borderBottom: '1.5px solid #c8922a',
            paddingBottom: '2px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#1a2e1f'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#c8922a'}
        >
          ← Go to Public Website
        </Link>
      </div>
    </div>
  );
};

export default BeforeLogin;
