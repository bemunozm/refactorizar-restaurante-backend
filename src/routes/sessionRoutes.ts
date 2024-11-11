import { Router } from "express";
import { SessionController } from "../controllers/SessionController";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";
import { body, param } from "express-validator";

class SessionRoute {
    private readonly sessionController: SessionController;
    public readonly router: Router;

    constructor() {
        this.sessionController = new SessionController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/create-session",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_SESSION"),
            [
                body("tableId").isMongoId().withMessage("ID de mesa inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.sessionController.createSession.bind(this.sessionController)
        );

        this.router.get(
            "/get",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_SESSIONS"),
            this.sessionController.getAllSessions.bind(this.sessionController)
        );

        this.router.get(
            "/get/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_SESSION"),
            param("id").isMongoId().withMessage("ID de sesión inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.getSessionById.bind(this.sessionController)
        );

        this.router.put(
            "/update/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("UPDATE_SESSION"),
            param("id").isMongoId().withMessage("ID de sesión inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.updateSession.bind(this.sessionController)
        );

        this.router.delete(
            "/delete/:id",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("DELETE_SESSION"),
            param("id").isMongoId().withMessage("ID de sesión inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.deleteSession.bind(this.sessionController)
        );

        this.router.get(
            "/get-session-by-table/:tableId",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_SESSION"),
            param("tableId").isMongoId().withMessage("ID de mesa inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.getSessionByTableId.bind(this.sessionController)
        );

        this.router.post(
            "/add-guest/:sessionId",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("ADD_GUEST_TO_SESSION"),
            [
                param("sessionId").isMongoId().withMessage("ID de sesión inválido."),
                body("guestName").isString().notEmpty().withMessage("El nombre del invitado es obligatorio."),
                body("userId").optional().isMongoId().withMessage("ID de usuario inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.sessionController.addGuestToSession.bind(this.sessionController)
        );

        this.router.post(
            "/transfer-orders",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("TRANSFER_GUEST_ORDERS"),
            [
                body("guestId").isMongoId().withMessage("ID de invitado inválido."),
                body("userId").isMongoId().withMessage("ID de usuario inválido."),
                ValidationMiddleware.handleInputErrors
            ],
            this.sessionController.transferGuestOrdersToUser.bind(this.sessionController)
        );

        this.router.post(
            "/validate-token",
            //AuthMiddleware.authenticate,
            [
                body("token").isString().notEmpty().withMessage("El token es obligatorio."),
                ValidationMiddleware.handleInputErrors
            ],
            this.sessionController.validateToken.bind(this.sessionController)
        );

        this.router.get(
            "/check/:tableId",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CHECK_SESSION"),
            param("tableId").isMongoId().withMessage("ID de mesa inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.checkSessionExists.bind(this.sessionController)
        );

        this.router.get(
            "/:sessionId/token",
            //AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_SESSION_TOKEN"),
            param("sessionId").isMongoId().withMessage("ID de sesión inválido."),
            ValidationMiddleware.handleInputErrors,
            this.sessionController.getSessionToken.bind(this.sessionController)
        );
    }
}

export default new SessionRoute().router;
