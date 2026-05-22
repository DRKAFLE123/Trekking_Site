const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

let pos = html.indexOf('bLStxg');
let count = 0;
while (pos !== -1) {
  count++;
  console.log(`Occurrence ${count} of 'bLStxg' at index ${pos}:`);
  console.log(html.substring(Math.max(0, pos - 150), Math.min(html.length, pos + 150)));
  pos = html.indexOf('bLStxg', pos + 1);
}
