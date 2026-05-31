const { spawn } = require('child_process');

console.log('🚀 Starting Payload interactive migration script...');
const child = spawn('npx', ['tsx', '--env-file=.env.local', 'node_modules/payload/bin.js', 'migrate'], {
  shell: true
});

child.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);

  // Match the interactive prompt
  if (output.includes('Would you like to proceed?') || output.includes('data loss will occur')) {
    console.log('\n[Script] Automatically sending confirmation "y" to interactive prompt...');
    child.stdin.write('y\n');
  }
});

child.stderr.on('data', (data) => {
  process.stderr.write(data.toString());
});

child.on('close', (code) => {
  console.log(`\n[Script] Migration process exited with code ${code}`);
  process.exit(code);
});
