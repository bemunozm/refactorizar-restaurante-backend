import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import { TokenRepository } from "../repositories/TokenRepository";
import { hashPassword, checkPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { generateJWT } from "../utils/jwt";
import { AuthEmail } from "../emails/AuthEmail";
import { UserInterface } from "../interfaces/UserInterface";

export class AuthService {
    private userRepository: UserRepository;
    private roleRepository: RoleRepository;
    private tokenRepository: TokenRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.roleRepository = new RoleRepository();
        this.tokenRepository = new TokenRepository();
    }

    public async createAccount(data: any): Promise<{ token: string; sessionId?: string }> {
        const { password, email, guestId, sessionId, tableId } = data;

        // Verificar si el usuario ya existe
        const userExists = await this.userRepository.findOne({ email });
        if (userExists) throw new Error("El Usuario ya está registrado");

        // Asignar el rol por defecto para los clientes
        const defaultRole = await this.roleRepository.findOne({ name: "Usuario" });
        if (!defaultRole) throw new Error("Rol por defecto no encontrado");

        // Crear el usuario con el rol predeterminado
        const hashedPassword = await hashPassword(password);
        const userData: Partial<UserInterface> = { ...data, roles: [defaultRole._id], password: hashedPassword };
        const user = await this.userRepository.create(userData);

        // Generar token de confirmación de cuenta y guardar
        const token = generateToken();
        await this.tokenRepository.create({ token, user: user._id.toString() });

        // Enviar el email de confirmación
        await AuthEmail.sendConfirmationEmail({
            email: user.email,
            name: user.name,
            token,
        });

        // Manejar sesiones para invitados (enlace con pedidos, etc.)
        if (guestId) {
            // Aquí podrías delegar esta parte a una función específica o servicio de sesión
            // Código para actualizar sesión de invitados
        }

        // Generar JWT para el usuario
        const jwtToken = generateJWT({
            id: user._id.toString(),
            sessionId: sessionId || "",
            tableId: tableId || "",
            role: "Usuario",
        });

        return { token: jwtToken, sessionId };
    }

    public async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({ email });
        if (!user) throw new Error("Usuario no encontrado");

        // Verificar si la cuenta está confirmada
        if (!user.confirmed) {
            const token = generateToken();
            await this.tokenRepository.create({ token, user: user._id.toString() });
            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token,
            });
            throw new Error("La cuenta no ha sido confirmada. Revisa tu correo.");
        }

        // Verificar password
        const isPasswordCorrect = await checkPassword(password, user.password);
        if (!isPasswordCorrect) throw new Error("Password Incorrecto");

        // Generar JWT y devolverlo
        const jwtToken = generateJWT({
            id: user._id.toString(),
            role: "Usuario",
        });

        return jwtToken;
    }

    // Otros métodos de autenticación como `requestConfirmationCode`, `validateToken`, `updatePasswordWithToken`...
}
