const http = require('http');

const fetchURL = (url) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${url}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

async function main() {
  try {
    const regions = await fetchURL('/api/regions');
    const trips = await fetchURL('/api/trips');
    console.log("=== REGIONS ===");
    console.log(regions.map(r => ({ id: r.id || r._id, name: r.name, slug: r.slug })));
    console.log("=== TRIPS ===");
    console.log(trips.map(t => ({ id: t.id || t._id, title: t.title, region: t.region })));
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

main();
