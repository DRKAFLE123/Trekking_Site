const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /<[^>]+class="[^"]*bLStxg[^"]*"[^>]*>/gi;
const matches = html.match(regex) || [];
console.log(`Found ${matches.length} elements with class bLStxg:`);
matches.forEach((m) => console.log(m));

// Let's also print context around them (100 characters before and after)
matches.forEach((m) => {
  const idx = html.indexOf(m);
  if (idx !== -1) {
    console.log("\nContext:");
    console.log(html.substring(idx - 150, idx + m.length + 150));
  }
});
