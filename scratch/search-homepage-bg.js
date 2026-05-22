const fs = require('fs');

if (fs.existsSync('app/page.tsx')) {
  const content = fs.readFileSync('app/page.tsx', 'utf8');
  console.log("File length:", content.length);
  
  // Search for last 5000 characters
  const lastPart = content.substring(content.length - 8000);
  console.log("Searching background classes near the bottom of app/page.tsx...");
  
  const bgRegex = /className="[^"]*bg-[^"]*"/g;
  const matches = lastPart.match(bgRegex) || [];
  matches.forEach(m => console.log(m));
} else {
  console.log("app/page.tsx not found.");
}
