"use client";

import { useEffect, useRef } from "react";

/**
 * Traps focus within the container ref when active.
 * Useful for modal accessibility.
 */
export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // List of focusable elements
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    const getFocusableElements = () => {
      return Array.from(container.querySelectorAll(focusableSelector)).filter(
        (el) => !el.disabled && el.tabIndex !== -1
      );
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Store the element that was focused before opening the modal
    const originalFocus = document.activeElement;

    // Focus the first element initially
    firstElement.focus();

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const currentFocusables = getFocusableElements();
      if (currentFocusables.length === 0) return;

      const first = currentFocusables[0];
      const last = currentFocusables[currentFocusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab (backwards)
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        // Tab (forwards)
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      // Restore focus to original element
      if (originalFocus && typeof originalFocus.focus === "function") {
        originalFocus.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}

/**
 * Locks scroll on the body tag when active.
 * Prevents layout shift by adding padding equal to the scrollbar width.
 */
export function useScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Compute scrollbar width to prevent page shift (layout jump)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
