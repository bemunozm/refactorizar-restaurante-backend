import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

class AuthRoute {
  private readonly authController: AuthController;
  public readonly router: Router;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/register", this.authController.createAccount.bind(this.authController));
    this.router.post("/login", this.authController.login.bind(this.authController));
    this.router.get("/users", this.authController.getAllUsers.bind(this.authController));
    this.router.get("/users/:id", this.authController.getUserById.bind(this.authController));
    this.router.put("/users/:id", this.authController.updateUserById.bind(this.authController));
    this.router.delete("/users/:id", this.authController.deleteUserById.bind(this.authController));
    this.router.post("/users/create-user", this.authController.createAccountByAdmin.bind(this.authController));
  }
}

export default new AuthRoute().router;
