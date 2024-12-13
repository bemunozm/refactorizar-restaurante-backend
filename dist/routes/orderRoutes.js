"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const validation_1 = __importDefault(require("../middleware/validation"));
const express_validator_1 = require("express-validator");
class OrderRoute {
    orderController;
    router;
    constructor() {
        this.orderController = new OrderController_1.OrderController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", this.orderController.orderProducts.bind(this.orderController));
        this.router.get("/get", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
        this.orderController.getOrders.bind(this.orderController));
        this.router.get("/get/:orderId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ORDER"),
        (0, express_validator_1.param)("orderId").isMongoId().withMessage("ID de orden inválido."), validation_1.default.handleInputErrors, this.orderController.getOrderById.bind(this.orderController));
        this.router.get("/session/:sessionId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
        (0, express_validator_1.param)("sessionId").isMongoId().withMessage("ID de sesión inválido."), validation_1.default.handleInputErrors, this.orderController.getOrdersBySessionId.bind(this.orderController));
        this.router.get("/user/:userId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_USER_ORDERS"),
        (0, express_validator_1.param)("userId").isMongoId().withMessage("ID de usuario inválido."), validation_1.default.handleInputErrors, this.orderController.getOrdersByUserId.bind(this.orderController));
        this.router.get("/kitchen", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_KITCHEN"),
        this.orderController.getOrdersForKitchen.bind(this.orderController));
        this.router.put("/update-item-status/:itemId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_ORDER_ITEM_STATUS"),
        [
            (0, express_validator_1.param)("itemId").isMongoId().withMessage("ID de ítem inválido."),
            (0, express_validator_1.body)("status")
                .isString()
                .isIn(["Pendiente", "En Preparacion", "Listo", "Cancelado", "Entregado"])
                .withMessage("Estado de ítem inválido."),
            validation_1.default.handleInputErrors
        ], this.orderController.updateOrderItemStatus.bind(this.orderController));
    }
}
exports.default = new OrderRoute().router;
//# sourceMappingURL=orderRoutes.js.map