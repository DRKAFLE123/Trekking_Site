'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('[Global Error Boundary]', error);

    // Check if the error is due to a failed chunk load (deployment mismatch)
    const isChunkError =
      error.message?.includes('ChunkLoadError') ||
      error.message?.toLowerCase().includes('loading chunk') ||
      error.message?.toLowerCase().includes('failed to load');

    if (isChunkError) {
      // Prevent infinite reloading loop by checking sessionStorage
      const lastReload = sessionStorage.getItem('last_chunk_reload');
      const now = Date.now();

      // Only reload automatically if we haven't reloaded in the last 10 seconds
      if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
        sessionStorage.setItem('last_chunk_reload', now.toString());
        console.warn('[Global Error Boundary] ChunkLoadError detected. Automatically reloading page...');
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We encountered a client-side connection or loading issue. Please try reloading the page.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#0d5c3a] text-white rounded-lg font-medium hover:bg-[#0a482d] transition-colors"
        >
          Reload Page
        </button>
        <button
          onClick={() => reset()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
