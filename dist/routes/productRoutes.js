"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = require("../controllers/ProductController");
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
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
        //AuthMiddleware.authenticate, // Verifica que el usuario esté autenticado
        //PermissionMiddleware.checkPermission("CREATE_PRODUCT"), // Verifica que tenga el permiso adecuado
        multer_1.default.single("image"), // Sube la imagen del producto
        [
        // body("name").isString().notEmpty(),
        // body("price").isNumeric(),
        // body("about").isString().optional(),
        // body("categoryId").notEmpty(),
        // body("ingredients").isArray().notEmpty()
        ], validation_1.default.handleInputErrors, // Maneja los errores de validación
        this.productController.createProduct.bind(this.productController));
        this.router.get("/get", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_PRODUCTS"), this.productController.getProducts.bind(this.productController));
        this.router.get("/get/:id", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_PRODUCT"), this.productController.getProduct.bind(this.productController));
        this.router.put("/update/:id", auth_1.default.authenticate, permission_1.default.checkPermission("UPDATE_PRODUCT"), multer_1.default.single("image"), [
        // body("name").isString().optional(),
        // body("price").isNumeric().optional(),
        // body("about").isString().optional(),
        // body("categoryId").notEmpty().optional(),
        // body("ingredients").isArray().optional()
        ], validation_1.default.handleInputErrors, this.productController.updateProduct.bind(this.productController));
        this.router.delete("/delete/:id", auth_1.default.authenticate, permission_1.default.checkPermission("DELETE_PRODUCT"), this.productController.deleteProduct.bind(this.productController));
        this.router.get("/get-products-by-category/:categoryName", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_PRODUCTS"),
        this.productController.getProductsByCategory.bind(this.productController));
    }
}
exports.default = new ProductRoute().router;
//# sourceMappingURL=productRoutes.js.map