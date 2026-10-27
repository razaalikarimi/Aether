'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime exception:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center space-y-6">
      <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-400 uppercase tracking-widest">
        System Interruption
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-light text-white">
        Acoustic Telemetry Error
      </h1>
      <p className="max-w-md text-xs text-text-secondary leading-relaxed">
        An unexpected state occurred while interfacing with the render pipeline. We have
        isolated the runtime exception.
      </p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-6 py-3 rounded-xl bg-white text-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors"
        >
          Re-engage Engine
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl border border-white/10 text-white text-xs font-mono uppercase tracking-wider hover:bg-white/5 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
