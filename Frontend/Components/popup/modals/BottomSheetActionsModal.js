"use client";

import React from "react";

export default function BottomSheetActionsModal({
  title = "Actions",
  actions = [],
  onClose,
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
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition cursor-pointer text-[13px] sm:text-sm font-semibold text-left
                ${
                  act.isDangerous
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-white/80 hover:bg-white/[0.04] hover:text-white"
                }`}
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
