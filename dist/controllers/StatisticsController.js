"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatisticsController = void 0;
const StatisticsService_1 = require("../services/StatisticsService");
class StatisticsController {
    statisticsService;
    constructor() {
        this.statisticsService = new StatisticsService_1.StatisticsService();
    }
    async getDashboardStatistics(req, res) {
        try {
            const { startDate, endDate } = req.body;
            console.log(startDate, endDate);
            const dashboardStatistics = await this.statisticsService.getDashboardStatistics({ startDate, endDate });
            return res.status(200).json(dashboardStatistics);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas del dashboard" });
        }
    }
    async getPopularProducts(req, res) {
        try {
            const { startDate, endDate } = req.body;
            const popularProducts = await this.statisticsService.getPopularProducts({ startDate, endDate });
            return res.status(200).json(popularProducts);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los productos más populares" });
        }
    }
    async getBestHours(req, res) {
        try {
            const { startDate, endDate } = req.body;
            const bestHours = await this.statisticsService.getBestHours({ startDate, endDate });
            return res.status(200).json(bestHours);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las horas más populares" });
        }
    }
    async getEconomyStats(req, res) {
        try {
            const { startDate, endDate } = req.body;
            const economyStats = await this.statisticsService.getEconomyStats({ startDate, endDate });
            return res.status(200).json(economyStats);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas económicas" });
        }
    }
    async getOrderStats(req, res) {
        try {
            const { startDate, endDate } = req.body;
            const orderStats = await this.statisticsService.getOrderStats({ startDate, endDate });
            return res.status(200).json(orderStats);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las estadísticas de pedidos" });
        }
    }
}
exports.StatisticsController = StatisticsController;
//# sourceMappingURL=StatisticsController.js.map