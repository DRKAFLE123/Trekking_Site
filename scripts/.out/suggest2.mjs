// Autocomplete per country for SEEDS (comma list). SEEDS="a,b" node suggest2.mjs
const get = async (q, gl) => { try { return (await (await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=${gl}&q=${encodeURIComponent(q)}`)).json())[1] || []; } catch { return []; } };
for (const s of process.env.SEEDS.split(",")) {
  const all = new Map();
  for (const gl of ["us", "gb", "au"]) for (const x of await get(s, gl)) all.set(x, (all.get(x) || "") + gl + " ");
  console.log(`\n## ${s}`); for (const [k, v] of all) console.log(`  ${k}  [${v.trim()}]`);
  await new Promise((r) => setTimeout(r, 400));
}
