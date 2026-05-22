const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

const regex = /"[^"]*footer[^"]*\.(webp|png|jpg|jpeg|svg)[^"]*"/gi;
const matches = html.match(regex) || [];
console.log("Found references to footer images in the HTML file:");
matches.forEach(m => console.log(m));
