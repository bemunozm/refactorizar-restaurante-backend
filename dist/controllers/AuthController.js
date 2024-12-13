"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
const UserService_1 = require("../services/UserService");
class AuthController {
    //Atributos
    authService;
    userService;
    constructor() {
        this.authService = new AuthService_1.AuthService();
        this.userService = new UserService_1.UserService();
    }
    //Metodos
    async createAccount(req, res) {
        try {
            const result = await this.authService.createAccount(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const token = await this.authService.login(req.body);
            return res.json(token);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await this.userService.getAllUsers();
            return res.json(users);
        }
        catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);
            if (!user)
                return res.status(404).json({ error: "Usuario no encontrado" });
            return res.json(user);
        }
        catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }
    async updateUserById(req, res) {
        try {
            const { id } = req.params;
            const updatedUser = await this.userService.updateUserById(id, req.body);
            if (!updatedUser)
                return res.status(404).json({ error: "Usuario no encontrado" });
            return res.json({ message: "Usuario actualizado correctamente", updatedUser });
        }
        catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }
    async deleteUserById(req, res) {
        try {
            const { id } = req.params;
            await this.userService.deleteUserById(id);
            return res.json({ message: "Usuario eliminado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Hubo un error" });
        }
    }
    async createAccountByAdmin(req, res) {
        try {
            await this.authService.createAccountByAdmin(req.body);
            return res.status(201).json({ message: "Usuario creado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async confirmAccount(req, res) {
        try {
            const { token } = req.body;
            await this.authService.confirmAccount(token);
            return res.json({ message: "Cuenta confirmada correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async requestConfirmationCode(req, res) {
        try {
            const { email } = req.body;
            await this.authService.requestConfirmationCode(email);
            return res.json({ message: "Código de confirmación enviado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await this.authService.forgotPassword(email);
            return res.json({ message: "Correo de recuperación enviado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async validateToken(req, res) {
        try {
            const { token } = req.body;
            await this.authService.validateToken(token);
            return res.json({ message: "Token validado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updatePasswordWithToken(req, res) {
        try {
            const { token } = req.params;
            await this.authService.updatePasswordWithToken(token, req.body.password);
            return res.json({ message: "Contraseña actualizada correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async checkPassword(req, res) {
        try {
            const { password, userId } = req.body;
            const result = await this.authService.checkPassword(password, userId);
            return res.json(result);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async user(req, res) {
        try {
            return res.json({
                user: req.user || {},
                guest: req.guest || {},
                session: req.sessionId || '',
                table: req.tableId || '',
                role: req.role || ''
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updatePassword(req, res) {
        try {
            await this.authService.updatePassword(req.body, req.user.userId);
            return res.json({ message: "Contraseña actualizada correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map