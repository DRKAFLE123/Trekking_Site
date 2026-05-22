const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const query = '/frontend/assets/images/';
let pos = html.indexOf(query);
let count = 0;
while (pos !== -1) {
  count++;
  console.log(`Occurrence ${count} at index ${pos}:`);
  console.log(html.substring(Math.max(0, pos - 50), Math.min(html.length, pos + 250)));
  pos = html.indexOf(query, pos + 1);
}
