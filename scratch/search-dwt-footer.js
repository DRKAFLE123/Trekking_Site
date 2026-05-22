const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const email = 'info@discoveryworldtrekking.com';
const index = html.indexOf(email);
if (index === -1) {
  console.log(`Email '${email}' not found in HTML.`);
} else {
  console.log(`Found email at index ${index}.`);
  // Print 2000 characters before and 2000 characters after the email address
  const start = Math.max(0, index - 2500);
  const end = Math.min(html.length, index + 2500);
  console.log('--- SURROUNDING HTML ---');
  console.log(html.substring(start, end));
}
