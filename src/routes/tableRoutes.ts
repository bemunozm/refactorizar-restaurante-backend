import { Router } from "express";
import { TableController } from "../controllers/TableController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class TableRoute {
    private readonly tableController: TableController;
    public readonly router: Router;

    constructor() {
        this.tableController = new TableController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_TABLE"),
            [
                body("tableNumber").isInt({ min: 1 }).withMessage("El número de mesa debe ser un número entero positivo."),
                ValidationMiddleware.handleInputErrors
            ],
            this.tableController.createTable.bind(this.tableController)
        );

        this.router.get(
            "/get",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_TABLES"),
            this.tableController.getTables.bind(this.tableController)
        );

        this.router.get(
            "/get/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_TABLE"),
            param("id").isMongoId().withMessage("ID de mesa inválido."),
            ValidationMiddleware.handleInputErrors,
            this.tableController.getTable.bind(this.tableController)
        );

        this.router.put(
            "/update/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_TABLE"),
            [
                param("id").isMongoId().withMessage("ID de mesa inválido."),
                body("tableNumber").optional().isInt({ min: 1 }).withMessage("El número de mesa debe ser un número entero positivo."),
                ValidationMiddleware.handleInputErrors
            ],
            this.tableController.updateTable.bind(this.tableController)
        );

        this.router.delete(
            "/delete/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DELETE_TABLE"),
            param("id").isMongoId().withMessage("ID de mesa inválido."),
            ValidationMiddleware.handleInputErrors,
            this.tableController.deleteTable.bind(this.tableController)
        );
    }
}

export default new TableRoute().router;
