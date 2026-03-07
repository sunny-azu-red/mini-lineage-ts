import fs from 'fs';
import path from 'path';

const CSS_ORDER = [
    'tokens.css',
    'base.css',
    'layout.css',
    'forms.css',
    'tables.css',
    'buttons.css',
    'components.css',
];

const SRC_DIR = path.join(__dirname, '../public/css');
const OUT_FILE = path.join(SRC_DIR, 'style.css');
if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
}

let bundle = '';
for (const file of CSS_ORDER) {
    const filePath = path.join(SRC_DIR, file);
    if (fs.existsSync(filePath)) {
        bundle += fs.readFileSync(filePath, 'utf-8') + '\n';
    } else {
        console.warn(`⚠️  Warning: ${file} not found, skipping.`);
    }
}

fs.writeFileSync(OUT_FILE, bundle);
console.log(`✅ CSS bundled → ${OUT_FILE}`);
