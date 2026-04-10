import { NextFunction, Request, Response } from 'express';
import { statisticsRepository } from '@/repository/statistics.repository';
import { renderStatisticsView } from '@/view/statistics.view';

export const getStatistics = async (req: Request, res: Response, next: NextFunction) => {
    const stats = await statisticsRepository.getAll();
    if (!stats)
        return next(new Error('The ancient archives are empty and the lore of the realm has been lost to time.'));

    res.send(renderStatisticsView(stats));
};
