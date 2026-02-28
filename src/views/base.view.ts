import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';

export const TEMPLATES_DIR = path.join(__dirname, 'templates');

export function readTemplate(name: string): string {
    return fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf8');
}

export function render(template: string, locals: Record<string, any>): string {
    return ejs.render(template, locals);
}
