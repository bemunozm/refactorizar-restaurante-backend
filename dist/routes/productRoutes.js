"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const express_validator_1 = require("express-validator");
const validation_1 = __importDefault(require("../middleware/validation"));
const multer_1 = __importDefault(require("../config/multer"));
class ProductRoute {
    productController;
    router;
    constructor() {
        this.productController = new ProductController_1.ProductController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_PRODUCT"),
        multer_1.default.single("image"), [
            (0, express_validator_1.body)("name").isString().notEmpty(),
            (0, express_validator_1.body)("price").isNumeric(),
            (0, express_validator_1.body)("about").isString().optional(),
            (0, express_validator_1.body)("categoryId").notEmpty(),
        ], validation_1.default.handleInputErrors, this.productController.createProduct.bind(this.productController));
        this.router.get("/get", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
        this.productController.getProducts.bind(this.productController));
        this.router.get("/get/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_PRODUCT"),
        this.productController.getProduct.bind(this.productController));
        this.router.put("/update/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_PRODUCT"),
        multer_1.default.single("image"), [
            (0, express_validator_1.body)("name").isString().optional(),
            (0, express_validator_1.body)("price").isNumeric().optional(),
            (0, express_validator_1.body)("about").isString().optional(),
            (0, express_validator_1.body)("categoryId").notEmpty().optional(),
        ], validation_1.default.handleInputErrors, this.productController.updateProduct.bind(this.productController));
        this.router.delete("/delete/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("DELETE_PRODUCT"),
        this.productController.deleteProduct.bind(this.productController));
        this.router.get("/get-products-by-category/:categoryName", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
        this.productController.getProductsByCategory.bind(this.productController));
        this.router.get("/get-available-products", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
        this.productController.getAvailableProducts.bind(this.productController));
    }
}
exports.default = new ProductRoute().router;
//# sourceMappingURL=productRoutes.js.map