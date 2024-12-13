"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DeliveryController_1 = require("../controllers/DeliveryController");
class DeliveryRoute {
    deliveryController;
    router;
    constructor() {
        this.deliveryController = new DeliveryController_1.DeliveryController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get('/incomplete', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DELIVERIES"),
        this.deliveryController.getIncompleteDeliveries.bind(this.deliveryController));
        this.router.get('/order/:orderId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ORDER"),
        this.deliveryController.getDeliveryByOrderId.bind(this.deliveryController));
        this.router.post('/create', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_DELIVERY"),
        this.deliveryController.create.bind(this.deliveryController));
        this.router.get('/get', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DELIVERIES"),
        this.deliveryController.get.bind(this.deliveryController));
        this.router.post('/assign', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("ASSIGN_ASSISTANCE"),
        this.deliveryController.assign.bind(this.deliveryController));
        this.router.post('/start', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_DELIVERY_STATUS"),
        this.deliveryController.start.bind(this.deliveryController));
        this.router.put('/update-status', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_DELIVERY_STATUS"),
        this.deliveryController.updateStatus.bind(this.deliveryController));
        this.router.get('/user/:userId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DELIVERIES"),
        this.deliveryController.getDeliveriesByUserId.bind(this.deliveryController));
        this.router.get('/:deliveryId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DELIVERIES"),
        this.deliveryController.getById.bind(this.deliveryController));
        this.router.put('/complete/:deliveryId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("COMPLETE_ASSISTANCE"),
        this.deliveryController.complete.bind(this.deliveryController));
        this.router.put('/in-progress/:deliveryId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_DELIVERY_STATUS"),
        this.deliveryController.inProgress.bind(this.deliveryController));
        this.router.put('/pending/:deliveryId', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_DELIVERY_STATUS"),
        this.deliveryController.pending.bind(this.deliveryController));
    }
}
exports.default = new DeliveryRoute().router;
//# sourceMappingURL=deliveryRoutes.js.map