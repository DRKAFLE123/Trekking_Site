const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

console.log("File length:", html.length);
console.log("First 1000 chars:");
console.log(html.substring(0, 1000));
console.log("\nLast 1000 chars:");
console.log(html.substring(html.length - 1000));
