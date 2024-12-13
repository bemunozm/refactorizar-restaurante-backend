"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const express_validator_1 = require("express-validator");
const validation_1 = __importDefault(require("../middleware/validation"));
const auth_1 = __importDefault(require("../middleware/auth"));
const permission_1 = __importDefault(require("../middleware/permission"));
class AuthRoute {
    authController;
    router;
    constructor() {
        this.authController = new AuthController_1.AuthController();
        this.router = (0, express_1.Router)();
        this.initRoutes();
    }
    initRoutes() {
        this.router.post("/register", [
            (0, express_validator_1.body)("name").isString().notEmpty(),
            (0, express_validator_1.body)("lastname").isString().notEmpty(),
            (0, express_validator_1.body)("email").isEmail(),
            (0, express_validator_1.body)("password").isString().isLength({ min: 6 }),
            validation_1.default.handleInputErrors
        ], this.authController.createAccount.bind(this.authController));
        this.router.post("/login", [
            (0, express_validator_1.body)("email").isEmail(),
            (0, express_validator_1.body)("password").isString(),
            validation_1.default.handleInputErrors
        ], this.authController.login.bind(this.authController));
        this.router.get("/users", auth_1.default.authenticate, 
        //PermissionMiddleware.checkPermission("VIEW_USERS"), // Verificación de permisos para ver usuarios
        this.authController.getAllUsers.bind(this.authController));
        this.router.get("/users/:id", auth_1.default.authenticate, permission_1.default.checkPermission("VIEW_USER"), (0, express_validator_1.param)("id").isMongoId(), validation_1.default.handleInputErrors, this.authController.getUserById.bind(this.authController));
        this.router.put("/users/:id", auth_1.default.authenticate, permission_1.default.checkPermission("UPDATE_USER"), [
            (0, express_validator_1.param)("id").isMongoId(),
            (0, express_validator_1.body)("name").isString().optional(),
            (0, express_validator_1.body)("email").isEmail().optional(),
            (0, express_validator_1.body)("password").isString().optional(),
            validation_1.default.handleInputErrors
        ], this.authController.updateUserById.bind(this.authController));
        this.router.delete("/users/:id", auth_1.default.authenticate, permission_1.default.checkPermission("DELETE_USER"), (0, express_validator_1.param)("id").isMongoId(), validation_1.default.handleInputErrors, this.authController.deleteUserById.bind(this.authController));
        this.router.post("/users/create-user", auth_1.default.authenticate, permission_1.default.checkPermission("CREATE_USER_ACCOUNT_ADMIN"), [
            (0, express_validator_1.body)("name").isString().notEmpty(),
            (0, express_validator_1.body)("lastname").isString().notEmpty(),
            (0, express_validator_1.body)("email").isEmail(),
            validation_1.default.handleInputErrors
        ], this.authController.createAccountByAdmin.bind(this.authController));
        this.router.get("/user", [
            auth_1.default.authenticate,
            validation_1.default.handleInputErrors
        ], this.authController.user.bind(this.authController));
        this.router.post("/confirm-account", [
            (0, express_validator_1.body)("token").isString().notEmpty(),
            validation_1.default.handleInputErrors
        ], this.authController.confirmAccount.bind(this.authController));
        this.router.post("/request-code", [
            (0, express_validator_1.body)("email").isEmail(),
            validation_1.default.handleInputErrors
        ], this.authController.requestConfirmationCode.bind(this.authController));
        this.router.post("/forgot-password", [
            (0, express_validator_1.body)("email").isString().notEmpty(),
            validation_1.default.handleInputErrors
        ], this.authController.forgotPassword.bind(this.authController));
        this.router.post("/validate-token", [
            //AuthMiddleware.authenticate,
            (0, express_validator_1.body)("token").isString().notEmpty(),
            validation_1.default.handleInputErrors
        ], this.authController.validateToken.bind(this.authController));
        this.router.put("/update-password/:token", [
            (0, express_validator_1.body)("password").isString().isLength({ min: 6 }),
            (0, express_validator_1.param)("token").isString().notEmpty(),
            validation_1.default.handleInputErrors
        ], this.authController.updatePasswordWithToken.bind(this.authController));
        this.router.post("/check-password", [
            (0, express_validator_1.body)("password").isString().notEmpty(),
            (0, express_validator_1.body)("userId").isMongoId(),
            validation_1.default.handleInputErrors
        ], this.authController.checkPassword.bind(this.authController));
        this.router.post("/update-password", auth_1.default.authenticate, this.authController.updatePassword.bind(this.authController));
    }
}
exports.default = new AuthRoute().router;
//# sourceMappingURL=authRoutes.js.map