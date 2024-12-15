import { Router } from "express";
import { StatisticsController } from "../controllers/StatisticsController";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";

class StatisticsRoute {
    private readonly statisticsController: StatisticsController;
    public readonly router: Router;

    constructor() {
        this.statisticsController = new StatisticsController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/dashboard",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getDashboardStatistics.bind(this.statisticsController)
        );
        this.router.post(
            "/popular-products",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getPopularProducts.bind(this.statisticsController)
        );
        this.router.post(
            "/best-hours",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getBestHours.bind(this.statisticsController)
        );
        this.router.post(
            "/economy",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getEconomyStats.bind(this.statisticsController)
        );
        this.router.post(
            "/order-stats",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getOrderStats.bind(this.statisticsController)
        );
        this.router.post(
            "/table-stats",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_STATISTICS"),
            this.statisticsController.getTableStats.bind(this.statisticsController)
        );
    }
}

export default new StatisticsRoute().router;
