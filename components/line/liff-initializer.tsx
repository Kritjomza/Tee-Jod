"use client";

import { useEffect } from "react";
import { initializeLiff } from "@/lib/line/liff-client";

export function LiffInitializer() {
  useEffect(() => {
    void initializeLiff().catch(() => {
      // The dashboard remains fully usable in an ordinary browser.
    });
  }, []);
  return null;
}
