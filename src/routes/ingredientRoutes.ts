import { Router } from "express";
import { IngredientController } from "../controllers/IngredientController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";
import upload from "../config/multer";

class IngredientRoute {
    private readonly ingredientController: IngredientController;
    public readonly router: Router;

    constructor() {
        this.ingredientController = new IngredientController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("CREATE_INGREDIENT"),
            upload.single("image"),
            [
                body("name").isString().notEmpty().withMessage("El nombre del ingrediente es obligatorio."),
                body("stockQuantity").isNumeric().withMessage("La cantidad en stock debe ser un número."),
                body("unit").isString().notEmpty().withMessage("La unidad es obligatoria."),
                ValidationMiddleware.handleInputErrors
            ],
            this.ingredientController.createIngredient.bind(this.ingredientController)
        );

        this.router.get(
            "/get",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_INGREDIENTS"),
            this.ingredientController.getIngredients.bind(this.ingredientController)
        );

        this.router.get(
            "/get/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_INGREDIENT"),
            param("id").isMongoId().withMessage("ID de ingrediente inválido."),
            ValidationMiddleware.handleInputErrors,
            this.ingredientController.getIngredient.bind(this.ingredientController)
        );

        this.router.put(
            "/update/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("UPDATE_INGREDIENT"),
            upload.single("image"),
            [
                param("id").isMongoId().withMessage("ID de ingrediente inválido."),
                body("name").optional().isString().notEmpty().withMessage("El nombre debe ser una cadena no vacía."),
                body("stockQuantity").optional().isNumeric().withMessage("La cantidad en stock debe ser un número."),
                body("unit").optional().isString().notEmpty().withMessage("La unidad debe ser una cadena no vacía."),
                ValidationMiddleware.handleInputErrors
            ],
            this.ingredientController.updateIngredient.bind(this.ingredientController)
        );

        this.router.delete(
            "/delete/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("DELETE_INGREDIENT"),
            param("id").isMongoId().withMessage("ID de ingrediente inválido."),
            ValidationMiddleware.handleInputErrors,
            this.ingredientController.deleteIngredient.bind(this.ingredientController)
        );
    }
}

export default new IngredientRoute().router;
