import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

import { body } from "express-validator";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import ValidationMiddleware from "../middleware/validation";
import upload from "../config/multer";

class ProductRoute {
    private readonly productController: ProductController;
    public readonly router: Router;

    constructor() {
        this.productController = new ProductController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_PRODUCT"),
            upload.single("image"),
            [
                body("name").isString().notEmpty(),
                body("price").isNumeric(),
                body("about").isString().optional(),
                body("categoryId").notEmpty(),
            ],
            ValidationMiddleware.handleInputErrors,
            this.productController.createProduct.bind(this.productController)
        );

        this.router.get(
            "/get",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
            this.productController.getProducts.bind(this.productController)
        );

        this.router.get(
            "/get/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_PRODUCT"),
            this.productController.getProduct.bind(this.productController)
        );

        this.router.put(
            "/update/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_PRODUCT"),
            upload.single("image"),
            [
                body("name").isString().optional(),
                body("price").isNumeric().optional(),
                body("about").isString().optional(),
                body("categoryId").notEmpty().optional(),
            ],
            ValidationMiddleware.handleInputErrors,
            this.productController.updateProduct.bind(this.productController)
        );

        this.router.delete(
            "/delete/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DELETE_PRODUCT"),
            this.productController.deleteProduct.bind(this.productController)
        );

        this.router.get(
            "/get-products-by-category/:categoryName",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
            this.productController.getProductsByCategory.bind(this.productController)
        );

        this.router.get(
            "/get-available-products",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
            this.productController.getAvailableProducts.bind(this.productController)
        );
    }
}

export default new ProductRoute().router;
