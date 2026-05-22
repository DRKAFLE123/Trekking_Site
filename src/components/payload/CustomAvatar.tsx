'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';

export const CustomAvatar = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const name = user?.name || user?.email || 'Admin';
  const email = user?.email || '';
  const role = (user as any)?.role || 'admin';
  const initial = name[0].toUpperCase();

  return (
    <div className="profile-dropdown-container" ref={containerRef}>
      {/* Trigger button */}
      <button
        className="profile-dropdown-trigger"
        onClick={() => setOpen((o) => !o)}
        title={name}
      >
        <div className="profile-dropdown-trigger__avatar-wrap">
          <span className="profile-dropdown-trigger__avatar-fallback">{initial}</span>
          <span className="profile-dropdown-trigger__badge" />
        </div>
        <span className="profile-dropdown-trigger__name">{name}</span>
        <span className={`profile-dropdown-trigger__chevron${open ? ' open' : ''}`}>▼</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="profile-dropdown-menu">
          {/* Header with user info */}
          <div className="profile-dropdown-menu__header">
            <span className="profile-dropdown-menu__header-avatar-fallback">{initial}</span>
            <div className="profile-dropdown-menu__header-info">
              <p className="profile-dropdown-menu__header-name">{name}</p>
              <p className="profile-dropdown-menu__header-email">{email}</p>
              <span className={`profile-dropdown-menu__role-badge ${role}`}>{role}</span>
            </div>
          </div>

          <div className="profile-dropdown-menu__divider" />

          {/* Nav items */}
          <div className="profile-dropdown-menu__body">
            <button
              className="profile-dropdown-menu__item"
              onClick={() => navigate(`/admin/collections/users/${user?.id}`)}
            >
              <span className="profile-dropdown-menu__item-icon">👤</span>
              Edit Profile
            </button>
            <button
              className="profile-dropdown-menu__item"
              onClick={() => navigate('/admin/account')}
            >
              <span className="profile-dropdown-menu__item-icon">⚙️</span>
              Account Settings
            </button>
          </div>

          <div className="profile-dropdown-menu__divider" />

          {/* Logout */}
          <div className="profile-dropdown-menu__footer">
            <button
              className="profile-dropdown-menu__item sign-out"
              onClick={() => { setOpen(false); logOut(); }}
            >
              <span className="profile-dropdown-menu__item-icon">🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAvatar;
