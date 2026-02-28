import * as ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { Template } from '../common/types';

export const TEMPLATES_DIR = path.join(__dirname, 'templates');

export function readTemplate(name: string): Template {
    return {
        content: fs.readFileSync(path.join(TEMPLATES_DIR, name), 'utf8'),
        filename: name
    };
}

export function render(template: Template, locals: Record<string, any> = {}): string {
    return ejs.render(template.content, locals, {
        filename: path.join(TEMPLATES_DIR, template.filename),
        root: TEMPLATES_DIR
    });
}
