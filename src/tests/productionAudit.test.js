import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('🔍 YATRAAI PRODUCTION ARTIFACT & RUNTIME AUDIT');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    passCount++;
    console.log(`  [PASS] ${message}`);
  } else {
    failCount++;
    console.error(`  [FAIL] ${message}`);
  }
}

// 1. Check dist directory & index.html
assert(fs.existsSync('dist/index.html'), 'dist/index.html exists');
const distHtml = fs.readFileSync('dist/index.html', 'utf8');

// 2. Check title and meta
assert(distHtml.includes('YatraAI'), 'HTML title contains YatraAI');
assert(distHtml.includes('leaflet.css'), 'Leaflet CSS is linked in head');

// 3. Find bundles in dist/assets
const assets = fs.readdirSync('dist/assets');
const jsBundle = assets.find(f => f.startsWith('index-') && f.endsWith('.js'));
const cssBundle = assets.find(f => f.startsWith('index-') && f.endsWith('.css'));

assert(!!jsBundle, `Production JS bundle generated (${jsBundle})`);
assert(!!cssBundle, `Production CSS bundle generated (${cssBundle})`);

const jsPath = path.join('dist/assets', jsBundle);
const jsContent = fs.readFileSync(jsPath, 'utf8');
const jsSizeKb = Math.round(jsContent.length / 1024);

assert(jsSizeKb > 100 && jsSizeKb < 1000, `JS bundle size is optimal: ${jsSizeKb} KB`);

// 4. Verify no secret leaks in production bundle
const hasExposedSecretKey = /AIza[0-9A-Za-z-_]{35}/.test(jsContent);
assert(!hasExposedSecretKey, 'Zero exposed Google Gemini API keys in JS bundle');

// 5. Verify core branding & intelligence strings are bundled
assert(jsContent.includes('YatraAI'), 'YatraAI branding present in bundle');
assert(jsContent.includes('Connecting Villages'), 'Tagline present in bundle');
assert(jsContent.includes('Sahyadri'), 'Sahyadri pilot context present in bundle');
assert(jsContent.includes('yatra_ai_'), 'LocalStorage key namespace present in bundle');
assert(jsContent.includes('openstreetmap.org'), 'OpenStreetMap tile server configured in bundle');

// 6. Check Vercel configuration
assert(fs.existsSync('vercel.json'), 'vercel.json configuration exists');
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
assert(vercelConfig.outputDirectory === 'dist', 'Vercel outputDirectory is set to dist');
assert(Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites.length > 0, 'Vercel rewrites configured for SPA routing');

// 7. Check .gitignore
assert(fs.existsSync('.gitignore'), '.gitignore file exists');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
assert(gitignore.includes('.env'), '.gitignore excludes .env files');
assert(gitignore.includes('node_modules'), '.gitignore excludes node_modules');
assert(gitignore.includes('dist'), '.gitignore excludes dist');

// 8. Check .env.example
assert(fs.existsSync('.env.example'), '.env.example template exists');

console.log('\n====================================================');
console.log(`📊 AUDIT RESULT: ${passCount} PASSED | ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
}
