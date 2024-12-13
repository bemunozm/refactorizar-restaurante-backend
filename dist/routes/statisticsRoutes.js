"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StatisticsController_1 = require("../controllers/StatisticsController");
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
class StatisticsRoute {
    statisticsController;
    router;
    constructor() {
        this.statisticsController = new StatisticsController_1.StatisticsController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/dashboard", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_STATISTICS"), this.statisticsController.getDashboardStatistics.bind(this.statisticsController));
        this.router.post("/popular-products", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_STATISTICS"), this.statisticsController.getPopularProducts.bind(this.statisticsController));
        this.router.post("/best-hours", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_STATISTICS"), this.statisticsController.getBestHours.bind(this.statisticsController));
        this.router.post("/economy", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_STATISTICS"), this.statisticsController.getEconomyStats.bind(this.statisticsController));
        this.router.post("/order-stats", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_STATISTICS"), this.statisticsController.getOrderStats.bind(this.statisticsController));
    }
}
exports.default = new StatisticsRoute().router;
//# sourceMappingURL=statisticsRoutes.js.map