import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import ValidationMiddleware from "../middleware/validation";
import AuthMiddleware from "../middleware/auth";
import PermissionMiddleware from "../middleware/permission";

class AuthRoute {
    private readonly authController: AuthController;
    public readonly router: Router;

    constructor() {
        this.authController = new AuthController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/register",
            [
                body("name").isString().notEmpty(),
                body("lastname").isString().notEmpty(),
                body("email").isEmail(),
                body("password").isString().isLength({ min: 6 }),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.createAccount.bind(this.authController)
        );

        this.router.post(
            "/login",
            [
                body("email").isEmail(),
                body("password").isString(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.login.bind(this.authController)
        );

        this.router.get(
            "/users",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("VIEW_USERS"), // Verificación de permisos para ver usuarios
            this.authController.getAllUsers.bind(this.authController)
        );

        this.router.get(
            "/users/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("VIEW_USER"),
            param("id").isMongoId(),
            ValidationMiddleware.handleInputErrors,
            this.authController.getUserById.bind(this.authController)
        );

        this.router.put(
            "/users/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("UPDATE_USER"),
            [
                param("id").isMongoId(),
                body("name").isString().optional(),
                body("email").isEmail().optional(),
                body("password").isString().optional(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.updateUserById.bind(this.authController)
        );

        this.router.delete(
            "/users/:id",
            AuthMiddleware.authenticate,
            PermissionMiddleware.checkPermission("DELETE_USER"),
            param("id").isMongoId(),
            ValidationMiddleware.handleInputErrors,
            this.authController.deleteUserById.bind(this.authController)
        );

        this.router.post(
            "/users/create-user",
            AuthMiddleware.authenticate,
            //PermissionMiddleware.checkPermission("CREATE_USER"),
            [
                body("name").isString().notEmpty(),
                body("lastname").isString().notEmpty(),
                body("email").isEmail(),
                
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.createAccountByAdmin.bind(this.authController)
        );

        this.router.get(
            "/user",
            [
                AuthMiddleware.authenticate,
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.user.bind(this.authController)
        );

        this.router.post(
            "/confirm-account",
            [
                body("token").isString().notEmpty(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.confirmAccount.bind(this.authController)
        );

        this.router.post(
            "/request-code",
            [
                body("email").isEmail(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.requestConfirmationCode.bind(this.authController)
        );

        this.router.post(
            "/forgot-password",
            [
                body("email").isString().notEmpty(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.forgotPassword.bind(this.authController)
        );

        this.router.post(
            "/validate-token",
            [
                //AuthMiddleware.authenticate,
                body("token").isString().notEmpty(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.validateToken.bind(this.authController)
        );

        this.router.put(
            "/update-password/:token",
            [
                body("password").isString().isLength({ min: 6 }),
                param("token").isString().notEmpty(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.updatePasswordWithToken.bind(this.authController)
        );

        this.router.post(
            "/check-password",
            [
                body("password").isString().notEmpty(),
                body("userId").isMongoId(),
                ValidationMiddleware.handleInputErrors
            ],
            this.authController.checkPassword.bind(this.authController)
        );

        this.router.post(
            "/update-password",
            AuthMiddleware.authenticate,
            this.authController.updatePassword.bind(this.authController)
        );
    }
}

export default new AuthRoute().router;
