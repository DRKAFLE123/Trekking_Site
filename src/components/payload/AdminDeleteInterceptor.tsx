'use client';
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface StyleContext {
  modalRoot: Element;
  confirmBtn: HTMLButtonElement;
  cancelBtn: HTMLButtonElement | null;
  originalStyles: {
    display: string;
    visibility: string;
    opacity: string;
    pointerEvents: string;
  };
  hiddenOverlays: { el: HTMLElement; disp: string }[];
}

export function AdminDeleteInterceptor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isBulk, setIsBulk] = useState(false);
  const [itemCount, setItemCount] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  const contextRef = useRef<StyleContext | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;

    // Track modals we've already processed to avoid double-triggering
    const processedModals = new WeakSet<Element>();

    function findModalRoot(el: Element): Element | null {
      // Walk up from the Confirm button to find the topmost new overlay
      // Payload appends modals to document.body, so we look for a direct
      // child of body that contains our target button
      let node: Element | null = el;
      while (node && node.parentElement) {
        if (node.parentElement === document.body) {
          // Prevent matching the main app layout as a modal root container
          if (
            node.classList.contains('template-default') ||
            node.classList.contains('template-minimal') ||
            node.classList.contains('app') ||
            node.id === 'app' ||
            node.tagName.toLowerCase() === 'main'
          ) {
            return null;
          }
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    function checkIsBulk(modalEl: Element): { isBulk: boolean; count: string } {
      const text = modalEl.textContent || '';
      
      // Bulk delete: delete 2 selected items
      const bulkMatch = text.match(/(\d+)\s+selected\s+([a-zA-Z]+)/i);
      if (bulkMatch) {
        return { isBulk: true, count: `${bulkMatch[1]} ${bulkMatch[2]}(s)` };
      }
      
      const match = text.match(/(\d+)\s+(departure|trek|booking|faq|testimonial|team|blog|region|media|item|record)/i);
      if (match && parseInt(match[1]) > 1) {
        return { isBulk: true, count: `${match[1]} ${match[2]}(s)` };
      }
      
      return { isBulk: false, count: '' };
    }

    function handleModal(confirmBtn: HTMLButtonElement, modalRoot: Element) {
      if (processedModals.has(modalRoot)) return;
      processedModals.add(modalRoot);

      // Parse metadata from native modal before hiding
      const details = checkIsBulk(modalRoot);

      // Find the cancel button too before hiding
      const allBtns = Array.from(modalRoot.querySelectorAll('button'));
      const cancelBtn = allBtns.find(
        (b) => b !== confirmBtn && (
          b.textContent?.trim().toUpperCase() === 'CANCEL' ||
          b.textContent?.toLowerCase().includes('cancel')
        )
      ) as HTMLButtonElement | undefined;

      // Hide the modal root immediately so the broken layout is invisible
      const originalDisplay = (modalRoot as HTMLElement).style.display;
      const originalVisibility = (modalRoot as HTMLElement).style.visibility;
      const originalOpacity = (modalRoot as HTMLElement).style.opacity;
      const originalPointerEvents = (modalRoot as HTMLElement).style.pointerEvents;

      (modalRoot as HTMLElement).style.setProperty('display', 'none', 'important');
      (modalRoot as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
      (modalRoot as HTMLElement).style.setProperty('opacity', '0', 'important');
      (modalRoot as HTMLElement).style.setProperty('pointer-events', 'none', 'important');

      // Also look for body-level overlay elements and hide them
      const overlays = document.querySelectorAll(
        '[class*="modal"], [class*="overlay"], [class*="backdrop"], [class*="confirmation"]'
      );
      const hiddenOverlays: { el: HTMLElement; disp: string }[] = [];
      overlays.forEach((el) => {
        // Only hide if they contain the confirm button
        if (el.contains(confirmBtn) || el === modalRoot) {
          const htmlEl = el as HTMLElement;
          hiddenOverlays.push({ el: htmlEl, disp: htmlEl.style.display });
          htmlEl.style.setProperty('display', 'none', 'important');
        }
      });

      // Save context in ref
      contextRef.current = {
        modalRoot,
        confirmBtn,
        cancelBtn: cancelBtn || null,
        originalStyles: {
          display: originalDisplay,
          visibility: originalVisibility,
          opacity: originalOpacity,
          pointerEvents: originalPointerEvents,
        },
        hiddenOverlays,
      };

      // Set React state to render the custom modal
      setIsBulk(details.isBulk);
      setItemCount(details.count);
      setIsOpen(true);
    }

    const observer = new MutationObserver(() => {
      // Look for a "CONFIRM" button that appears inside a delete modal
      const allButtons = Array.from(
        document.querySelectorAll<HTMLButtonElement>('button')
      );

      for (const btn of allButtons) {
        const btnText = btn.textContent?.trim().toUpperCase() ?? '';
        if (
          (btnText === 'CONFIRM' || btnText === 'YES') &&
          !processedModals.has(btn)
        ) {
          // Verify it's inside a delete-related context by checking nearby text
          const container = btn.closest(
            '[class*="modal"], [class*="confirmation"], [class*="delete"]'
          ) || btn.parentElement;

          if (!container) continue;

          const contextText = container.textContent?.toLowerCase() ?? '';
          if (
            contextText.includes('delete') ||
            contextText.includes('confirm') ||
            contextText.includes('departure') ||
            contextText.includes('you are about to')
          ) {
            processedModals.add(btn);
            const modalRoot = findModalRoot(container);
            if (modalRoot) {
              handleModal(btn, modalRoot);
            }
            break;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleConfirm = () => {
    const ctx = contextRef.current;
    if (!ctx) {
      setIsOpen(false);
      return;
    }

    const { modalRoot, confirmBtn, hiddenOverlays, originalStyles } = ctx;

    // Restore display properties briefly so the event handler runs properly
    (modalRoot as HTMLElement).style.setProperty('display', originalStyles.display || 'block', 'important');
    hiddenOverlays.forEach(({ el, disp }) => {
      el.style.setProperty('display', disp || 'block', 'important');
    });

    // Keep visually invisible
    (modalRoot as HTMLElement).style.setProperty('opacity', '0', 'important');
    (modalRoot as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
    hiddenOverlays.forEach(({ el }) => {
      el.style.setProperty('opacity', '0', 'important');
    });

    // Make the native button clickable
    confirmBtn.style.setProperty('pointer-events', 'auto', 'important');
    confirmBtn.style.setProperty('opacity', '1', 'important');
    confirmBtn.style.setProperty('position', 'fixed', 'important');
    confirmBtn.style.setProperty('top', '-9999px', 'important');
    confirmBtn.style.setProperty('left', '-9999px', 'important');

    confirmBtn.click();

    // Reset state
    contextRef.current = null;
    setIsOpen(false);
  };

  const handleCancel = () => {
    const ctx = contextRef.current;
    if (!ctx) {
      setIsOpen(false);
      return;
    }

    const { modalRoot, cancelBtn, hiddenOverlays, originalStyles } = ctx;

    // Restore styles back to their original state
    (modalRoot as HTMLElement).style.display = originalStyles.display;
    (modalRoot as HTMLElement).style.visibility = originalStyles.visibility;
    (modalRoot as HTMLElement).style.opacity = originalStyles.opacity;
    (modalRoot as HTMLElement).style.pointerEvents = originalStyles.pointerEvents;
    
    hiddenOverlays.forEach(({ el, disp }) => {
      el.style.display = disp;
    });

    // Trigger native cancel button to let Payload close its state correctly
    cancelBtn?.click();

    // Reset state
    contextRef.current = null;
    setIsOpen(false);
  };

  if (!isOpen || !isMounted) return null;

  const animationStyles = `
    @keyframes purgeBackdropFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes purgeCardSlideUp {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .admin-purge-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(15, 23, 42, 0.35) !important; /* Clean slate-tinted backdrop */
      backdrop-filter: blur(5px) !important; /* Glassmorphic backdrop blur */
      -webkit-backdrop-filter: blur(5px) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 999999 !important;
      animation: purgeBackdropFadeIn 180ms ease-out forwards !important;
    }
    .admin-purge-card {
      background: #ffffff !important;
      border-radius: 16px !important; /* Rounded corners */
      border: 3px solid #10b981 !important; /* Vibrant Green border matching screenshot */
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04) !important;
      padding: 24px 28px !important; /* Slightly reduced padding for compactness */
      width: 80% !important;
      max-width: 380px !important; /* Smaller max width */
      margin: 6vh auto !important; /* Vertical margin to keep card away from edges */
      display: flex !important;
      flex-direction: column !important;
      gap: 0 !important;
      animation: purgeCardSlideUp 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      position: relative !important;
      box-sizing: border-box !important;
    }
    .admin-purge-title {
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      font-size: 22px !important;
      font-weight: 600 !important;
      color: #1e293b !important; /* Dark slate text */
      margin: 0 0 16px 0 !important;
      text-align: left !important;
      line-height: 1.2 !important;
    }
    .admin-purge-body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      font-size: 15px !important;
      color: #475569 !important; /* Slate grey body text */
      line-height: 1.5 !important;
      margin: 0 0 28px 0 !important;
      text-align: left !important;
    }
    .admin-purge-actions {
      display: flex !important;
      gap: 16px !important;
      width: 100% !important;
      justify-content: center !important; /* Centered buttons */
    }
    .admin-purge-btn {
      font-family: 'Inter', system-ui, -apple-system, sans-serif !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      padding: 10px 28px !important; /* Pill style padding */
      border-radius: 9999px !important; /* Pill shape */
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      border: none !important;
      text-align: center !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-sizing: border-box !important;
      outline: none !important;
    }
    .admin-purge-btn-cancel {
      background: #e2e8f0 !important; /* Light grey pill */
      color: #475569 !important;
    }
    .admin-purge-btn-cancel:hover {
      background: #cbd5e1 !important;
      color: #1e293b !important;
    }
    .admin-purge-btn-danger {
      background: #ef4444 !important; /* Solid red delete pill */
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15) !important;
    }
    .admin-purge-btn-danger:hover {
      background: #dc2626 !important;
      box-shadow: 0 6px 16px rgba(220, 38, 38, 0.25) !important;
    }
    .admin-purge-btn-danger:active {
      background: #b91c1c !important;
    }
  `;

  const modalJSX = (
    <div className="admin-purge-backdrop">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="admin-purge-card">
        {/* Title */}
        <h3 className="admin-purge-title">Delete Confirmation</h3>
        
        {/* Description Body */}
        <p className="admin-purge-body">
          {isBulk ? (
            `Are you sure you want to delete these ${itemCount}?`
          ) : (
            'Are you sure you want to delete this item?'
          )}
        </p>
        
        {/* Buttons */}
        <div className="admin-purge-actions">
          <button 
            type="button" 
            className="admin-purge-btn admin-purge-btn-cancel"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="admin-purge-btn admin-purge-btn-danger"
            onClick={handleConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
}
