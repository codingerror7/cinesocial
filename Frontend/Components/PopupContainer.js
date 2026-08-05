"use client";

import React from "react";
import dynamic from "next/dynamic";

const PopupRoot = dynamic(() => import("@/Components/popup/PopupRoot").then(mod => mod.PopupRoot), {
  ssr: false,
});

export default function PopupContainer() {
  return <PopupRoot />;
}
