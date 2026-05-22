const http = require('https');
const fs = require('fs');

http.get('https://www.discoveryworldtrekking.com/everest-base-camp-trek', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('scratch/dwt-ebc.html', data);
    console.log("Saved HTML file. Searching footer sections...");
    
    // Find all matching styled footer tags or classes
    const regex = /<footer[\s\S]*?<\/footer>/gi;
    const matches = data.match(regex);
    if (matches) {
      console.log(`Found ${matches.length} <footer> tags.`);
      matches.forEach((m, idx) => {
        console.log(`\n--- Match ${idx+1} ---`);
        console.log(m.substring(0, 1500));
      });
    } else {
      console.log("No <footer> tags found. Searching for divs containing footer class...");
      // Let's find sections or divs containing class *footer*
      const divRegex = /<div[^>]*class="[^"]*footer[^"]*"[\s\S]*?<\/div>/gi;
      const divMatches = data.match(divRegex);
      if (divMatches) {
        console.log(`Found ${divMatches.length} divs with footer class.`);
        divMatches.slice(0, 3).forEach((m, idx) => {
          console.log(`\n--- Div Match ${idx+1} ---`);
          console.log(m.substring(0, 1000));
        });
      }
    }
  });
}).on('error', (err) => {
  console.error("Error: ", err);
});
