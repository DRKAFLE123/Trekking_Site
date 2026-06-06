'use client';

import React, { useEffect, useState } from 'react';

interface TrekListItem {
  id: string;
  title: string;
}

export const ManageTopTreksButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data states
  const [navbarSettingsDoc, setNavbarSettingsDoc] = useState<any>(null);
  const [featuredTreks, setFeaturedTreks] = useState<TrekListItem[]>([]);
  const [allTreks, setAllTreks] = useState<any[]>([]);
  
  // Search state for picking new treks
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Load navbar settings and all treks
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch all treks for picker
      const treksRes = await fetch('/api/treks?limit=250&select=title,slug');
      if (!treksRes.ok) throw new Error('Failed to fetch treks list');
      const treksData = await treksRes.json();
      const treksList = treksData.docs || [];
      setAllTreks(treksList);

      // 2. Fetch active Navbar Settings
      const navRes = await fetch('/api/navbarSettings');
      if (!navRes.ok) throw new Error('Failed to fetch navbar settings');
      const navData = await navRes.json();
      
      if (navData && Array.isArray(navData.docs) && navData.docs.length > 0) {
        const doc = navData.docs[0];
        setNavbarSettingsDoc(doc);
        
        // Find treks-list dropdown item
        const treksItem = doc.navigationMenu?.find(
          (item: any) => item.dropdownStyle === 'treks-list'
        );
        
        if (treksItem) {
          const rawFeatured = treksItem.featuredTreks || [];
          const mappedList = rawFeatured.map((t: any) => {
            const id = typeof t === 'object' && t !== null ? t.id : t;
            // Resolve title from fetched treks if possible
            const resolvedTrek = treksList.find((item: any) => item.id === id);
            return {
              id,
              title: resolvedTrek ? resolvedTrek.title : (typeof t === 'object' ? t.title : `Trek ID: ${id}`),
            };
          });
          setFeaturedTreks(mappedList);
        } else {
          setError('No "Treks List" Megamenu dropdown found in Navbar Settings. Please add one first.');
        }
      } else {
        setError('Navbar Settings document not found. Please create one under Global Settings first.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Handle Save
  const handleSave = async () => {
    if (!navbarSettingsDoc) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Re-map the navigation menu
      const updatedMenu = navbarSettingsDoc.navigationMenu.map((item: any) => {
        if (item.dropdownStyle === 'treks-list') {
          return {
            ...item,
            featuredTreks: featuredTreks.map((t) => t.id),
          };
        }
        // Safely map other sub-menu featuredTreks to IDs to keep payload clean
        if (Array.isArray(item.featuredTreks)) {
          return {
            ...item,
            featuredTreks: item.featuredTreks.map((t: any) =>
              typeof t === 'object' && t !== null ? t.id : t
            ),
          };
        }
        return item;
      });

      const res = await fetch(`/api/navbarSettings/${navbarSettingsDoc.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          navigationMenu: updatedMenu,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.errors?.[0]?.message || 'Failed to save settings.');
      }

      setSuccess('Top treks reordered and saved successfully!');
      // Keep modal open briefly to show success, then close or reload
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
        window.location.reload(); // Refresh to update Admin state
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const list = [...featuredTreks];
    const [removed] = list.splice(draggedIndex, 1);
    list.splice(targetIndex, 0, removed);
    setFeaturedTreks(list);
    setDraggedIndex(null);
  };

  // Move up/down handlers
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= featuredTreks.length) return;

    const list = [...featuredTreks];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    setFeaturedTreks(list);
  };

  // Remove trek from featured list
  const removeTrek = (id: string) => {
    setFeaturedTreks(featuredTreks.filter((t) => t.id !== id));
  };

  // Add trek to featured list
  const addTrek = (trek: any) => {
    if (featuredTreks.some((t) => t.id === trek.id)) return;
    setFeaturedTreks([...featuredTreks, { id: trek.id, title: trek.title }]);
    setSearchQuery('');
  };

  // Get available treks that are not already selected
  const availableTreks = allTreks.filter(
    (t) =>
      !featuredTreks.some((ft) => ft.id === t.id) &&
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ marginBottom: '20px', marginTop: '10px' }}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        style={{
          background: 'linear-gradient(135deg, #1a2e1f 0%, #101c13 100%)',
          color: '#ffffff',
          border: '1.5px solid rgba(200, 146, 42, 0.4)',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '13px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'Inter, system-ui, sans-serif',
          boxShadow: '0 4px 10px rgba(26, 46, 31, 0.15)',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(200, 146, 42, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(26, 46, 31, 0.15)';
        }}
      >
        <span style={{ fontSize: '15px' }}>🏆</span>
        <span>Manage Top 15 Bestsellers</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
          onClick={() => {
            if (!saving) setIsOpen(false);
          }}
        >
          {/* Modal Container */}
          <div
            style={{
              background: '#162219',
              border: '1.5px solid rgba(200, 146, 42, 0.35)',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              color: '#ffffff',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#c8922a' }}>🏆</span> Curate Top 15 Bestseller Treks
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Select, remove, and reorder treks. The first 10 show by default; expands to 15 when clicking &quot;Show More&quot;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={saving}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
              >
                &times;
              </button>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {error && (
                <div style={{ padding: '12px 16px', background: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '6px', color: '#991b1b', fontSize: '13px', fontWeight: 600 }}>
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div style={{ padding: '12px 16px', background: '#ecfdf5', borderLeft: '4px solid #10b981', borderRadius: '6px', color: '#065f46', fontSize: '13px', fontWeight: 600 }}>
                  ✅ {success}
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                  ⏳ Loading Top Trek Settings...
                </div>
              ) : (
                <>
                  {/* Search Picker Section */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c8922a', marginBottom: '8px' }}>
                      🔍 Add Trek to Top List
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Type trek name to search and add..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1.5px solid rgba(255, 255, 255, 0.1)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          color: '#ffffff',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = '#c8922a')}
                        onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                      />
                      
                      {searchQuery && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '44px',
                            left: 0,
                            right: 0,
                            background: '#1c2d21',
                            border: '1px solid rgba(200, 146, 42, 0.3)',
                            borderRadius: '8px',
                            maxHeight: '180px',
                            overflowY: 'auto',
                            zIndex: 10,
                            boxShadow: '0 10px 15px rgba(0,0,0,0.4)',
                          }}
                        >
                          {availableTreks.length > 0 ? (
                            availableTreks.map((trek) => (
                              <div
                                key={trek.id}
                                onClick={() => addTrek(trek)}
                                style={{
                                  padding: '10px 14px',
                                  cursor: 'pointer',
                                  fontSize: '13px',
                                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                                  transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200, 146, 42, 0.15)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                ➕ {trek.title}
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                              No unselected treks matching &quot;{searchQuery}&quot;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trek List Reorder Section */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c8922a' }}>
                        📋 Sorted Bestsellers
                      </label>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: featuredTreks.length > 15 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: featuredTreks.length > 15 ? '#f87171' : 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {featuredTreks.length} / 15 selected
                      </span>
                    </div>

                    {featuredTreks.length > 15 && (
                      <div style={{ fontSize: '11px', color: '#f87171', marginBottom: '10px', fontWeight: 600 }}>
                        ⚠️ Warning: You have selected {featuredTreks.length} treks. Only the first 15 will be displayed in the dropdown menu.
                      </div>
                    )}

                    {featuredTreks.length === 0 ? (
                      <div style={{ padding: '30px', border: '1.5px dashed rgba(255,255,255,0.1)', borderRadius: '12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
                        No treks configured. Select treks above to showcase them.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {featuredTreks.map((trek, index) => (
                          <div
                            key={trek.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '10px 14px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              borderRadius: '8px',
                              cursor: 'grab',
                              transition: 'all 0.2s',
                              userSelect: 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                              e.currentTarget.style.borderColor = 'rgba(200, 146, 42, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                            }}
                          >
                            {/* Drag handle & Trek title */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                              <span style={{ color: 'rgba(255,255,255,0.3)', cursor: 'grab', fontSize: '14px' }}>☰</span>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: '#c8922a', minWidth: '20px' }}>
                                #{index + 1}
                              </span>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {trek.title}
                              </span>
                            </div>

                            {/* Controls */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Reorder arrows */}
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={(e) => { e.stopPropagation(); moveItem(index, 'up'); }}
                                style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  border: 'none',
                                  color: index === 0 ? 'rgba(255,255,255,0.1)' : '#ffffff',
                                  padding: '4px 6px',
                                  borderRadius: '4px',
                                  cursor: index === 0 ? 'not-allowed' : 'pointer',
                                  fontSize: '11px',
                                }}
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={index === featuredTreks.length - 1}
                                onClick={(e) => { e.stopPropagation(); moveItem(index, 'down'); }}
                                style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  border: 'none',
                                  color: index === featuredTreks.length - 1 ? 'rgba(255,255,255,0.1)' : '#ffffff',
                                  padding: '4px 6px',
                                  borderRadius: '4px',
                                  cursor: index === featuredTreks.length - 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '11px',
                                }}
                              >
                                ▼
                              </button>
                              
                              {/* Divider */}
                              <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />

                              {/* Remove button */}
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeTrek(trek.id); }}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: 'none',
                                  color: '#f87171',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  transition: 'background 0.2s',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                background: 'rgba(0, 0, 0, 0.15)',
              }}
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={saving}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading || !navbarSettingsDoc}
                style={{
                  background: 'linear-gradient(135deg, #c8922a 0%, #b07c1e 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: (saving || loading || !navbarSettingsDoc) ? 'not-allowed' : 'pointer',
                  opacity: (saving || loading || !navbarSettingsDoc) ? 0.6 : 1,
                  boxShadow: '0 4px 6px rgba(200, 146, 42, 0.15)',
                  transition: 'transform 0.15s, opacity 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (!saving && !loading && navbarSettingsDoc) {
                    e.currentTarget.style.transform = 'translateY(-0.5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving && !loading && navbarSettingsDoc) {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {saving ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
