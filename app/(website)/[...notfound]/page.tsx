import { notFound } from "next/navigation";

// Catch-all for any URL that doesn't match a specific page route. Bubbling a
// notFound() from here triggers the nearest `not-found.tsx` going up the tree,
// which is `app/(website)/not-found.tsx` — our custom branded 404.
//
// Specific routes (e.g. /trips, /admin/*) always win over this catch-all, so
// this only fires for genuinely unmatched URLs.
export default function CatchAll() {
  notFound();
}
