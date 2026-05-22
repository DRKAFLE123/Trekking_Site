const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /url\([^)]+\)/gi;
const matches = html.match(regex) || [];
console.log("Found background image URLs in CSS/HTML:");
matches.forEach(m => console.log(m));

const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
let match;
console.log("\nFound img src tags:");
while ((match = imgRegex.exec(html)) !== null) {
  if (match[1].toLowerCase().includes('footer') || match[1].toLowerCase().includes('bg')) {
    console.log(match[0]);
  }
}

console.log("\nSearching for any webp/svg/jpg/png reference with 'footer' or 'bg':");
const extRegex = /"[^"]+\.(webp|svg|png|jpg|jpeg)[^"]*"/gi;
const extMatches = html.match(extRegex) || [];
extMatches.forEach((m) => {
  if (m.toLowerCase().includes('footer') || m.toLowerCase().includes('bg')) {
    console.log(m);
  }
});
