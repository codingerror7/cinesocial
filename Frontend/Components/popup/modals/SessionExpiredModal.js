"use client";

import React from "react";
import { LogOut } from "lucide-react";

export default function SessionExpiredModal({ onConfirm, onClose }) {
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
