const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Find all URLs matching images
const imgRegex = /["']([^"']+\.(png|webp|jpg|jpeg|svg))["']/gi;
const matches = [];
let match;
while ((match = imgRegex.exec(html)) !== null) {
  matches.push(match[1]);
}

console.log(`Found ${matches.length} image references:`);
const uniqueMatches = [...new Set(matches)];
uniqueMatches.forEach((m) => {
  if (m.toLowerCase().includes('footer') || m.toLowerCase().includes('bg') || m.toLowerCase().includes('mountain') || m.toLowerCase().includes('hiker') || m.toLowerCase().includes('silhouette')) {
    console.log("MATCH:", m);
  } else {
    // console.log("Other:", m);
  }
});
