import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class RoleRoute {
    private readonly roleController: RoleController;
    public readonly router: Router;

    constructor() {
        this.roleController = new RoleController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.get(
            "/permissions",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_PERMISSIONS"),
            this.roleController.getPermissions.bind(this.roleController)
        );

        this.router.post(
            "/create",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("CREATE_ROLE"),
            [
                body("name").isString().notEmpty().withMessage("El nombre del rol es obligatorio."),
                body("permissions").isArray().withMessage("Los permisos deben ser un array."),
                body("permissions.*").isString().withMessage("Cada permiso debe ser una cadena de texto."),
                ValidationMiddleware.handleInputErrors
            ],
            this.roleController.createRole.bind(this.roleController)
        );

        this.router.get(
            "/get",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_ROLES"),
            this.roleController.getRoles.bind(this.roleController)
        );

        this.router.get(
            "/get/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_ROLE"),
            param("id").isMongoId().withMessage("ID de rol inválido."),
            ValidationMiddleware.handleInputErrors,
            this.roleController.getRoleById.bind(this.roleController)
        );

        this.router.put(
            "/update/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("UPDATE_ROLE"),
            [
                param("id").isMongoId().withMessage("ID de rol inválido."),
                body("name").isString().optional(),
                body("permissions").isArray().optional(),
                body("permissions.*").isString().optional(),
                ValidationMiddleware.handleInputErrors
            ],
            this.roleController.updateRole.bind(this.roleController)
        );

        this.router.delete(
            "/delete/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("DELETE_ROLE"),
            param("id").isMongoId().withMessage("ID de rol inválido."),
            ValidationMiddleware.handleInputErrors,
            this.roleController.deleteRole.bind(this.roleController)
        );
    }
}

export default new RoleRoute().router;
