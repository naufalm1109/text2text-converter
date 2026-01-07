"use client";

import { Toaster } from "react-hot-toast";

/**
 * ClientProviders
 * Tempat semua provider berbasis browser (toast, theme, modal, dsb).
 * Wajib client component karena react-hot-toast butuh window.
 */
export function ClientProviders() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2500,
      }}
    />
  );
}
