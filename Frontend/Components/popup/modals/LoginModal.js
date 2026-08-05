"use client";

import React from "react";
import { Lock } from "lucide-react";
import { usePopup } from "../PopupContext";

export default function LoginModal({ onClose }) {
  const { showModal } = usePopup();

  return (
    <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-6">
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
