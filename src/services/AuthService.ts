// AuthService.ts
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import { AuthEmail } from "../emails/AuthEmail";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Role } from "../models/Role";
import { Session } from "../models/Session";
import { Order } from "../models/Order";

export class AuthService {

    public async createAccount(data: any): Promise<{ token: string; session?: Session }> {
        const { name, lastname, password, email, guestId, sessionId, tableId } = data;
        console.log(data);

        // Crear instancia de usuario
        const user = new User({ name, lastname, email, password, confirmed: false, roles: [] });
        
        // Verificar si el usuario ya existe
        const userExists = await user.doesThatExist();
        if (userExists) throw new Error("El Usuario ya está registrado");

        // Asignar el rol de usuario por defecto
        const role = new Role({ name: 'Usuario' });
        const defaultRole = await role.findByName();
        if (!defaultRole) throw new Error("Rol por defecto no encontrado");

        // Encriptar contraseña y asignar rol por defecto
        await user.hashPassword();
        user.roles = [defaultRole];

        await user.save();

        // Generar token de confirmación de cuenta y guardar
        const token = new Token({ token: generateToken(), user });
        await token.save();

        // Enviar el email de confirmación
        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });

        // Manejar sesiones para invitados (enlace con pedidos, etc.)
        if (guestId && sessionId) {
            // Creamos instancias de `Session` y `Order` con los IDs proporcionados
            const session = new Session({ sessionId, table: tableId, guests: [], status: "Activa" });
            const order = new Order({ guest: {guestId, name: '', orders: []}, session, table: tableId, user, items: [], status: "Sin Pagar" });

            await session.updateGuestToLogged(guestId, user.userId);
            await order.updateGuestToUserOrders();
        }

        // Generar JWT para el usuario
        const jwtToken = generateJWT({
            id: user.userId,
            sessionId: sessionId,
            tableId: tableId,
            role: "Usuario",
        });

        return { token: jwtToken, session: sessionId ? new Session({ sessionId }) : undefined };
    }

    public async login(data: any) {
        const { email, password, guestId, sessionId } = data;
        const user = new User({ email, password });

        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) throw new Error("Password Incorrecto");

        if (!user.confirmed) {
            const token = new Token({ token: generateToken(), user });
            await token.save();
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            throw new Error("La cuenta no ha sido confirmada. Revisa tu correo.");
        }

        if (guestId && sessionId) {
            const session = new Session({ sessionId, guests: [], status: "Activa" });
            const order = new Order({ guest: {guestId, name:'', orders:[]}, session, user, items: [], status: "Sin Pagar" });
            await session.updateGuestToLogged(guestId, user.userId);
            await order.updateGuestToUserOrders();
        }

        const jwtToken = generateJWT({
            id: user.userId,
            sessionId: sessionId.toString(),  
            role: 'Usuario'
        });

        const role = user.roles[0].name

        return { token: jwtToken, session: sessionId ? new Session({ sessionId }) : undefined, role: role };
    }

    // Métodos adicionales para confirmación y otros procesos

    public async createAccountByAdmin(data: any): Promise<void> {
        const { name, lastname, email, roles } = data;
        

    
        const assignedRoles = await Promise.all(
            roles.map(async (roleId: string) => {
                const role = new Role({roleId});
                return await role.findById() ? role : null;
            })
        );

        if (assignedRoles.includes(null)) throw new Error("Uno o más roles no encontrados");

        const user = new User({ name, lastname, email, confirmed: true, roles: assignedRoles });


        const userExists = await user.doesThatExist();
        if (userExists) throw new Error("El Usuario ya está registrado");

        user.password = generateToken();
        await user.hashPassword();
        await user.save();

        const token = new Token({ token: generateToken(), user });
        await token.save();

        await AuthEmail.sendWelcomeEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    public async confirmAccount(token: string) {
        const tokenInstance = new Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData) throw new Error("Token no encontrado");

        const user = new User({ userId: tokenData.user.userId });
        await user.findById();
        await user.update({ confirmed: true });

        await tokenInstance.deleteToken();

        return true;    

    }

    public async resendConfirmationEmail(email: string) {
        const user = new User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        const userTokenExists = new Token({ user: user.userId });
        const userTokenExistsData = await userTokenExists.findByUserId();
        if (userTokenExistsData) await userTokenExists.deleteToken();

        const token = new Token({ token: generateToken(), user });
        await token.save();

        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    public async resetPassword(email: string) {
        const user = new User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        const token = new Token({ token: generateToken(), user });
        await token.save();

        await AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    public async changePassword(token: string, password: string) {
        const tokenInstance = new Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData) throw new Error("Token no encontrado");

        const user = new User({ userId: tokenData.user.toString() });
        await user.findById();
        user.password = password;
        await user.hashPassword();
        await user.update({ password: user.password });

        await tokenInstance.deleteToken();

        return true;
    }

    public async requestConfirmationCode(email: string) {
        const user = new User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        const userTokenExists = new Token({ user: user.userId });
        const userTokenExistsData = await userTokenExists.findByUserId();
        if (userTokenExistsData) await userTokenExists.deleteToken();

        const token = new Token({ token: generateToken(), user });
        await token.save();

        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    public async forgotPassword(email: string) {
        const user = new User({ email });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");  

        const userTokenExists = new Token({ user: user.userId });
        const userTokenExistsData = await userTokenExists.findByUserId();
        if (userTokenExistsData) await userTokenExists.deleteToken();

        const token = new Token({ token: generateToken(), user });
        await token.save();

        await AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    public async validateToken(token: string) {
        const tokenInstance = new Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData) throw new Error("Token no encontrado");
        return true;
    }

    public async updatePasswordWithToken(token: string, password: string) {
        const tokenInstance = new Token({ token });
        const tokenData = await tokenInstance.findByToken();
        if (!tokenData) throw new Error("Token no encontrado");

        const user = new User({ userId: tokenData.user.userId });
        await user.findById();
        user.password = password;
        await user.hashPassword();
        await user.update({ password: user.password });

        await tokenInstance.deleteToken();

        return true;
    }

    public async checkPassword(password: string, userId: string) {
        const user = new User({ userId });
        await user.findById();
        return await user.checkPassword(password);
    }

    public async updatePassword(data, userId) {
        const { newPassword, currentPassword } = data;
        const user = new User({ userId });
        await user.findById();
        const isPasswordCorrect = await user.checkPassword(currentPassword);
        if (!isPasswordCorrect) throw new Error("Password Incorrecto");

        user.password = newPassword;
        await user.hashPassword();
        
        
        await user.update({ password: user.password });

        return true;
        
    }

    
}
