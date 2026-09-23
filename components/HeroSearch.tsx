import { FaSearch } from "react-icons/fa";

/**
 * Single-field trek search. A plain GET form to /trips so it works before
 * hydration and without JS; <datalist> gives native suggestions.
 */
export default function HeroSearch({ suggestions = [] }: { suggestions?: string[] }) {
  return (
    <form
      action="/trips"
      method="get"
      role="search"
      className="flex-1 min-w-0 flex items-center gap-2 rounded-full bg-white/95 backdrop-blur p-1.5 shadow-2xl border border-white/40 focus-within:ring-2 focus-within:ring-secondary"
    >
      <label htmlFor="hero-search" className="sr-only">
        Search treks
      </label>
      <FaSearch className="ml-3 h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
      <input
        id="hero-search"
        name="search"
        type="search"
        list="hero-trek-suggestions"
        placeholder="Where do you want to trek? e.g. Everest"
        autoComplete="off"
        className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm md:text-base font-semibold text-charcoal placeholder:text-muted placeholder:font-normal focus:outline-none"
      />
      <datalist id="hero-trek-suggestions">
        {suggestions.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <button
        type="submit"
        className="rounded-full bg-primary text-white font-bold px-5 md:px-7 py-2.5 md:py-3 text-xs md:text-sm uppercase tracking-wider hover:bg-secondary hover:text-primary transition shrink-0"
      >
        Search
      </button>
    </form>
  );
}
