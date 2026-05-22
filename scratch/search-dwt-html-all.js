const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const query = 'footer';
let pos = html.toLowerCase().indexOf(query);
let count = 0;
while (pos !== -1) {
  count++;
  console.log(`\nMatch ${count} at index ${pos}:`);
  console.log(html.substring(Math.max(0, pos - 150), Math.min(html.length, pos + 250)));
  pos = html.toLowerCase().indexOf(query, pos + 1);
}
