'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@payloadcms/ui';
import { AdminDeleteInterceptor } from './AdminDeleteInterceptor';

export const BeforeNav = () => {
  const pathname = usePathname();
  const isActive = pathname === '/admin' || pathname === '/admin/';
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth<any>();
  const isSuperAdminOrAdmin = user?.role === 'admin';

  // Robustly find the actual sidebar element no matter what class
  // Payload uses for it (it differs slightly between versions). We try
  // a list of known selectors, then fall back to "any direct <nav> or
  // <aside> child of .template-default that isn't the toggler strip".
  const findSidebar = (): HTMLElement | null => {
    if (typeof document === 'undefined') return null;
    const candidates = [
      'aside.nav',
      'nav.nav',
      '.template-default__nav',
      'aside.template-default__nav',
      'nav.template-default__nav',
      '.payload-default-nav',
      '.payload__nav',
      '#nav',
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (el && !el.classList.contains('template-default__nav-toggler-wrapper')) return el;
    }
    // Fallback: direct nav/aside child of .template-default that is not the toggler
    const wrap = document.querySelector('.template-default');
    if (wrap) {
      const kids = Array.from(wrap.children) as HTMLElement[];
      for (const k of kids) {
        const tag = k.tagName.toLowerCase();
        if ((tag === 'aside' || tag === 'nav') && !k.id?.includes('nav-toggler') && !k.className?.includes('nav-toggler')) {
          return k;
        }
      }
    }
    return null;
  };

  // Apply collapsed state by directly setting inline styles on the
  // sidebar element. Inline styles override any CSS, so this is
  // bulletproof regardless of which selectors Payload uses internally.
  const applyCollapsedState = (isCollapsed: boolean) => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('nav-collapsed', isCollapsed);
    const wrapper = document.querySelector('.template-default') as HTMLElement | null;
    if (wrapper) {
      if (isCollapsed) {
        wrapper.setAttribute('data-nav-collapsed', 'true');
        wrapper.classList.remove('template-default--nav-open');
      } else {
        wrapper.removeAttribute('data-nav-collapsed');
        wrapper.classList.add('template-default--nav-open');
      }
    }
    const sidebar = findSidebar();
    if (sidebar) {
      if (isCollapsed) {
        sidebar.style.width = '0';
        sidebar.style.minWidth = '0';
        sidebar.style.maxWidth = '0';
        sidebar.style.overflow = 'hidden';
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.opacity = '0';
        sidebar.style.pointerEvents = 'none';
        sidebar.style.borderRight = '0';
        sidebar.style.padding = '0';
        sidebar.style.margin = '0';
        sidebar.style.transition = 'width 0.25s ease, transform 0.25s ease, opacity 0.2s ease';
      } else {
        sidebar.style.width = '';
        sidebar.style.minWidth = '';
        sidebar.style.maxWidth = '';
        sidebar.style.overflow = '';
        sidebar.style.transform = '';
        sidebar.style.opacity = '';
        sidebar.style.pointerEvents = '';
        sidebar.style.borderRight = '';
        sidebar.style.padding = '';
        sidebar.style.margin = '';
      }
    }
  };

  // On mount: mark mounted (so the portal can render), clear any stale
  // localStorage flag from previous testing, mirror Payload's current
  // class state into our local "collapsed" flag, and watch the wrapper
  // for class changes so the icon stays in sync if anything else flips
  // the nav (e.g. Payload's own hamburger inside the toggler strip).
  useEffect(() => {
    setMounted(true);
    try { window.localStorage.removeItem('nature-nav-collapsed'); } catch {}
    const wrap = document.querySelector('.template-default');
    const sync = () => {
      const w = document.querySelector('.template-default');
      if (w) setCollapsed(!w.classList.contains('template-default--nav-open'));
    };
    sync();
    const observer = new MutationObserver(sync);
    if (wrap) observer.observe(wrap, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Find Payload v3's own built-in nav hamburger button (which already
  // knows how to do the collapse correctly via Payload's own state).
  const findPayloadNavToggle = (): HTMLButtonElement | null => {
    if (typeof document === 'undefined') return null;
    const container =
      document.querySelector('.template-default__nav-toggler-container') ||
      document.querySelector('.template-default__nav-toggler-wrapper');
    if (!container) return null;
    // The hamburger inside the strip is a real <button>; click it.
    return (container.querySelector('button') as HTMLButtonElement | null);
  };

  const toggleCollapse = () => {
    // Preferred path: trigger Payload's OWN nav toggle button. Payload then
    // flips `template-default--nav-open` and adjusts the layout itself, so
    // the sidebar truly collapses (not just visually overlapped).
    const payloadBtn = findPayloadNavToggle();
    if (payloadBtn) {
      payloadBtn.click();
      // After Payload's state settles, sync our local "collapsed" flag from the
      // wrapper's class — `template-default--nav-open` present = expanded.
      window.setTimeout(() => {
        const wrap = document.querySelector('.template-default');
        const nowCollapsed = wrap ? !wrap.classList.contains('template-default--nav-open') : !collapsed;
        setCollapsed(nowCollapsed);
        document.body.classList.toggle('nav-collapsed', nowCollapsed);
        try { window.localStorage.setItem('nature-nav-collapsed', nowCollapsed ? '1' : '0'); } catch {}
      }, 60);
      return;
    }

    // Fallback path: previous inline-style approach if for some reason the
    // Payload toggle button can't be found in the DOM.
    const next = !collapsed;
    setCollapsed(next);
    applyCollapsedState(next);
    try { window.localStorage.setItem('nature-nav-collapsed', next ? '1' : '0'); } catch {}
  };

  // The button itself — rendered via a portal to document.body below so
  // it never lives inside the nav (and therefore stays visible even when
  // the nav is collapsed and would otherwise hide its children).
  const collapseButton = (
    <button
      type="button"
      onClick={toggleCollapse}
      aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      className="nature-nav-collapse-toggle"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ display: 'block', transition: 'transform 0.25s ease' }}
      >
        {collapsed ? (
          // X icon (close / "click to open nav")
          <g>
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </g>
        ) : (
          // Hamburger icon (three lines / "click to close nav")
          <g>
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </g>
        )}
      </svg>
    </button>
  );

  return (
    <>
      <AdminDeleteInterceptor />
      {/* Hide edit and api tabs at top right for non-admin roles */}
      {mounted && !isSuperAdminOrAdmin && (
        <style dangerouslySetInnerHTML={{ __html: `
          .doc-tab,
          .doc-tabs,
          [class*="doc-tab"],
          [class*="doc-header__actions"] {
            display: none !important;
          }
        `}} />
      )}

      {/* Portal the button to document.body so it always stays visible,
          even when Payload collapses the nav (which would otherwise hide
          all descendants of the nav, including children of this component). */}
      {mounted && typeof document !== 'undefined' && createPortal(collapseButton, document.body)}

      <div style={{
      padding: '0 12px',
      marginBottom: '4px',
      marginTop: '8px'
    }}>
      <Link
        href="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '6px 12px',
          borderRadius: '6px',
          textDecoration: 'none',
          color: isActive ? '#c8922a' : '#e2f4e8',
          background: isActive ? 'rgba(200, 146, 42, 0.15)' : 'transparent',
          border: isActive ? '1.5px solid rgba(200, 146, 42, 0.3)' : '1px solid transparent',
          fontWeight: isActive ? '800' : '600',
          fontSize: '12px',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = '#ffffff';
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#e2f4e8';
          }
        }}
      >
        <span style={{ fontSize: '14px' }}>📊</span>
        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.02em' }}>Dashboard</span>
      </Link>
      
      {/* Visual divider separator */}
      <div style={{
        height: '1px',
        background: 'rgba(255, 255, 255, 0.08)',
        marginTop: '8px',
        marginBottom: '4px'
      }} />
    </div>
    </>
  );
};

export default BeforeNav;
