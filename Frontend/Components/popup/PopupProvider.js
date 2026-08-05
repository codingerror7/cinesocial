"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PopupContext } from "./PopupContext";

export function PopupProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [activeModal, setActiveModal] = useState(null); // { type, props } or null
  const [loadingOverlay, setLoadingOverlay] = useState(null); // { message, progress, eta } or null
  const [draftState, setDraftState] = useState({ hasDraft: false, onDiscard: null });

  // --- Toasts ---
  const showToast = useCallback((type, message, duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // --- Modals ---
  const showModal = useCallback((type, props = {}) => {
    setActiveModal({ type, props });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // --- Loading Overlay ---
  const showLoading = useCallback((message = "Loading...", progress = null, eta = null) => {
    setLoadingOverlay({ message, progress, eta });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingOverlay(null);
  }, []);

  // --- Draft State ---
  const setDraft = useCallback((hasDraft, onDiscard = null) => {
    setDraftState({ hasDraft, onDiscard });
  }, []);

  const clearDraft = useCallback(() => {
    setDraftState({ hasDraft: false, onDiscard: null });
  }, []);

  // Handle SPA navigation draft confirmation
  const checkDraftAndNavigate = useCallback((navigateCallback) => {
    if (draftState.hasDraft) {
      showModal("confirm", {
        title: "Discard Draft?",
        message: "Your changes haven't been shared yet.",
        confirmText: "Discard",
        cancelText: "Continue Editing",
        isDangerous: true,
        onConfirm: () => {
          clearDraft();
          closeModal();
          if (draftState.onDiscard) {
            draftState.onDiscard();
          }
          if (navigateCallback) {
            navigateCallback();
          }
        },
        onCancel: () => {
          closeModal();
        }
      });
      return false; // Intercepted
    }
    if (navigateCallback) {
      navigateCallback();
    }
    return true; // Proceeded
  }, [draftState, showModal, closeModal, clearDraft]);

  // Listener for custom session expired event
  useEffect(() => {
    const handleSessionExpired = () => {
      showModal("sessionExpired", {
        onConfirm: () => {
          closeModal();
          window.location.href = "/Login";
        },
        onDismiss: () => {
          closeModal();
        }
      });
    };
    window.addEventListener("cinesocial-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("cinesocial-session-expired", handleSessionExpired);
    };
  }, [showModal, closeModal]);

  const value = useMemo(() => ({
    toasts,
    activeModal,
    loadingOverlay,
    draftState,
    showToast,
    hideToast,
    clearToasts,
    showModal,
    closeModal,
    showLoading,
    hideLoading,
    setDraft,
    clearDraft,
    checkDraftAndNavigate
  }), [
    toasts,
    activeModal,
    loadingOverlay,
    draftState,
    showToast,
    hideToast,
    clearToasts,
    showModal,
    closeModal,
    showLoading,
    hideLoading,
    setDraft,
    clearDraft,
    checkDraftAndNavigate
  ]);

  return (
    <PopupContext.Provider value={value}>
      {children}
    </PopupContext.Provider>
  );
}
