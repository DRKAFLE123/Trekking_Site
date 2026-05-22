const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /<[^>]+class="[^"]*bLStxg[^"]*"[^>]*>/gi;
const matches = html.match(regex) || [];
console.log(`Found ${matches.length} matches:`);
matches.forEach((m) => {
  console.log(m);
  const idx = html.indexOf(m);
  console.log("Context around tag:");
  console.log(html.substring(Math.max(0, idx - 100), Math.min(html.length, idx + m.length + 300)));
});
