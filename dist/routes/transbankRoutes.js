"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransbankController_1 = require("../controllers/TransbankController");
const validation_1 = __importDefault(require("../middleware/validation"));
const express_validator_1 = require("express-validator");
class TransbankRoute {
    transbankController;
    router;
    constructor() {
        this.transbankController = new TransbankController_1.TransbankController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        // Ruta para crear una transacción
        this.router.post("/create-transaction", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CREATE_TRANSACTION"),
        [
            (0, express_validator_1.body)("amount").isFloat({ gt: 0 }).withMessage("El monto debe ser un número positivo."),
            (0, express_validator_1.body)("sessionId").isMongoId().optional().withMessage("ID de sesión inválido."),
            validation_1.default.handleInputErrors
        ], this.transbankController.createTransaction.bind(this.transbankController));
        // Ruta para confirmar una transacción
        this.router.post("/confirm-transaction", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("CONFIRM_TRANSACTION"),
        [
            (0, express_validator_1.body)("token").isString().withMessage("El token es obligatorio."),
            validation_1.default.handleInputErrors
        ], this.transbankController.confirmTransaction.bind(this.transbankController));
        // Ruta para actualizar el estado de una transacción
        this.router.put("/update-transaction-status", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_TRANSACTION_STATUS"),
        [
            (0, express_validator_1.body)("transactionId").isMongoId().withMessage("ID de transacción inválido."),
            (0, express_validator_1.body)("status").isString().withMessage("El estado es obligatorio."),
            validation_1.default.handleInputErrors
        ], this.transbankController.updateTransactionStatus.bind(this.transbankController));
        this.router.post("/notifyWaitersWithToken", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("UPDATE_TRANSACTION_STATUS"),
        [
            validation_1.default.handleInputErrors
        ], this.transbankController.notifyWaitersWithToken.bind(this.transbankController));
        this.router.get("/transaction/:token", 
        //AuthMiddleware.authenticate,
        //PermissionMiddleware.checkPermission("GET_TRANSACTION"),
        [
            (0, express_validator_1.param)("token").isString().withMessage("El token es obligatorio."),
            validation_1.default.handleInputErrors
        ], this.transbankController.getTransactionByToken.bind(this.transbankController));
    }
}
exports.default = new TransbankRoute().router;
//# sourceMappingURL=transbankRoutes.js.map