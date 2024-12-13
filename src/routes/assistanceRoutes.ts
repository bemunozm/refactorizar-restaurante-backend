import { Router } from "express";
import { AssistanceController } from "../controllers/AssistanceController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class AssistanceRoute {
    private readonly assistanceController: AssistanceController;
    public readonly router: Router;

    constructor() {
        this.assistanceController = new AssistanceController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_ASSISTANCE"),
            [
                body("sessionId").isMongoId().withMessage("ID de sesión inválido."),
                body("type")
                    .isString()
                    .isIn(["Pago con Tarjeta", "Pago con Efectivo", "Solicita Asistencia", "Pedido Listo"])
                    .withMessage("Tipo de asistencia inválido."),
                body("transactionToken")
                    .optional()
                    .isString()
                    .withMessage("El token de transacción debe ser una cadena de texto."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.create.bind(this.assistanceController)
        );

        this.router.put(
            "/update-status",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_ASSISTANCE_STATUS"),
            [
                body("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
                body("status").isString().withMessage("Estado de asistencia inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.updateStatus.bind(this.assistanceController)
        );

        this.router.post(
            "/assign",
           // AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("ASSIGN_ASSISTANCE"),
            [
                body("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
                body("userId").isMongoId().withMessage("ID de usuario inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.assign.bind(this.assistanceController)
        );

        this.router.post(
            "/complete",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("COMPLETE_ASSISTANCE"),
            [
                body("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.complete.bind(this.assistanceController)
        );

        this.router.post(
            "/confirm",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CONFIRM_TRANSACTION"),
            [
                body("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
                body("transactionToken").isString().withMessage("El token de transacción debe ser una cadena de texto."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.confirmTransaction.bind(this.assistanceController)
        );

        this.router.post(
            "/decline",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DECLINE_TRANSACTION"),
            [
                body("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
                body("transactionToken").isString().withMessage("El token de transacción debe ser una cadena de texto."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.declineTransaction.bind(this.assistanceController)
        );

        this.router.get(
            "/all",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_ASSISTANCES"),
            this.assistanceController.getAll.bind(this.assistanceController)
        );

        this.router.get(
            "/all/:userId",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_ASSISTANCE"),
            [
                param("userId").isMongoId().withMessage("ID de usuario inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.assistanceController.getAvailableAssistances.bind(this.assistanceController)
        );

        // this.router.get(
        //     "/session/:sessionId",
        //     AuthMiddleware.authenticate,
        //     PermissionMiddleware.checkPermission("VIEW_ASSISTANCES"),
        //     [
        //         param("sessionId").isMongoId().withMessage("ID de sesión inválido."),
        //         ValidationMiddleware.handleInputErrors
        //     ],
        //     this.assistanceController.getBySession.bind(this.assistanceController)
        // );

        // this.router.get(
        //     "/user/:userId",
        //     AuthMiddleware.authenticate,
        //     PermissionMiddleware.checkPermission("VIEW_ASSISTANCES"),
        //     [
        //         param("userId").isMongoId().withMessage("ID de usuario inválido."),
        //         ValidationMiddleware.handleInputErrors
        //     ],
        //     this.assistanceController.getByUser.bind(this.assistanceController)
        // );
    }
}

export default new AssistanceRoute().router;
