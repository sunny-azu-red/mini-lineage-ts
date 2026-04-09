import { Request, Response } from 'express';
import { statisticsRepository } from '@/repository/statistics.repository';
import { renderStatisticsView } from '@/view/statistics.view';

export const getStatistics = async (req: Request, res: Response) => {
    const stats = await statisticsRepository.getAll();
    if (!stats) {
        return res.status(500).send('Statistics not found');
    }

    res.send(renderStatisticsView(stats));
};
