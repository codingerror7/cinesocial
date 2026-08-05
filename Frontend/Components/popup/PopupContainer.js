"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import { usePopup } from "./PopupContext";
import { useFocusTrap, useScrollLock } from "./hooks";
import PopupRenderer from "./PopupRenderer";

export default function PopupContainer() {
  const { 
    toasts, 
    hideToast, 
    activeModal, 
    closeModal, 
    loadingOverlay 
  } = usePopup();

  return (
    <>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={hideToast} />

      {/* Modal Container */}
      {activeModal && (
        <ModalWrapper activeModal={activeModal} onClose={closeModal} />
      )}

      {/* Loading Overlay */}
      {loadingOverlay && (
        <LoadingOverlayUI config={loadingOverlay} />
      )}
    </>
  );
}

// ==========================================
// TOAST NOTIFICATIONS UI
// ==========================================
function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed z-[99999] pointer-events-none flex flex-col gap-2.5 
        bottom-6 left-0 right-0 items-center justify-center w-full px-4
        sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:items-end sm:max-w-sm"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-[#090D10]/95 border-emerald-500/20 text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
          icon: <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        };
      case "error":
        return {
          bg: "bg-[#0E0B0B]/95 border-red-500/20 text-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.15)]",
          icon: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        };
      case "warning":
        return {
          bg: "bg-[#0D0B09]/95 border-amber-500/20 text-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        };
      case "loading":
        return {
          bg: "bg-[#0B0C10]/95 border-blue-500/20 text-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
          icon: <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
        };
      default:
        return {
          bg: "bg-[#0D0E12]/95 border-white/10 text-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.08)]",
          icon: <Info className="w-5 h-5 text-white/70 flex-shrink-0" />
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3.5 px-4.5 py-3.5 
        rounded-2xl border backdrop-blur-2xl transition-all duration-300 w-full sm:w-auto sm:min-w-[280px]
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"}`}
    >
      <div className="flex items-center gap-3">
        {styles.icon}
        <span className="text-[13px] font-medium tracking-wide leading-relaxed">
          {toast.message}
        </span>
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="text-white/30 hover:text-white/70 transition cursor-pointer p-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ==========================================
// LOADING OVERLAY UI
// ==========================================
function LoadingOverlayUI({ config }) {
  const progress = Number.isInteger(config.progress) ? config.progress : null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300 z-[100000]"
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center space-y-4">
        {/* Loading Spinner */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-white/5 absolute" />
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>

        <div>
          <h3 className="text-lg font-semibold tracking-wide text-white/90">
            {config.message || "Please wait..."}
          </h3>
          {config.eta && (
            <p className="text-xs text-white/40 mt-1.5 font-medium tracking-wide">
              {config.eta}
            </p>
          )}
        </div>

        {progress !== null && (
          <div className="w-64 space-y-2">
            {/* Progress Bar Container */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(249,115,22,0.6)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Percentage */}
            <div className="flex justify-between items-center text-[11px] font-semibold text-white/45 uppercase tracking-widest">
              <span>Uploading</span>
              <span className="text-orange-400 font-bold">{progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODAL SYSTEM CONTROLLERS
// ==========================================
function ModalWrapper({ activeModal, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleInnerClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200); // match duration-200 transitions
  }, [onClose]);

  const handleOutsideClick = (e) => {
    // If the click is direct on the wrapper/overlay container, dismiss.
    if (e.target === e.currentTarget) {
      handleInnerClose();
    }
  };

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleInnerClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInnerClose]);

  // Focus trap ref & scroll lock hook
  const modalContainerRef = useFocusTrap(visible);
  useScrollLock(visible);

  return (
    <div 
      onClick={handleOutsideClick}
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center transition-opacity duration-200 p-0 sm:p-4 z-[99990]"
      style={{ 
        opacity: visible ? 1 : 0
      }}
    >
      <div 
        ref={modalContainerRef}
        className={`w-full bg-[#0D0D12] text-white overflow-hidden transition-all duration-200 ease-out
          fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-[28px] rounded-b-none border-t border-white/10
          sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:max-h-none sm:max-w-md sm:rounded-[28px] sm:border z-[99991]
          ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-full sm:translate-y-4 sm:scale-95 sm:opacity-0"}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Swipe / Dismiss bar */}
        <div 
          className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto my-3 cursor-pointer" 
          onClick={handleInnerClose}
          aria-label="Close dialog"
        />
        
        <PopupRenderer activeModal={activeModal} onClose={handleInnerClose} />
      </div>
    </div>
  );
}
