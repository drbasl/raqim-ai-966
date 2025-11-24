import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

console.log('🔍 Verifying build output...');

const criticalFiles = [
  'dist/public/index.html',
  'dist/index.js',
];

let hasErrors = false;

for (const file of criticalFiles) {
  const filePath = path.resolve(projectRoot, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✓ ${file} (${stats.size} bytes)`);
  } else {
    console.error(`✗ Missing: ${file}`);
    hasErrors = true;
  }
}

const publicDir = path.resolve(projectRoot, 'dist/public');
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir);
  console.log(`\n📦 Build output contains ${files.length} files:`);
  files.slice(0, 10).forEach(file => {
    console.log(`  - ${file}`);
  });
  if (files.length > 10) {
    console.log(`  ... and ${files.length - 10} more files`);
  }
}

if (hasErrors) {
  console.error('\n❌ Build verification failed!');
  process.exit(1);
} else {
  console.log('\n✅ Build verification passed!');
}
