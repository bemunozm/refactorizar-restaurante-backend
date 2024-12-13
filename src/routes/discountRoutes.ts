import { Router } from 'express';
import { DiscountController } from '../controllers/DiscountController';
import AuthMiddleware from '../middleware/auth';
import PermissionMiddleware from '../middleware/permission';

class DiscountRoute {
    private readonly discountController: DiscountController;
    public readonly router: Router;

    constructor() {
        this.discountController = new DiscountController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            '/create-discount',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_DISCOUNT"),
            this.discountController.createDiscount.bind(this.discountController)
        );

        this.router.get(
            '/get-discounts',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_DISCOUNT"),
            this.discountController.getDiscounts.bind(this.discountController)
        );

        this.router.get(
            '/get-discount/:id',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_DISCOUNT"),
            this.discountController.getDiscountById.bind(this.discountController)
        );

        this.router.put(
            '/update-discount/:id',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_DISCOUNT"),
            this.discountController.updateDiscount.bind(this.discountController)
        );

        this.router.delete(
            '/delete-discount/:id',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DELETE_DISCOUNT"),
            this.discountController.deleteDiscount.bind(this.discountController)
        );

        this.router.post(
            '/validate-discount',
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VALIDATE_DISCOUNT"),
            this.discountController.validateDiscountByPromotionCode.bind(this.discountController)
        );

        this.router.post(
            '/validate-discount-online',
            this.discountController.validateDiscountByPromotionCodeOnline.bind(this.discountController)
        );
    }
}

export default new DiscountRoute().router; 