const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /"[^"]+\.(webp|svg|png|jpg|jpeg)[^"]*"/gi;
const matches = html.match(regex) || [];
console.log(`Found ${matches.length} image references:`);
const uniqueMatches = Array.from(new Set(matches));
uniqueMatches.forEach((m) => {
  if (m.toLowerCase().includes('footer') || m.toLowerCase().includes('bg') || m.toLowerCase().includes('mount') || m.toLowerCase().includes('hiker') || m.toLowerCase().includes('trek')) {
    console.log(m);
  }
});
