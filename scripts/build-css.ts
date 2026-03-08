import fs from 'fs';
import path from 'path';
import CleanCSS from 'clean-css';

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

const { styles, errors } = new CleanCSS({ level: 2 }).minify(bundle);
if (errors.length) {
    console.error('❌ CSS minification errors:', errors);
    process.exit(1);
}

fs.writeFileSync(OUT_FILE, styles);
console.log(`✅ CSS bundled & minified → ${OUT_FILE}`);

