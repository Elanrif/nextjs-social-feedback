"use client";

import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

type LoadingPageProps = {
  loading: boolean;
  setLoading?: (val: boolean) => void;
  blur?: boolean;
  text?: string;
};

function unsubscribe() {
  // no external store to unsubscribe from
}
function subscribe() {
  return unsubscribe;
}
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function LoadingPage({ loading, text }: LoadingPageProps) {
  const isMounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isMounted || !loading) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70
        backdrop-blur-md"
    >
      {/* Card */}
      <div
        className="relative flex flex-col items-center gap-7 px-12 py-10 rounded-2xl bg-white/5
          border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-12 -left-12 w-40 h-40 rounded-full
            bg-indigo-500/25 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-10 -right-10 w-36 h-36 rounded-full
            bg-violet-500/20 blur-3xl"
        />

        {/* Spinner stack */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-white/8" />
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400
              border-r-violet-400 animate-spin"
            style={{ animationDuration: "1s" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-violet-300
              border-l-purple-400 animate-spin"
            style={{
              animationDuration: "0.7s",
              animationDirection: "reverse",
            }}
          />
          <div
            className="w-5 h-5 rounded-full bg-linear-to-br from-indigo-400 to-violet-500 shadow-lg
              shadow-indigo-500/40 animate-pulse"
          />
        </div>

        {/* Text block */}
        <div className="relative flex flex-col items-center gap-3 text-center">
          <p className="text-base font-semibold text-white tracking-wide">
            {text || "Chargement..."}
          </p>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce
                [animation-delay:-0.3s]"
            />
            <span
              className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce
                [animation-delay:-0.15s]"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
