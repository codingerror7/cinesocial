"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

export default function WarningModal({
  title = "Warning",
  message = "Please review before proceeding.",
  confirmText = "Proceed",
  onConfirm,
  onClose,
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-amber-500/10 text-amber-500 rounded-2xl flex-shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 min-w-0 flex-1">
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
