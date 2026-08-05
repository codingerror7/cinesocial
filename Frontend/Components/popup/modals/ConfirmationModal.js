"use client";

import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
  onClose,
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div
          className={`p-3.5 rounded-2xl flex-shrink-0 ${
            isDangerous
              ? "bg-red-500/10 text-red-500"
              : "bg-orange-500/10 text-orange-500"
          }`}
        >
          {isDangerous ? (
            <Trash2 className="w-6 h-6" />
          ) : (
            <AlertTriangle className="w-6 h-6" />
          )}
        </div>
        <div className="space-y-1.5 min-w-0 flex-1">
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
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition cursor-pointer text-white ${
            isDangerous
              ? "bg-red-500 hover:bg-red-400 hover:shadow-[0_4px_20px_rgba(239,68,68,0.4)]"
              : "bg-orange-500 hover:bg-orange-400 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)]"
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
