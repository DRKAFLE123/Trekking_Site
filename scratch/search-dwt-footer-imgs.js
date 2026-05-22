const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Parse for <img tags and print their attributes
const imgRegex = /<img[^>]+>/gi;
const matches = html.match(imgRegex) || [];
console.log(`Found ${matches.length} <img> tags in HTML:`);
matches.forEach((img, idx) => {
  console.log(`\nIMG ${idx+1}:`);
  console.log(img);
});

// Also search for JSON object images
console.log("\nSearching for any webp/png/jpg in JSON/data:");
const extRegex = /"[^"]+\.(webp|png|jpg|jpeg|svg)[^"]*"/gi;
const extMatches = html.match(extRegex) || [];
const uniqueMatches = Array.from(new Set(extMatches));
uniqueMatches.forEach((m) => {
  if (m.toLowerCase().includes('footer') || m.toLowerCase().includes('bg') || m.toLowerCase().includes('mountain') || m.toLowerCase().includes('hiker')) {
    console.log(m);
  }
});
