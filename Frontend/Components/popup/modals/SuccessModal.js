"use client";

import React from "react";
import { Check } from "lucide-react";

export default function SuccessModal({
  title = "Success",
  description = "Action completed successfully.",
  primaryButtonText = "Continue",
  onPrimaryButtonClick,
  onClose,
}) {
  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
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
