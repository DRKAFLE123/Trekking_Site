const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /<[^>]+class="[^"]*focEeD[^"]*"[^>]*>/gi;
const matches = html.match(regex) || [];
console.log(`Found ${matches.length} elements with class focEeD:`);
matches.forEach((m) => {
  console.log(m);
  const idx = html.indexOf(m);
  if (idx !== -1) {
    console.log("Context:");
    console.log(html.substring(idx - 200, idx + m.length + 300));
  }
});
