import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import { AuthEmail } from "../emails/AuthEmail";
import { User } from "../models/User";
import { Token } from "../models/Token";
import { Role } from "../models/Role";

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
            // Aquí podrías delegar esta parte a una función específica o servicio de sesión
            // Código para actualizar sesión de invitados
        }

        // Generar JWT para el usuario
        const jwtToken = generateJWT({
            id: user.userId,
            sessionId: sessionId || "",
            tableId: tableId || "",
            role: "Usuario",
        });

        return { token: jwtToken, sessionId };
    }

    public async login(email: string, password: string): Promise<string> {
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

        // Generar JWT y devolverlo
        const jwtToken = generateJWT({
            id: user.userId,
            role: "Usuario",
        });

        return jwtToken;
    }

    // Otros métodos de autenticación como `requestConfirmationCode`, `validateToken`, `updatePasswordWithToken`...
}
