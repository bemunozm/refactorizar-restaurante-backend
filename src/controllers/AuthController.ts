import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

export class AuthController {
    //Atributos
    private readonly authService: AuthService;
    private readonly userService: UserService;

    constructor() {
        this.authService = new AuthService();
        this.userService = new UserService();
    }

    //Metodos

    public async createAccount(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.authService.createAccount(req.body);
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            return res.json({ token });
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    public async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            return res.json(users);
        } catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }

    public async updateUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.updateUserById(id, req.body);
            if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
            return res.json({ message: "Usuario actualizado correctamente", updatedUser });
        } catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }

    public async deleteUserById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            await this.userService.deleteUserById(id);
            return res.json({ message: "Usuario eliminado correctamente" });
        } catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }

    public async createAccountByAdmin(req: Request, res: Response): Promise<Response> {

        try {
            await this.authService.createAccountByAdmin(req.body);
            return res.status(201).json({ message: "Usuario creado correctamente" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    

    // Otros métodos del controlador como `confirmAccount`, `requestConfirmationCode`, `forgotPassword`, `validateToken`, etc.
}
