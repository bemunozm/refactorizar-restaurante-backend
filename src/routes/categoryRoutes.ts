import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";
import upload from "../config/multer";

class CategoryRoute {
    private readonly categoryController: CategoryController;
    public readonly router: Router;

    constructor() {
        this.categoryController = new CategoryController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_CATEGORY"),
            upload.single("image"),
            [
                body("name").isString().notEmpty().withMessage("El nombre de la categoría es obligatorio."),
                body("description").isString().optional(),
                ValidationMiddleware.handleInputErrors
            ],
            this.categoryController.createCategory.bind(this.categoryController)
        );

        this.router.get(
            "/get",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_CATEGORIES"),
            this.categoryController.getCategories.bind(this.categoryController)
        );

        this.router.get(
            "/get/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_CATEGORY"),
            param("id").isMongoId().withMessage("ID de categoría inválido."),
            ValidationMiddleware.handleInputErrors,
            this.categoryController.getCategory.bind(this.categoryController)
        );

        this.router.put(
            "/update/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_CATEGORY"),
            upload.single("image"),
            [
                param("id").isMongoId().withMessage("ID de categoría inválido."),
                body("name").isString().optional(),
                body("description").isString().optional(),
                ValidationMiddleware.handleInputErrors
            ],
            this.categoryController.updateCategory.bind(this.categoryController)
        );

        this.router.delete(
            "/delete/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DELETE_CATEGORY"),
            param("id").isMongoId().withMessage("ID de categoría inválido."),
            ValidationMiddleware.handleInputErrors,
            this.categoryController.deleteCategory.bind(this.categoryController)
        );
    }
}

export default new CategoryRoute().router;
