import * as fs from 'fs';
import * as path from 'path';

let cachedVersion: string | null = null;

export function getVersion(): string {
    if (cachedVersion)
        return cachedVersion;

    try {
        const versionPath = path.join(__dirname, '../version.txt');
        if (fs.existsSync(versionPath)) {
            cachedVersion = fs.readFileSync(versionPath, 'utf8').trim();
            return cachedVersion;
        }
    } catch (err) {
    }

    return '⚡development';
}

export function isRelease(version: string): boolean {
    return version.length === 7 && /^[0-9a-f]+$/i.test(version);
}
