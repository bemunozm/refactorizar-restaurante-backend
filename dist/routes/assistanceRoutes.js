"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AssistanceController_1 = require("../controllers/AssistanceController");
const validation_1 = __importDefault(require("../middleware/validation"));
const express_validator_1 = require("express-validator");
class AssistanceRoute {
    assistanceController;
    router;
    constructor() {
        this.assistanceController = new AssistanceController_1.AssistanceController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_ASSISTANCE"),
        [
            (0, express_validator_1.body)("sessionId").isMongoId().withMessage("ID de sesión inválido."),
            (0, express_validator_1.body)("type")
                .isString()
                .isIn(["Pago con Tarjeta", "Pago con Efectivo", "Solicita Asistencia", "Pedido Listo"])
                .withMessage("Tipo de asistencia inválido."),
            (0, express_validator_1.body)("transactionToken")
                .optional()
                .isString()
                .withMessage("El token de transacción debe ser una cadena de texto."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.create.bind(this.assistanceController));
        this.router.put("/update-status", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_ASSISTANCE_STATUS"),
        [
            (0, express_validator_1.body)("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
            (0, express_validator_1.body)("status").isString().withMessage("Estado de asistencia inválido."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.updateStatus.bind(this.assistanceController));
        this.router.post("/assign", 
        // AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("ASSIGN_ASSISTANCE"),
        [
            (0, express_validator_1.body)("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
            (0, express_validator_1.body)("userId").isMongoId().withMessage("ID de usuario inválido."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.assign.bind(this.assistanceController));
        this.router.post("/complete", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("COMPLETE_ASSISTANCE"),
        [
            (0, express_validator_1.body)("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.complete.bind(this.assistanceController));
        this.router.post("/confirm", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CONFIRM_TRANSACTION"),
        [
            (0, express_validator_1.body)("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
            (0, express_validator_1.body)("transactionToken").isString().withMessage("El token de transacción debe ser una cadena de texto."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.confirmTransaction.bind(this.assistanceController));
        this.router.post("/decline", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("DECLINE_TRANSACTION"),
        [
            (0, express_validator_1.body)("assistanceId").isMongoId().withMessage("ID de asistencia inválido."),
            (0, express_validator_1.body)("transactionToken").isString().withMessage("El token de transacción debe ser una cadena de texto."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.declineTransaction.bind(this.assistanceController));
        this.router.get("/all", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ASSISTANCES"),
        this.assistanceController.getAll.bind(this.assistanceController));
        this.router.get("/all/:userId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_ASSISTANCE"),
        [
            (0, express_validator_1.param)("userId").isMongoId().withMessage("ID de usuario inválido."),
            validation_1.default.handleInputErrors
        ], this.assistanceController.getAvailableAssistances.bind(this.assistanceController));
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
exports.default = new AssistanceRoute().router;
//# sourceMappingURL=assistanceRoutes.js.map