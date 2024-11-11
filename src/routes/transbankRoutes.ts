import { Router } from "express";
import { TransbankController } from "../controllers/TransbankController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class TransbankRoute {
    private readonly transbankController: TransbankController;
    public readonly router: Router;

    constructor() {
        this.transbankController = new TransbankController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        // Ruta para crear una transacción
        this.router.post(
            "/create-transaction",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_TRANSACTION"),
            [
                body("amount").isFloat({ gt: 0 }).withMessage("El monto debe ser un número positivo."),
                body("sessionId").isMongoId().withMessage("ID de sesión inválido."),
                body("orders").isArray({ min: 1 }).withMessage("Debe incluir al menos un pedido en la transacción."),
                ValidationMiddleware.handleInputErrors
            ],
            this.transbankController.createTransaction.bind(this.transbankController)
        );

        // Ruta para confirmar una transacción
        this.router.post(
            "/confirm-transaction",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CONFIRM_TRANSACTION"),
            [
                body("token").isString().withMessage("El token es obligatorio."),
                ValidationMiddleware.handleInputErrors
            ],
            this.transbankController.confirmTransaction.bind(this.transbankController)
        );

        // Ruta para actualizar el estado de una transacción
        this.router.put(
            "/update-transaction-status",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_TRANSACTION_STATUS"),
            [
                body("transactionId").isMongoId().withMessage("ID de transacción inválido."),
                body("status").isString().withMessage("El estado es obligatorio."),
                ValidationMiddleware.handleInputErrors
            ],
            this.transbankController.updateTransactionStatus.bind(this.transbankController)
        );
    }
}

export default new TransbankRoute().router;
