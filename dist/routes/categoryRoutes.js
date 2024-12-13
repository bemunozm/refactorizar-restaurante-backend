"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = require("../controllers/CategoryController");
const validation_1 = __importDefault(require("../middleware/validation"));
const express_validator_1 = require("express-validator");
const multer_1 = __importDefault(require("../config/multer"));
class CategoryRoute {
    categoryController;
    router;
    constructor() {
        this.categoryController = new CategoryController_1.CategoryController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_CATEGORY"),
        multer_1.default.single("image"), [
            (0, express_validator_1.body)("name").isString().notEmpty().withMessage("El nombre de la categoría es obligatorio."),
            (0, express_validator_1.body)("description").isString().optional(),
            validation_1.default.handleInputErrors
        ], this.categoryController.createCategory.bind(this.categoryController));
        this.router.get("/get", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_CATEGORIES"),
        this.categoryController.getCategories.bind(this.categoryController));
        this.router.get("/get/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_CATEGORY"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de categoría inválido."), validation_1.default.handleInputErrors, this.categoryController.getCategory.bind(this.categoryController));
        this.router.put("/update/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_CATEGORY"),
        multer_1.default.single("image"), [
            (0, express_validator_1.param)("id").isMongoId().withMessage("ID de categoría inválido."),
            (0, express_validator_1.body)("name").isString().optional(),
            (0, express_validator_1.body)("description").isString().optional(),
            validation_1.default.handleInputErrors
        ], this.categoryController.updateCategory.bind(this.categoryController));
        this.router.delete("/delete/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("DELETE_CATEGORY"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de categoría inválido."), validation_1.default.handleInputErrors, this.categoryController.deleteCategory.bind(this.categoryController));
    }
}
exports.default = new CategoryRoute().router;
//# sourceMappingURL=categoryRoutes.js.map