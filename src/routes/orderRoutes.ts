import { Router } from "express";
import { OrderController } from "../controllers/OrderController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class OrderRoute {
    private readonly orderController: OrderController;
    public readonly router: Router;

    constructor() {
        this.orderController = new OrderController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
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
            this.orderController.orderProducts.bind(this.orderController)
        );

        this.router.get(
            "/get",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
            this.orderController.getOrders.bind(this.orderController)
        );

        this.router.get(
            "/get/:orderId",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_ORDER"),
            //param("orderId").isMongoId().withMessage("ID de orden inválido."),
            ValidationMiddleware.handleInputErrors,
            this.orderController.getOrderById.bind(this.orderController)
        );

        this.router.get(
            "/session/:sessionId",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_ORDERS"),
            //param("sessionId").isMongoId().withMessage("ID de sesión inválido."),
            ValidationMiddleware.handleInputErrors,
            this.orderController.getOrdersBySessionId.bind(this.orderController)
        );

        this.router.get(
            "/user/:userId",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_USER_ORDERS"),
            param("userId").isMongoId().withMessage("ID de usuario inválido."),
            ValidationMiddleware.handleInputErrors,
            this.orderController.getOrdersByUserId.bind(this.orderController)
        );

        this.router.get(
            "/kitchen",
            AuthMiddleware.authenticate,
            //  PermissionMiddleware.checkPermission("VIEW_ORDERS_KITCHEN"),
            this.orderController.getOrdersForKitchen.bind(this.orderController)
        );

        this.router.put(
            "/update-item-status/:itemId",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_ORDER_ITEM_STATUS"),
            [
                param("itemId").isMongoId().withMessage("ID de ítem inválido."),
                body("status")
                    .isString()
                    .isIn(["Pendiente", "En Preparacion", "Listo", "Cancelado", "Entregado"])
                    .withMessage("Estado de ítem inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.orderController.updateOrderItemStatus.bind(this.orderController)
        );
    }
}

export default new OrderRoute().router;
