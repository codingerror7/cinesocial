"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorModal({
  title = "Something went wrong",
  message = "We encountered an issue processing your request.",
  retryText = "Retry",
  dismissText = "Dismiss",
  onRetry,
  onClose,
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-red-500/10 text-red-500 rounded-2xl flex-shrink-0">
          <AlertCircle className="w-6 h-6" />
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
