'use client';
import React, { useState, useEffect } from 'react';
import { useLivePreviewContext } from '@payloadcms/ui';

export const CustomPreviewToggle = () => {
  const {
    isLivePreviewing,
    setIsLivePreviewing,
    url: livePreviewURL
  } = useLivePreviewContext();

  // Default to 'edit' layout mode (preview closed by default)
  const [mode, setMode] = useState<'edit' | 'split' | 'preview'>('edit');

  // Force live preview to be closed by default when mounting the edit page
  useEffect(() => {
    setIsLivePreviewing(false);
    setMode('edit');
  }, []);

  useEffect(() => {
    // Sync local state if live previewing is disabled from elsewhere
    if (!isLivePreviewing && mode !== 'edit') {
      setMode('edit');
    } else if (isLivePreviewing && mode === 'edit') {
      setMode('split');
    }
  }, [isLivePreviewing]);

  useEffect(() => {
    const applyMode = () => {
      const container = document.querySelector('.live-preview-window');
      if (container) {
        container.classList.remove('live-preview-window--mode-edit', 'live-preview-window--mode-split', 'live-preview-window--mode-preview');
        if (!isLivePreviewing || mode === 'edit') {
          container.classList.add('live-preview-window--mode-edit');
        } else {
          container.classList.add(`live-preview-window--mode-${mode}`);
        }
      }
    };

    if (!isLivePreviewing) {
      applyMode();
      return;
    }

    const timer = setTimeout(applyMode, 50);
    return () => clearTimeout(timer);
  }, [mode, isLivePreviewing]);

  if (!livePreviewURL) {
    return null;
  }

  // Toggle Full Live Preview Mode
  const handleTogglePreviewMode = () => {
    const isCurrentlyPreview = isLivePreviewing && mode === 'preview';
    if (isCurrentlyPreview) {
      setMode('edit');
      setIsLivePreviewing(false);
    } else {
      setMode('preview');
      setIsLivePreviewing(true);
    }
  };

  // Toggle Split View Mode
  const handleToggleSplitMode = () => {
    const isCurrentlySplit = isLivePreviewing && mode === 'split';
    if (isCurrentlySplit) {
      setMode('edit');
      setIsLivePreviewing(false);
    } else {
      setMode('split');
      setIsLivePreviewing(true);
    }
  };

  const getBtnStyle = (active: boolean) => ({
    background: active ? '#1a2e1f' : '#ffffff',
    color: active ? '#ffffff' : '#1a2e1f',
    border: 'none',
    padding: '0 14px',
    height: '100%',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  });

  const isActiveSplit = isLivePreviewing && mode === 'split';
  const isActivePreview = isLivePreviewing && mode === 'preview';

  return (
    <div className="custom-preview-btn-group" style={{ 
      display: 'inline-flex', 
      alignItems: 'center',
      border: '1px solid #cbd5e1',
      borderRadius: '6px',
      overflow: 'hidden',
      height: '32px',
      marginRight: '8px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      {/* Eye icon toggle button (Full Live View) */}
      <button 
        type="button" 
        onClick={handleTogglePreviewMode}
        title={isActivePreview ? "Close Live View" : "Open Live View (Full Screen)"}
        style={getBtnStyle(isActivePreview)}
      >
        {isActivePreview ? (
          // Normal Eye Icon (Active)
          <svg stroke="currentColor" fill="none" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        ) : (
          // Slashed Eye Icon (Inactive - crossed out)
          <svg stroke="currentColor" fill="none" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="14" width="14" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        )}
      </button>

      {/* Split button */}
      <button 
        type="button" 
        onClick={handleToggleSplitMode}
        style={{
          ...getBtnStyle(isActiveSplit),
          borderLeft: '1px solid #cbd5e1',
        }}
      >
        <svg stroke="currentColor" fill="none" strokeWidth="2.2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="13" width="13" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="12" y1="3" x2="12" y2="21"></line>
        </svg>
        Split
      </button>
    </div>
  );
};

export default CustomPreviewToggle;
