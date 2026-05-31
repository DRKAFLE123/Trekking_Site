'use client';
import { useEffect } from 'react';

/**
 * AdminDeleteInterceptor
 *
 * Payload CMS v3's bulk-delete confirmation modal renders broken due to
 * our custom admin CSS layout overrides. This component:
 *
 *  1. Uses MutationObserver to detect when the delete modal appears in the DOM
 *     (identified by finding a button with text "CONFIRM" that is NOT the main
 *     page's form submit).
 *  2. Immediately hides the entire modal wrapper by traversing up from the
 *     Confirm button to find the outermost new DOM node appended to body.
 *  3. Replaces the interaction with a native window.confirm() dialog.
 *  4. If user confirms, programmatically clicks the real Confirm button to
 *     trigger Payload's delete API call. If cancelled, clicks Cancel.
 */
export function AdminDeleteInterceptor() {
  useEffect(() => {
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

    function getItemCount(modalEl: Element): string {
      const text = modalEl.textContent || '';
      const match = text.match(/(\d+)\s+(departure|trek|booking|faq|testimonial|team|blog|region|media|item|record)/i);
      if (match) return `${match[1]} ${match[2]}(s)`;
      const numMatch = text.match(/\d+/);
      return numMatch ? `${numMatch[0]} item(s)` : 'selected item(s)';
    }

    function handleModal(confirmBtn: HTMLButtonElement, modalRoot: Element) {
      if (processedModals.has(modalRoot)) return;
      processedModals.add(modalRoot);

      const count = getItemCount(modalRoot);

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

      // Small delay to ensure the hide takes effect before alert blocks the thread
      setTimeout(() => {
        const shouldDelete = window.confirm(
          `⚠️  CONFIRM DELETION\n\nYou are about to permanently delete ${count}.\n\nThis action cannot be undone.\n\nClick OK to confirm deletion, or Cancel to go back.`
        );

        if (shouldDelete) {
          // Restore visibility briefly so the button is clickable
          (modalRoot as HTMLElement).style.setProperty('display', originalDisplay || 'block', 'important');
          hiddenOverlays.forEach(({ el, disp }) => {
            el.style.setProperty('display', disp || 'block', 'important');
          });

          // Re-hide the visual layout (keep it functional but invisible)
          (modalRoot as HTMLElement).style.setProperty('opacity', '0', 'important');
          (modalRoot as HTMLElement).style.setProperty('pointer-events', 'none', 'important');
          hiddenOverlays.forEach(({ el }) => {
            el.style.setProperty('opacity', '0', 'important');
          });

          // Make just the confirm button clickable
          confirmBtn.style.setProperty('pointer-events', 'auto', 'important');
          confirmBtn.style.setProperty('opacity', '1', 'important');
          confirmBtn.style.setProperty('position', 'fixed', 'important');
          confirmBtn.style.setProperty('top', '-9999px', 'important');
          confirmBtn.style.setProperty('left', '-9999px', 'important');

          confirmBtn.click();
        } else {
          // User cancelled — restore normal state and click cancel
          (modalRoot as HTMLElement).style.display = originalDisplay;
          (modalRoot as HTMLElement).style.visibility = originalVisibility;
          (modalRoot as HTMLElement).style.opacity = originalOpacity;
          (modalRoot as HTMLElement).style.pointerEvents = originalPointerEvents;
          hiddenOverlays.forEach(({ el, disp }) => {
            el.style.display = disp;
          });

          cancelBtn?.click();
        }
      }, 50);
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

  return null;
}
