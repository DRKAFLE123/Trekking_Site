const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const email = 'info@discoveryworldtrekking.com';
let pos = html.indexOf(email);
let count = 0;
while (pos !== -1) {
  count++;
  console.log(`Occurrence ${count} at index ${pos}`);
  // Print context if it's not the first one (which we saw is script tag)
  if (count > 1) {
    const start = Math.max(0, pos - 1500);
    const end = Math.min(html.length, pos + 1500);
    console.log(`\n--- CONTEXT FOR OCCURRENCE ${count} ---`);
    console.log(html.substring(start, end));
  }
  pos = html.indexOf(email, pos + 1);
}
