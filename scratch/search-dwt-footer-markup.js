const fs = require('fs');
const html = fs.readFileSync('scratch/dwt-ebc.html', 'utf8');

// Search for self.__next_f.push lines
const lines = html.split('\n');
console.log("Searching for footer React components inside RSC payload...");
lines.forEach((line) => {
  if (line.includes('PrimaryFooter') || line.includes('StyledPrimaryFooter') || line.includes('StyledBackgroundImage')) {
    console.log(line.substring(0, 500) + '...');
  }
});
