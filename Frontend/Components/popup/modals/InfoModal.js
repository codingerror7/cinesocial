"use client";

import React from "react";
import { Info } from "lucide-react";

export default function InfoModal({
  title = "Information",
  message = "Features coming soon.",
  onClose,
}) {
  return (
    <div className="p-6 sm:p-7 space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl flex-shrink-0">
          <Info className="w-6 h-6" />
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

      <button
        onClick={onClose}
        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm rounded-xl transition cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
}
