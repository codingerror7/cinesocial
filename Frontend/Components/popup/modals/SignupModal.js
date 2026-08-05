"use client";

import React from "react";
import { Check } from "lucide-react";
import { usePopup } from "../PopupContext";

export default function SignupModal({ onClose }) {
  const { showModal } = usePopup();

  const benefits = [
    "Join cinema conversations",
    "Create posts & reviews",
    "Follow creators & critics",
    "Join cinematic communities",
    "Vote in movie polls",
    "Save posts to watchlist",
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
