import { readTemplate, render } from './base.view';
import { renderSimplePage } from './layout.view';
import { formatAdena, pluralize, fillTemplate } from '@/util';
import { Statistics } from '@/interface';

const statisticsTpl = readTemplate('statistics.ejs');

export function renderStatisticsView(stats: Statistics): string {
    const content = render(statisticsTpl, {
        stats,
        pluralize,
        formatAdena,
        fillTemplate
    });

    return renderSimplePage('The Tome of Lore', content);
}
