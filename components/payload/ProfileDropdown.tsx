'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@payloadcms/ui';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaLock, 
  FaChevronDown, 
  FaCamera, 
  FaSpinner, 
  FaCheckCircle, 
  FaTimes, 
  FaUpload 
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

export const ProfileDropdown: React.FC = () => {
  const { user, logOut } = useAuth<UserType>();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // Modals state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  
  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  // Avatar upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

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

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback redirect
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
      
      // Auto-close modal after 1.5 seconds
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setAvatarLoading(true);
    setAvatarError(null);
    setAvatarSuccess(false);

    try {
      // 1. Upload file to media collection
      const formData = new FormData();
      formData.append('file', selectedFile);
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

      setAvatarSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Reload page to refresh headers, sidebar, and update the session state globally
      setTimeout(() => {
        setIsAvatarModalOpen(false);
        setAvatarSuccess(false);
        window.location.reload();
      }, 1500);

    } catch (err: any) {
      setAvatarError(err.message || 'An error occurred while uploading.');
    } finally {
      setAvatarLoading(false);
    }
  };

  // Get nice display name or initials
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
          <span className="profile-dropdown-trigger__badge"></span>
        </div>
        <span className="profile-dropdown-trigger__name">{user.name || 'User'}</span>
        <FaChevronDown className={`profile-dropdown-trigger__chevron ${isOpen ? 'open' : ''}`} />
      </button>

      {/* Profile Dropdown Menu */}
      {isOpen && (
        <div className="profile-dropdown-menu">
          {/* User Profile Summary Card */}
          <div className="profile-dropdown-menu__header">
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
                setIsAvatarModalOpen(true);
              }}
            >
              <FaCamera className="profile-dropdown-menu__item-icon" />
              <span>Update Profile Image</span>
            </button>

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

      {/* Upload Avatar Modal */}
      {isAvatarModalOpen && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="profile-modal__header">
              <h3>Update Profile Image</h3>
              <button 
                type="button" 
                className="profile-modal__close-btn"
                onClick={() => setIsAvatarModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAvatarSubmit} className="profile-modal__form">
              {avatarError && (
                <div className="profile-modal__alert error">
                  {avatarError}
                </div>
              )}

              {avatarSuccess && (
                <div className="profile-modal__alert success">
                  <FaCheckCircle className="alert-icon" />
                  <span>Profile image updated! Refreshing...</span>
                </div>
              )}

              <div className="profile-modal__avatar-preview-container">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="profile-modal__avatar-preview"
                  />
                ) : avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={user.name} 
                    className="profile-modal__avatar-preview"
                  />
                ) : (
                  <div className="profile-modal__avatar-preview-fallback">
                    {getInitials()}
                  </div>
                )}
                
                <button
                  type="button"
                  className="profile-modal__avatar-upload-trigger"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading || avatarSuccess}
                >
                  <FaCamera />
                </button>
              </div>

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />

              <div className="profile-modal__upload-hint">
                Click the camera icon to choose a file. Standard formats supported (JPEG, PNG, WEBP).
              </div>

              <div className="profile-modal__actions">
                <button 
                  type="button" 
                  className="profile-modal__btn cancel"
                  onClick={() => setIsAvatarModalOpen(false)}
                  disabled={avatarLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="profile-modal__btn submit"
                  disabled={!selectedFile || avatarLoading || avatarSuccess}
                >
                  {avatarLoading ? (
                    <>
                      <FaSpinner className="spinner" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload style={{ marginRight: '8px' }} />
                      Upload Picture
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
