import fs from 'fs';
import path from 'path';
import { minify } from 'terser';

const JS_ORDER = [
    'sidebar.js',
    'home.js',
    'suicide.js',
    'shop.js',
    'back.js',
];

const SRC_DIR = path.join(__dirname, '../../public/js');
const OUT_FILE = path.join(SRC_DIR, 'script.js');

async function minJs() {
    if (!fs.existsSync(SRC_DIR)) {
        fs.mkdirSync(SRC_DIR, { recursive: true });
    }

    let bundle = '';
    for (const file of JS_ORDER) {
        const filePath = path.join(SRC_DIR, file);
        if (fs.existsSync(filePath)) {
            bundle += fs.readFileSync(filePath, 'utf-8') + '\n';
        } else {
            console.warn(`⚠️ Warning: ${file} not found, skipping.`);
        }
    }

    try {
        const minified = await minify(bundle, {
            compress: true,
            mangle: true,
        });

        if (minified.code) {
            fs.writeFileSync(OUT_FILE, minified.code);
            console.log(`✅ JS bundled & minified → ${OUT_FILE}`);
        }
    } catch (err) {
        console.error('❌ JS build error:', err);
        process.exit(1);
    }
}

minJs();
