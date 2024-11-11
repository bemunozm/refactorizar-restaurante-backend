import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import { AuthEmail } from "../emails/AuthEmail";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Role } from "../models/Role";
import { Session } from "../models/Session";
import { Order } from "../models/Order";

export class AuthService {

    public async createAccount(data: any): Promise<{ token: string; sessionId?: string }> {
        const { name, lastname, password, email, guestId, sessionId, tableId } = data;

        //Instanciar el usuario
        const user = new User({name: name, lastname: lastname, email: email, password: password, confirmed: false, roles: []})

        // Verificar si el usuario ya existe
        const userExists = await user.doesThatExist();
        if (userExists) throw new Error("El Usuario ya está registrado");

        // Asignar el rol por defecto para los clientes
        const role = new Role({name: 'Usuario'})
        const defaultRole = await role.findByName();
        if (!defaultRole) throw new Error("Rol por defecto no encontrado");

        //Encriptar contraseña
        await user.hashPassword()

        // Asignar el rol por defecto
        user.roles = [role];
        
        //Guardar el usuario
        await user.save()

        // Generar token de confirmación de cuenta y guardar
        const token = new Token({ token: generateToken(), user: user.userId });
        await token.save();

        // Enviar el email de confirmación
        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });

        // Manejar sesiones para invitados (enlace con pedidos, etc.)
        if (guestId) {
            // Encontrar la sesión y el invitado correspondiente
            const session = new Session({ sessionId: sessionId, tableId: tableId, guests: [], status: "Activa" });

            //Verificar si la session existe
            const sessionExists = await session.findById();
            if (!sessionExists) throw new Error("Sesión no encontrada");

            //Usuario a actualizar
            await session.updateGuestToLogged(guestId, user.userId);

            //Actualizar los pedidos del invitado para que pertenezcan al usuario
            const order = new Order({ guestId: guestId, sessionId: sessionId, tableId: tableId, userId: user.userId, items: [], status: "Sin Pagar" });

            //Actualizar los pedidos de invitado a usuario
            await order.updateGuestToUserOrders();

        }

        // Generar JWT para el usuario
        const jwtToken = generateJWT({
            id: user.userId,
            sessionId: sessionId || "",
            tableId: tableId || "",
            role: "Invitado",
        });

        return { token: jwtToken, sessionId };
    }

    public async login(email: string, password: string, guestId?: string, sessionId?: string, tableId?: string) {

        // Instanciar el usuario
        const user = new User({email: email, password: password, name: '', lastname: '', confirmed: false, roles: []})

        // Buscar usuario por email
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");
        
        // Verificar password
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) throw new Error("Password Incorrecto");

        // Verificar si la cuenta está confirmada
        if (!user.confirmed) {
            // Generar token de confirmación de cuenta y guardar
            const token = new Token({ token: generateToken(), user: user.userId });
            await token.save();
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            });
            throw new Error("La cuenta no ha sido confirmada. Revisa tu correo.");
        }

        //Verificar roles del usuario para determinar el tipo de autenticación
        const roles = user.roles.map((role) => role.name);

        
        if (roles.includes('Administrador')) {
            // Caso para "staff" (sin mesa ni sesión)
            const token = generateJWT({
                id: user.userId,
                role: 'Usuario'  // Asignar el rol "staff" o los roles específicos si lo prefieres
            });

            return { token: token };  // Devuelve el JWT sin datos de sesión ni mesa

        } else {
            // Caso para "Usuario" (cliente)
            // Transferir pedidos de invitado a usuario registrado, si aplica

            if (guestId) {
                // 1. Encontrar la sesión y el invitado correspondiente
                const session = new Session({ sessionId: sessionId, tableId: tableId, guests: [], status: "Activa" });
                const sessionExists = await session.findById();
                if (!sessionExists) {
                    throw new Error('Sesión no encontrada');
                }

                // 2. Encontrar el invitado en la sesión
                const guestToUpdate = session.updateGuestToLogged(guestId, user.userId);
                if (!guestToUpdate) {
                    throw new Error('Invitado no encontrado en la sesión');
                }

                const order = new Order({ guestId: {guestId: guestId, name: '', user: '', orders: []}, sessionId: sessionId, tableId: tableId, userId: user.userId, items: [], status: "Sin Pagar" });
                await order.updateGuestToUserOrders();
            }
            // Generar el JWT para el usuario y enviar la sesión y mesa
            const token = generateJWT({
                id: user.userId,
                sessionId: sessionId || '',
                tableId: tableId || '',
                role: 'Usuario'
            });

            return { token: token, sessionId: sessionId };  // Devuelve el JWT con la sesión y mesa
        }
    }

    public async createAccountByAdmin(data: any): Promise<void> {
        const { name, lastname, email, roles } = data;

        //Instanciar el usuario
        const user = new User({name: name, lastname: lastname, email: email, password: '', confirmed: false, roles: []})

        //Prevenir duplicados
        const userExists = await user.doesThatExist();
        if (userExists) throw new Error("El Usuario ya está registrado");

        //Encontrar roles asignados
        const assignedRoles = [];
        for (const roleId of roles) {
            const role = new Role({ roleId: roleId });
            const foundRole = await role.findById();
            if (!foundRole) throw new Error(`Rol con id ${roleId} no encontrado`);
            assignedRoles.push(role);
        }
        if (assignedRoles.length === 0) throw new Error("Se requiere al menos un rol");
        if (assignedRoles.length !== roles.length) throw new Error("Uno o más roles no encontrados");

        //Crear el usuario con contraseña aleatoria
        user.password = generateToken();
        await user.hashPassword();

        //Asignar roles
        user.roles = assignedRoles;

        //Guardar el usuario
        await user.save();

        //Generar token de confirmación de cuenta y guardar
        const token = new Token({ token: generateToken(), user: user.userId });
        await token.save();


        //Enviar email de confirmación
        await AuthEmail.sendWelcomeEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
        
    }

    //Confirmar cuenta
    public async confirmAccount(token: string): Promise<void> {
        const tokenInstance = new Token({ token: token, user: '' });
        const tokenExists = await tokenInstance.findByToken();
        if (!tokenExists) throw new Error("Token no encontrado");

        const user = new User({ userId:tokenExists.user.userId, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.findById();

        if (user.confirmed) throw new Error("La cuenta ya ha sido confirmada");

        user.confirmed = true;
        await user.update({ confirmed: true });

        // Eliminar el token de confirmación
        await tokenInstance.deleteToken();
    }

    //Solicitar codigo de confirmación
    public async requestConfirmationCode(email: string): Promise<void> {
        const user = new User({ email: email, name: '', lastname: '', password: '', confirmed: false, roles: [] });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        if (user.confirmed) throw new Error("La cuenta ya ha sido confirmada");

        // Generar token de confirmación de cuenta y guardar
        const token = new Token({ token: generateToken(), user: user.userId });
        await token.save();

        // Enviar el email de confirmación
        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    //Olvide la contraseña
    public async forgotPassword(email: string): Promise<void> {
        const user = new User({ email: email, name: '', lastname: '', password: '', confirmed: false, roles: [] });
        const userExists = await user.doesThatExist();
        if (!userExists) throw new Error("Usuario no encontrado");

        // Generar token de confirmación de cuenta y guardar
        const token = new Token({ token: generateToken(), user: user.userId });
        await token.save();

        // Enviar el email de confirmación
        await AuthEmail.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: token.token,
        });
    }

    //Validar token
    public async validateToken(token: string): Promise<void> {
        const tokenInstance = new Token({ token: token, user: '' });
        const tokenExists = await tokenInstance.findByToken();
        if (!tokenExists) throw new Error("Token no encontrado");
    }

    //Actualizar contraseña con token
    public async updatePasswordWithToken(token: string, password: string): Promise<void> {
        const tokenInstance = new Token({ token: token, user: '' });
        const tokenExists = await tokenInstance.findByToken();
        if (!tokenExists) throw new Error("Token no encontrado");

        const user = new User({ userId: tokenExists.user.userId, name: '', lastname: '', email: '', password: '', confirmed: false, roles: [] });
        await user.findById();

        //Encriptar contraseña
        user.password = password;
        await user.hashPassword();

        //Actualizar contraseña
        await user.update({ password: user.password });

        //Eliminar el token
        await tokenInstance.deleteToken();
    }
    
    public async checkPassword(password: string, userId): Promise<boolean> {
        const user = new User({ userId: userId, email: '', password: password, name: '', lastname: '', confirmed: false, roles: [] });
        return await user.checkPassword(password);
    }
}
