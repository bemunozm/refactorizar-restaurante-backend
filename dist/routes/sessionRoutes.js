"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const validation_1 = __importDefault(require("../middleware/validation"));
const express_validator_1 = require("express-validator");
class SessionRoute {
    sessionController;
    router;
    constructor() {
        this.sessionController = new SessionController_1.SessionController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/create-session", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_SESSION"),
        [
            //body("tableId").isMongoId().withMessage("ID de mesa inválido."),
            validation_1.default.handleInputErrors
        ], this.sessionController.createSession.bind(this.sessionController));
        this.router.get("/get", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_SESSIONS"),
        this.sessionController.getAllSessions.bind(this.sessionController));
        this.router.get("/get/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_SESSION"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de sesión inválido."), validation_1.default.handleInputErrors, this.sessionController.getSessionById.bind(this.sessionController));
        this.router.put("/update/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_SESSION"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de sesión inválido."), validation_1.default.handleInputErrors, this.sessionController.updateSession.bind(this.sessionController));
        this.router.delete("/delete/:id", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("DELETE_SESSION"),
        (0, express_validator_1.param)("id").isMongoId().withMessage("ID de sesión inválido."), validation_1.default.handleInputErrors, this.sessionController.deleteSession.bind(this.sessionController));
        this.router.get("/get-session-by-table/:tableId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_SESSION"),
        (0, express_validator_1.param)("tableId").isMongoId().withMessage("ID de mesa inválido."), validation_1.default.handleInputErrors, this.sessionController.getSessionByTableId.bind(this.sessionController));
        this.router.post("/add-guest/:sessionId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("ADD_GUEST_TO_SESSION"),
        [
            (0, express_validator_1.param)("sessionId").isMongoId().withMessage("ID de sesión inválido."),
            (0, express_validator_1.body)("guestName").isString().notEmpty().withMessage("El nombre del invitado es obligatorio."),
            (0, express_validator_1.body)("userId").optional().isMongoId().withMessage("ID de usuario inválido."),
            validation_1.default.handleInputErrors
        ], this.sessionController.addGuestToSession.bind(this.sessionController));
        this.router.post("/transfer-orders", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("TRANSFER_GUEST_ORDERS"),
        [
            (0, express_validator_1.body)("guestId").isMongoId().withMessage("ID de invitado inválido."),
            (0, express_validator_1.body)("userId").isMongoId().withMessage("ID de usuario inválido."),
            validation_1.default.handleInputErrors
        ], this.sessionController.transferGuestOrdersToUser.bind(this.sessionController));
        this.router.post("/validate-token", 
        //AuthMiddleware.authenticate,
        [
            (0, express_validator_1.body)("token").isString().notEmpty().withMessage("El token es obligatorio."),
            validation_1.default.handleInputErrors
        ], this.sessionController.validateToken.bind(this.sessionController));
        this.router.get("/check/:tableId", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CHECK_SESSION"),
        (0, express_validator_1.param)("tableId").isMongoId().withMessage("ID de mesa inválido."), validation_1.default.handleInputErrors, this.sessionController.checkSessionExists.bind(this.sessionController));
        this.router.get("/:sessionId/token", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("VIEW_SESSION_TOKEN"),
        (0, express_validator_1.param)("sessionId").isMongoId().withMessage("ID de sesión inválido."), validation_1.default.handleInputErrors, this.sessionController.getSessionToken.bind(this.sessionController));
    }
}
exports.default = new SessionRoute().router;
//# sourceMappingURL=sessionRoutes.js.map