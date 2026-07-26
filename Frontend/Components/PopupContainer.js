"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePopup } from "../context/PopupContext.js";
import { useAuth } from "../context/AuthContext.js";
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Lock, 
  Loader2, 
  Trash2, 
  LogOut, 
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  UserMinus,
  AlertCircle
} from "lucide-react";

export default function PopupContainer() {
  const { 
    toasts, 
    hideToast, 
    activeModal, 
    closeModal, 
    loadingOverlay 
  } = usePopup();

  // Handle ESC key for modal
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, closeModal]);

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
    <div className="fixed z-200 pointer-events-none flex flex-col gap-2.5 
      top-4 right-4 items-end w-full max-w-sm sm:max-w-md px-4
      mobile-toast-position"
      style={{
        zIndex: 99999
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-toast-position {
            top: auto !important;
            right: 0 !important;
            bottom: 24px !important;
            left: 0 !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Soft fade-in animation trigger
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-[#090D10]/95 border-emerald-500/20 text-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
          icon: <Check className="w-5.5 h-5.5 text-emerald-400" />
        };
      case "error":
        return {
          bg: "bg-[#0E0B0B]/95 border-red-500/20 text-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.15)]",
          icon: <AlertCircle className="w-5.5 h-5.5 text-red-400" />
        };
      case "warning":
        return {
          bg: "bg-[#0D0B09]/95 border-amber-500/20 text-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
          icon: <AlertTriangle className="w-5.5 h-5.5 text-amber-400" />
        };
      case "loading":
        return {
          bg: "bg-[#0B0C10]/95 border-blue-500/20 text-blue-400 shadow-[0_4px_20px_rgba(59,130,246,0.15)]",
          icon: <Loader2 className="w-5.5 h-5.5 text-blue-400 animate-spin" />
        };
      default:
        return {
          bg: "bg-[#0D0E12]/95 border-white/10 text-white/90 shadow-[0_4px_20px_rgba(255,255,255,0.08)]",
          icon: <Info className="w-5.5 h-5.5 text-white/70" />
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300"
      style={{ zIndex: 100000 }}
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
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animations
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleInnerClose = () => {
    setVisible(false);
    setTimeout(onClose, 200); // match animation duration
  };

  // Select the appropriate modal body
  const renderModalContent = () => {
    const { type, props } = activeModal;
    switch (type) {
      case "confirm":
        return <ConfirmationModalBody {...props} onClose={handleInnerClose} />;
      case "success":
        return <SuccessModalBody {...props} onClose={handleInnerClose} />;
      case "error":
        return <ErrorModalBody {...props} onClose={handleInnerClose} />;
      case "warning":
        return <WarningModalBody {...props} onClose={handleInnerClose} />;
      case "info":
        return <InfoModalBody {...props} onClose={handleInnerClose} />;
      case "login":
        return <LoginModalBody {...props} onClose={handleInnerClose} />;
      case "signup":
        return <SignupModalBody {...props} onClose={handleInnerClose} />;
      case "sessionExpired":
        return <SessionExpiredModalBody {...props} onClose={handleInnerClose} />;
      case "bottomSheetActions":
        return <BottomSheetActionsBody {...props} onClose={handleInnerClose} />;
      default:
        return (
          <div className="p-6 text-white">
            <p>Generic Modal Content</p>
          </div>
        );
    }
  };

  return (
    <div 
      onClick={handleOutsideClick}
      className={`fixed inset-0 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center transition-all duration-300 p-0 sm:p-4`}
      style={{ 
        zIndex: 99990,
        opacity: visible ? 1 : 0
      }}
    >
      <div 
        ref={modalRef}
        className={`w-full bg-[#0D0D12] text-white overflow-hidden transition-all duration-300 ease-out
          mobile-bottom-sheet sm:rounded-3xl border border-white/10 sm:max-w-md sm:w-full 
          ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-full sm:translate-y-4 sm:scale-95 sm:opacity-0"}`}
        tabIndex={-1}
      >
        {/* Mobile Swipe indicator */}
        <div className="sm:hidden w-12 h-1 bg-white/20 rounded-full mx-auto my-3 cursor-pointer" onClick={handleInnerClose} />
        
        {renderModalContent()}
      </div>

      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-bottom-sheet {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            max-height: 90vh !important;
            border-bottom-left-radius: 0px !important;
            border-bottom-right-radius: 0px !important;
            border-top-left-radius: 28px !important;
            border-top-right-radius: 28px !important;
            border-left: 0 !important;
            border-right: 0 !important;
            border-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

// ==========================================
// MODAL COMPONENTS DEFINITIONS
// ==========================================

// 1. CONFIRMATION MODAL
function ConfirmationModalBody({ 
  title = "Are you sure?", 
  message = "This action cannot be undone.", 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isDangerous = false, 
  onConfirm, 
  onCancel, 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className={`p-3.5 rounded-2xl flex-shrink-0 ${isDangerous ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"}`}>
          {isDangerous ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div className="space-y-1.5 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/90 truncate">
            {title}
          </h3>
          <p className="text-[13px] sm:text-sm text-white/45 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          onClick={() => {
            onClose();
            if (onCancel) onCancel();
          }}
          className="flex-1 py-3 text-sm font-semibold border border-white/10 hover:bg-white/5 rounded-xl transition cursor-pointer text-white/70 hover:text-white"
        >
          {cancelText}
        </button>
        <button
          onClick={() => {
            onClose();
            if (onConfirm) onConfirm();
          }}
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition cursor-pointer text-white 
            ${isDangerous ? "bg-red-500 hover:bg-red-400 hover:shadow-[0_4px_20px_rgba(239,68,68,0.4)]" : "bg-orange-500 hover:bg-orange-400 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)]"}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}

// 2. SUCCESS MODAL
function SuccessModalBody({ 
  title = "Success", 
  description = "Action completed successfully.", 
  primaryButtonText = "Continue", 
  onPrimaryButtonClick, 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
      {/* Icon checkmark wrapper */}
      <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <Check className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/95">
          {title}
        </h3>
        <p className="text-[13px] sm:text-sm text-white/45 leading-relaxed max-w-sm">
          {description}
        </p>
      </div>

      <button
        onClick={() => {
          onClose();
          if (onPrimaryButtonClick) onPrimaryButtonClick();
        }}
        className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
      >
        {primaryButtonText}
      </button>
    </div>
  );
}

// 3. ERROR MODAL
function ErrorModalBody({ 
  title = "Something went wrong", 
  message = "We encountered an issue processing your request.", 
  retryText = "Retry",
  dismissText = "Dismiss",
  onRetry, 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl flex-shrink-0">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">
            {title}
          </h3>
          <p className="text-[13px] sm:text-sm text-white/45 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold border border-white/10 hover:bg-white/5 rounded-xl transition cursor-pointer text-white/70 hover:text-white"
        >
          {dismissText}
        </button>
        {onRetry && (
          <button
            onClick={() => {
              onClose();
              onRetry();
            }}
            className="flex-1 py-3 bg-white text-black hover:bg-white/90 text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}

// 4. WARNING MODAL
function WarningModalBody({ 
  title = "Warning", 
  message = "Please review before proceeding.", 
  confirmText = "Proceed", 
  onConfirm, 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">
            {title}
          </h3>
          <p className="text-[13px] sm:text-sm text-white/45 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold border border-white/10 hover:bg-white/5 rounded-xl transition cursor-pointer text-white/70 hover:text-white"
        >
          Close
        </button>
        {onConfirm && (
          <button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            {confirmText}
          </button>
        )}
      </div>
    </div>
  );
}

// 5. INFO MODAL
function InfoModalBody({ 
  title = "Information", 
  message = "Features coming soon.", 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl flex-shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/90">
            {title}
          </h3>
          <p className="text-[13px] sm:text-sm text-white/45 leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
}

// 6. LOGIN MODAL
function LoginModalBody({ 
  onClose 
}) {
  const { showModal } = usePopup();
  
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
      {/* Icon Lock */}
      <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.15)] border border-orange-500/10">
        <Lock className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/95">
          Login Required
        </h3>
        <p className="text-[13px] sm:text-sm text-white/40 leading-relaxed max-w-sm">
          Sign in to continue interacting with the CineSocial community.
        </p>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={() => {
            onClose();
            window.location.href = "/Login";
          }}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
        >
          Login
        </button>

        <button
          onClick={() => {
            // Transitions directly to sign up
            showModal("signup");
          }}
          className="w-full py-3.5 bg-transparent hover:bg-white/[0.03] text-white/90 hover:text-white font-semibold text-sm rounded-xl border border-white/15 transition cursor-pointer"
        >
          Sign Up
        </button>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs text-white/35 hover:text-white/60 font-medium transition cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// 7. SIGNUP MODAL
function SignupModalBody({ 
  onClose 
}) {
  const { showModal } = usePopup();

  const benefits = [
    "Join cinema conversations",
    "Create posts & reviews",
    "Follow creators & critics",
    "Join cinematic communities",
    "Vote in movie polls",
    "Save posts to watchlist"
  ];

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/95">
          Join CineSocial Today
        </h3>
        <p className="text-xs sm:text-[13px] text-white/45 leading-relaxed">
          Create an account to fully participate in the community.
        </p>
      </div>

      {/* Benefits grid */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
        <h4 className="text-[11px] font-bold text-orange-400 tracking-wider uppercase mb-1">
          Account Benefits
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-[12px] text-white/60">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => {
            onClose();
            window.location.href = "/Signup";
          }}
          className="w-full py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm rounded-xl transition cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
        >
          Create Account
        </button>

        <button
          onClick={() => {
            // Transitions directly to login
            showModal("login");
          }}
          className="w-full py-3.5 bg-transparent hover:bg-white/[0.03] text-white/80 hover:text-white font-semibold text-sm rounded-xl border border-white/10 transition cursor-pointer"
        >
          Already have an account?
        </button>
      </div>
    </div>
  );
}

// 8. SESSION EXPIRED MODAL
function SessionExpiredModalBody({ 
  onConfirm, 
  onClose 
}) {
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.15)] border border-red-500/10">
        <LogOut className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white/95">
          Session Expired
        </h3>
        <p className="text-[13px] sm:text-sm text-white/40 leading-relaxed max-w-sm">
          Please login again.
        </p>
      </div>

      <div className="w-full flex gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-3 text-sm font-semibold border border-white/10 hover:bg-white/5 rounded-xl transition cursor-pointer text-white/70 hover:text-white"
        >
          Dismiss
        </button>
        <button
          onClick={() => {
            onClose();
            if (onConfirm) onConfirm();
          }}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
        >
          Login
        </button>
      </div>
    </div>
  );
}

// 9. BOTTOM SHEET ACTIONS (MOBILE CONTEXT OPTIONS)
function BottomSheetActionsBody({ 
  title = "Actions", 
  actions = [], 
  onClose 
}) {
  return (
    <div className="p-4 sm:p-5 space-y-4">
      {title && (
        <div className="px-2 pb-2 border-b border-white/5">
          <p className="text-[11px] font-bold text-white/35 uppercase tracking-wider">
            {title}
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={() => {
                onClose();
                if (act.onClick) act.onClick();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition cursor-pointer text-[13px] sm:text-sm font-semibold
                ${act.isDangerous 
                  ? "text-red-400 hover:bg-red-500/10" 
                  : "text-white/80 hover:bg-white/[0.04] hover:text-white"}`}
            >
              {Icon && <Icon className="w-4.5 h-4.5 shrink-0" />}
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onClose}
        className="w-full py-3.5 bg-white/5 hover:bg-white/8 text-white/70 hover:text-white text-sm font-semibold rounded-xl border border-white/5 transition cursor-pointer mt-2"
      >
        Cancel
      </button>
    </div>
  );
}
