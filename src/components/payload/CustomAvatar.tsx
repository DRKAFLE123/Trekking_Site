'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@payloadcms/ui';
import { useRouter } from 'next/navigation';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaLock, 
  FaChevronDown, 
  FaCamera, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimes, 
  FaCog
} from 'react-icons/fa';

interface Media {
  id: string;
  url: string;
  alt?: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string | Media;
}

export const CustomAvatar: React.FC = () => {
  const { user, logOut } = useAuth<UserType>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Instant upload loading state
  const [avatarLoading, setAvatarLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch avatar image if it's an ID (string) rather than a populated object
  useEffect(() => {
    if (!user || !user.avatar) {
      setAvatarUrl(null);
      return;
    }

    if (typeof user.avatar === 'object' && user.avatar !== null && 'url' in user.avatar) {
      setAvatarUrl(user.avatar.url);
    } else if (typeof user.avatar === 'string') {
      // Fetch media object from Payload REST API
      fetch(`/api/media/${user.avatar}`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch media');
          return res.json();
        })
        .then((data) => {
          if (data && data.url) {
            setAvatarUrl(data.url);
          }
        })
        .catch((err) => {
          console.error('Error fetching user avatar:', err);
          setAvatarUrl(null);
        });
    }
  }, [user]);

  if (!user) return null;

  const navigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/admin/login';
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.message || 'Failed to update password');
      }

      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(false);
      }, 1500);

    } catch (err: any) {
      setPasswordError(err.message || 'An error occurred while updating the password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Instant photo upload when file is selected
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);

    try {
      // 1. Upload file to media collection
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', `${user.name}'s Profile Avatar`);

      const mediaRes = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (!mediaRes.ok) {
        const errData = await mediaRes.json().catch(() => ({}));
        throw new Error(errData.errors?.[0]?.message || 'Failed to upload image.');
      }

      const mediaDoc = await mediaRes.json();
      const mediaId = mediaDoc.doc.id;

      // 2. Link media document to user's avatar field
      const userRes = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar: mediaId,
        }),
      });

      if (!userRes.ok) {
        throw new Error('Failed to update user profile picture.');
      }

      // Reload page immediately to reflect the new photo across header and sidebar
      window.location.reload();

    } catch (err: any) {
      alert(err.message || 'An error occurred while uploading the photo.');
      setAvatarLoading(false);
    }
  };

  const getInitials = () => {
    if (user.name) {
      const parts = user.name.split(' ');
      return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'admin': return 'Administrator';
      case 'editor': return 'Editor';
      case 'viewer': return 'Viewer';
      default: return user.role;
    }
  };

  return (
    <div 
      className="profile-dropdown-container" 
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden File Input for Instant Upload */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Trigger button */}
      <button 
        type="button"
        className="profile-dropdown-trigger"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        aria-label="User profile menu"
      >
        <div className="profile-dropdown-trigger__avatar-wrap">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={user.name} 
              className="profile-dropdown-trigger__avatar"
            />
          ) : (
            <div className="profile-dropdown-trigger__avatar-fallback">
              {getInitials()}
            </div>
          )}
        </div>
        <span className="profile-dropdown-trigger__name">{user.name || 'User'}</span>
        <FaChevronDown className={`profile-dropdown-trigger__chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown-menu">
          {/* User Profile Summary Card */}
          <div className="profile-dropdown-menu__header">
            <div className="profile-dropdown-menu__header-avatar-wrap">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={user.name} 
                  className="profile-dropdown-menu__header-avatar"
                />
              ) : (
                <div className="profile-dropdown-menu__header-avatar-fallback">
                  {getInitials()}
                </div>
              )}
              
              {/* Facebook-like Camera Icon Overlay inside Menu Header */}
              <span
                className="profile-avatar-camera-overlay menu-header"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                title="Upload Profile Picture"
                role="button"
                aria-label="Upload Profile Picture"
              >
                {avatarLoading ? <FaSpinner className="spinner" /> : <FaCamera />}
              </span>
            </div>
            <div className="profile-dropdown-menu__header-info">
              <h4 className="profile-dropdown-menu__header-name">{user.name}</h4>
              <p className="profile-dropdown-menu__header-email">{user.email}</p>
              <span className={`profile-dropdown-menu__role-badge ${user.role}`}>
                {getRoleLabel()}
              </span>
            </div>
          </div>

          <div className="profile-dropdown-menu__divider" />

          {/* Action Links */}
          <div className="profile-dropdown-menu__body">
            <button 
              type="button" 
              className="profile-dropdown-menu__item"
              onClick={() => {
                setIsOpen(false);
                setIsPasswordModalOpen(true);
              }}
            >
              <FaLock className="profile-dropdown-menu__item-icon" />
              <span>Change Password</span>
            </button>

            <button 
              type="button" 
              className="profile-dropdown-menu__item"
              onClick={() => navigate(`/admin/collections/users/${user.id}`)}
            >
              <FaUser className="profile-dropdown-menu__item-icon" />
              <span>Profile & Password</span>
            </button>

            <button 
              type="button" 
              className="profile-dropdown-menu__item"
              onClick={() => navigate('/admin/account')}
            >
              <FaCog className="profile-dropdown-menu__item-icon" />
              <span>Role & Permissions</span>
            </button>
          </div>

          <div className="profile-dropdown-menu__divider" />

          <div className="profile-dropdown-menu__footer">
            <button 
              type="button" 
              className="profile-dropdown-menu__item sign-out"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="profile-dropdown-menu__item-icon" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal__header">
              <h3>Change Account Password</h3>
              <button 
                type="button" 
                className="profile-modal__close-btn"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="profile-modal__form">
              {passwordError && (
                <div className="profile-modal__alert error">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="profile-modal__alert success">
                  <FaCheckCircle className="alert-icon" />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <div className="profile-modal__form-group">
                <label htmlFor="new-password">New Password</label>
                <input 
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  disabled={passwordLoading || passwordSuccess}
                />
              </div>

              <div className="profile-modal__form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input 
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  disabled={passwordLoading || passwordSuccess}
                />
              </div>

              <div className="profile-modal__actions">
                <button 
                  type="button" 
                  className="profile-modal__btn cancel"
                  onClick={() => setIsPasswordModalOpen(false)}
                  disabled={passwordLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="profile-modal__btn submit"
                  disabled={passwordLoading || passwordSuccess}
                >
                  {passwordLoading ? (
                    <>
                      <FaSpinner className="spinner" />
                      Updating...
                    </>
                  ) : 'Save Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomAvatar;
