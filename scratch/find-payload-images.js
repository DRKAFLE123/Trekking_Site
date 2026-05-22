const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Find all instances of strings ending in .png, .webp, .svg, .jpg, etc.
const regex = /[\w\-\/\.]+\.(png|webp|svg|jpg|jpeg)/gi;
const matches = html.match(regex) || [];
console.log(`Found ${matches.length} matches of image extensions:`);
const uniqueMatches = [...new Set(matches)];
uniqueMatches.forEach((m) => {
  if (m.includes('footer') || m.includes('bg') || m.includes('mountain') || m.includes('graphic') || m.includes('trek')) {
    console.log("MATCH:", m);
  }
});
