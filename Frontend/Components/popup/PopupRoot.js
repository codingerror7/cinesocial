"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic import with ssr: false ensures this component only mounts in the browser
const PopupContainer = dynamic(() => import("./PopupContainer"), {
  ssr: false,
});

export function PopupRoot() {
  return <PopupContainer />;
}
