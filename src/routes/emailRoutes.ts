import { Router } from "express";
import { EmailController } from "../controllers/EmailController";
import { body } from "express-validator";
import ValidationMiddleware from "../middleware/validation";

class EmailRoute {
    private readonly emailController: EmailController;
    public readonly router: Router;

    constructor() {
        this.emailController = new EmailController();
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes() {
        this.router.post(
            "/send-promotional-email",
            [
                body("subject").isString().notEmpty(),
                body("message").isString().notEmpty(),
                body("templateType").isString().notEmpty(),
                body("discount").isString().notEmpty(),
                ValidationMiddleware.handleInputErrors
            ],
            this.emailController.sendPromotionalEmail.bind(this.emailController)
        );
    }
}

export default new EmailRoute().router; 