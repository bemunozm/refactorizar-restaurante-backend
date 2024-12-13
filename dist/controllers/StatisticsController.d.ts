import { Request, Response } from 'express';
export declare class StatisticsController {
    private readonly statisticsService;
    constructor();
    getDashboardStatistics(req: Request, res: Response): Promise<Response>;
    getPopularProducts(req: Request, res: Response): Promise<Response>;
    getBestHours(req: Request, res: Response): Promise<Response>;
    getEconomyStats(req: Request, res: Response): Promise<Response>;
    getOrderStats(req: Request, res: Response): Promise<Response>;
}
