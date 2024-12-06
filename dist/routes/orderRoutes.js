"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrderController_1 = require("../controllers/OrderController");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
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
        this.router.post("/create", 
        // AuthMiddleware.authenticate,
        // PermissionMiddleware.checkPermission("CREATE_ORDER"),
        // [
        //     body("sessionId").isMongoId().withMessage("ID de sesión inválido."),
        //     body("tableId").isMongoId().withMessage("ID de mesa inválido."),
        //     body("items").isArray({ min: 1 }).withMessage("Debe incluir al menos un producto en el pedido."),
        //     body("items.*.productId").isMongoId().withMessage("ID de producto inválido."),
        //     body("items.*.quantity").isInt({ min: 1 }).withMessage("La cantidad debe ser un número entero mayor a 0."),
        //     ValidationMiddleware.handleInputErrors
        // ],
        this.orderController.orderProducts.bind(this.orderController));
        this.router.get("/get", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
        this.orderController.getOrders.bind(this.orderController));
        this.router.get("/get/:orderId", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_ORDER"),
        //param("orderId").isMongoId().withMessage("ID de orden inválido."),
        validation_1.default.handleInputErrors, this.orderController.getOrderById.bind(this.orderController));
        this.router.get("/session/:sessionId", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
        //param("sessionId").isMongoId().withMessage("ID de sesión inválido."),
        validation_1.default.handleInputErrors, this.orderController.getOrdersBySessionId.bind(this.orderController));
        this.router.get("/user/:userId", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_USER_ORDERS"),
        (0, express_validator_1.param)("userId").isMongoId().withMessage("ID de usuario inválido."), validation_1.default.handleInputErrors, this.orderController.getOrdersByUserId.bind(this.orderController));
        this.router.get("/kitchen", auth_1.default.authenticate, 
        //  PermissionMiddleware.checkPermission("VIEW_ORDERS_KITCHEN"),
        this.orderController.getOrdersForKitchen.bind(this.orderController));
        this.router.put("/update-item-status/:itemId", auth_1.default.authenticate, 
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