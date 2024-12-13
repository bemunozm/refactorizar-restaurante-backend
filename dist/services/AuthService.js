"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
// AuthService.ts
const token_1 = require("../utils/token");
const jwt_1 = require("../utils/jwt");
const AuthEmail_1 = require("../emails/AuthEmail");
const User_1 = require("../models/User");
const Token_1 = require("../models/Token");
const Role_1 = require("../models/Role");
const Session_1 = require("../models/Session");
const Order_1 = require("../models/Order");
class AuthService {
    async createAccount(data) {
        const { name, lastname, password, email, guestId, sessionId, tableId } = data;
        console.log(data);
        // Crear instancia de usuario
        const user = new User_1.User({ name, lastname, email, password, confirmed: false, roles: [] });
        // Verificar si el usuario ya existe
        const userExists = await user.doesThatExist();
        if (userExists)
            throw new Error("El Usuario ya está registrado");
        // Asignar el rol de usuario por defecto
        const role = new Role_1.Role({ name: 'Usuario' });
        const defaultRole = await role.findByName();
        if (!defaultRole)
            throw new Error("Rol por defecto no encontrado");
        // Encriptar contraseña y asignar rol por defecto
        await user.hashPassword();
        user.roles = [defaultRole];
        await user.save();
        // Generar token de confirmación de cuenta y guardar
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        // Enviar el email de confirmación
        await AuthEmail_1.AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
        // Manejar sesiones para invitados (enlace con pedidos, etc.)
        if (guestId && sessionId) {
            // Creamos instancias de `Session` y `Order` con los IDs proporcionados
            const session = new Session_1.Session({ sessionId, table: tableId, guests: [], status: "Activa" });
            const order = new Order_1.Order({ guest: { guestId, name: '', orders: [] }, session, table: tableId, user, items: [], status: "Sin Pagar" });
            await session.updateGuestToLogged(guestId, user.userId);
            await order.updateGuestToUserOrders();
        }
        // Generar JWT para el usuario
        const jwtToken = (0, jwt_1.generateJWT)({
            id: user.userId,
            sessionId: sessionId,
            tableId: tableId,
            role: "Usuario",
        });
        return { token: jwtToken, session: sessionId ? new Session_1.Session({ sessionId }) : undefined };
    }
    async login(data) {
        const { email, password, guestId, sessionId } = data;
        const user = new User_1.User({ email, password });
        const userExists = await user.doesThatExist();
        if (!userExists)
            throw new Error("Usuario no encontrado");
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect)
            throw new Error("Password Incorrecto");
        if (!user.confirmed) {
            const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
            await token.save();
            await AuthEmail_1.AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            throw new Error("La cuenta no ha sido confirmada. Revisa tu correo.");
        }
        if (guestId && sessionId) {
            const session = new Session_1.Session({ sessionId, guests: [], status: "Activa" });
            const order = new Order_1.Order({ guest: { guestId, name: '', orders: [] }, session, user, items: [], status: "Sin Pagar" });
            await session.updateGuestToLogged(guestId, user.userId);
            await order.updateGuestToUserOrders();
        }
        const jwtToken = (0, jwt_1.generateJWT)({
            id: user.userId,
            sessionId: sessionId.toString(),
            role: 'Usuario'
        });
        return { token: jwtToken, session: sessionId ? new Session_1.Session({ sessionId }) : undefined };
    }
    // Métodos adicionales para confirmación y otros procesos
    async createAccountByAdmin(data) {
        const { name, lastname, email, roles } = data;
        const assignedRoles = await Promise.all(roles.map(async (roleId) => {
            const role = new Role_1.Role({ roleId });
            return await role.findById() ? role : null;
        }));
        if (assignedRoles.includes(null))
            throw new Error("Uno o más roles no encontrados");
        const user = new User_1.User({ name, lastname, email, confirmed: true, roles: assignedRoles });
        const userExists = await user.doesThatExist();
        if (userExists)
            throw new Error("El Usuario ya está registrado");
        user.password = (0, token_1.generateToken)();
        await user.hashPassword();
        await user.save();
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        await AuthEmail_1.AuthEmail.sendWelcomeEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }
    async confirmAccount(token) {
        const tokenInstance = new Token_1.Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData)
            throw new Error("Token no encontrado");
        const user = new User_1.User({ userId: tokenData.user.userId });
        await user.findById();
        await user.update({ confirmed: true });
        await tokenInstance.deleteToken();
        return true;
    }
    async resendConfirmationEmail(email) {
        const user = new User_1.User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists)
            throw new Error("Usuario no encontrado");
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        await AuthEmail_1.AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }
    async resetPassword(email) {
        const user = new User_1.User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists)
            throw new Error("Usuario no encontrado");
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        await AuthEmail_1.AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }
    async changePassword(token, password) {
        const tokenInstance = new Token_1.Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData)
            throw new Error("Token no encontrado");
        const user = new User_1.User({ userId: tokenData.user.toString() });
        await user.findById();
        user.password = password;
        await user.hashPassword();
        await user.update({ password: user.password });
        await tokenInstance.deleteToken();
        return true;
    }
    async requestConfirmationCode(email) {
        const user = new User_1.User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists)
            throw new Error("Usuario no encontrado");
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        await AuthEmail_1.AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }
    async forgotPassword(email) {
        const user = new User_1.User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists)
            throw new Error("Usuario no encontrado");
        const token = new Token_1.Token({ token: (0, token_1.generateToken)(), user });
        await token.save();
        await AuthEmail_1.AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }
    async validateToken(token) {
        const tokenInstance = new Token_1.Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData)
            throw new Error("Token no encontrado");
        return true;
    }
    async updatePasswordWithToken(token, password) {
        const tokenInstance = new Token_1.Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData)
            throw new Error("Token no encontrado");
        const user = new User_1.User({ userId: tokenData.user.userId });
        await user.findById();
        user.password = password;
        await user.hashPassword();
        await user.update({ password: user.password });
        await tokenInstance.deleteToken();
        return true;
    }
    async checkPassword(password, userId) {
        const user = new User_1.User({ userId });
        await user.findById();
        return await user.checkPassword(password);
    }
    async updatePassword(data, userId) {
        const { newPassword, currentPassword } = data;
        const user = new User_1.User({ userId });
        await user.findById();
        const isPasswordCorrect = await user.checkPassword(currentPassword);
        if (!isPasswordCorrect)
            throw new Error("Password Incorrecto");
        user.password = newPassword;
        await user.hashPassword();
        await user.update({ password: user.password });
        return true;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map