import { StatisticsService } from "../services/StatisticsService";
import { Request, Response } from 'express';

export class StatisticsController {
    private readonly statisticsService: StatisticsService;

    constructor() {
        this.statisticsService = new StatisticsService();
    }

    public async getDashboardStatistics(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            console.log(startDate, endDate);
            const dashboardStatistics = await this.statisticsService.getDashboardStatistics({ startDate, endDate });
            return res.status(200).json(dashboardStatistics);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas del dashboard" });
        }
    }

    public async getPopularProducts(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            const popularProducts = await this.statisticsService.getPopularProducts({ startDate, endDate });
            return res.status(200).json(popularProducts);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener los productos más populares" });
        }
    }
    
    public async getBestHours(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            const bestHours = await this.statisticsService.getBestHours({ startDate, endDate });
            return res.status(200).json(bestHours);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las horas más populares" });
        }
    }

    public async getEconomyStats(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            const economyStats = await this.statisticsService.getEconomyStats({ startDate, endDate });
            return res.status(200).json(economyStats);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas económicas" });
        }
    }

    public async getOrderStats(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            const orderStats = await this.statisticsService.getOrderStats({ startDate, endDate });
            return res.status(200).json(orderStats);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas de pedidos" });
        }
    }

    public async getTableStats(req: Request, res: Response): Promise<Response> {
        try {
            const { startDate, endDate } = req.body;
            const tableStats = await this.statisticsService.getTableStats({ startDate, endDate });
            return res.status(200).json(tableStats);
        } catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas de las mesas" });
        }
    }
}