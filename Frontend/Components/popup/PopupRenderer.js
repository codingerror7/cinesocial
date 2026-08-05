"use client";

import React from "react";
import ConfirmationModal from "./modals/ConfirmationModal";
import SuccessModal from "./modals/SuccessModal";
import ErrorModal from "./modals/ErrorModal";
import WarningModal from "./modals/WarningModal";
import InfoModal from "./modals/InfoModal";
import LoginModal from "./modals/LoginModal";
import SignupModal from "./modals/SignupModal";
import SessionExpiredModal from "./modals/SessionExpiredModal";
import BottomSheetActionsModal from "./modals/BottomSheetActionsModal";

const MODAL_REGISTRY = {
  confirm: ConfirmationModal,
  success: SuccessModal,
  error: ErrorModal,
  warning: WarningModal,
  info: InfoModal,
  login: LoginModal,
  signup: SignupModal,
  sessionExpired: SessionExpiredModal,
  bottomSheetActions: BottomSheetActionsModal,
};

export default function PopupRenderer({ activeModal, onClose }) {
  if (!activeModal) return null;

  const { type, props = {} } = activeModal;
  const ModalComponent = MODAL_REGISTRY[type];

  // Gracefully handle unknown modal types or missing components
  if (!ModalComponent) {
    console.warn(`[PopupRenderer] Unknown or unregistered popup type: "${type}"`);
    return (
      <div className="p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-red-400">Error</h3>
        <p className="text-sm text-white/50">
          The requested modal type could not be found.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition"
        >
          Close
        </button>
      </div>
    );
  }

  // Render components safely with fallback properties
  const safeProps = props || {};

  return <ModalComponent {...safeProps} onClose={onClose} />;
}
