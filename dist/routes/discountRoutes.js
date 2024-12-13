"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const DiscountController_1 = require("../controllers/DiscountController");
class DiscountRoute {
    discountController;
    router;
    constructor() {
        this.discountController = new DiscountController_1.DiscountController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post('/create-discount', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_DISCOUNT"),
        this.discountController.createDiscount.bind(this.discountController));
        this.router.get('/get-discounts', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DISCOUNT"),
        this.discountController.getDiscounts.bind(this.discountController));
        this.router.get('/get-discount/:id', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_DISCOUNT"),
        this.discountController.getDiscountById.bind(this.discountController));
        this.router.put('/update-discount/:id', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_DISCOUNT"),
        this.discountController.updateDiscount.bind(this.discountController));
        this.router.delete('/delete-discount/:id', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("DELETE_DISCOUNT"),
        this.discountController.deleteDiscount.bind(this.discountController));
        this.router.post('/validate-discount', 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VALIDATE_DISCOUNT"),
        this.discountController.validateDiscountByPromotionCode.bind(this.discountController));
        this.router.post('/validate-discount-online', this.discountController.validateDiscountByPromotionCodeOnline.bind(this.discountController));
    }
}
exports.default = new DiscountRoute().router;
//# sourceMappingURL=discountRoutes.js.map