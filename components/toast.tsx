"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type ToastContextValue = {
  showToast: (t: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = uid();
    const item: ToastItem = { id, ...t };
    setToasts((prev) => [...prev, item]);

    // auto dismiss
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((p) => p.filter((x) => x.id !== id))} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider />");
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-50 flex w-[92vw] max-w-sm flex-col gap-3 sm:w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "rounded-2xl border bg-white p-4 shadow-lg",
            t.type === "error" ? "border-red-200" : t.type === "success" ? "border-emerald-200" : "border-slate-200",
          ].join(" ")}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{t.title}</p>
              {t.message ? (
                <p className="mt-1 text-sm leading-5 text-slate-600">{t.message}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
