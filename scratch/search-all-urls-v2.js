const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /url\([^)]+\)/gi;
let match;
console.log("All url(...) occurrences in HTML file:");
while ((match = regex.exec(html)) !== null) {
  console.log(match[0]);
}
