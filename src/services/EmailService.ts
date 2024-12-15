import { AuthEmail } from "../emails/AuthEmail";

export class EmailService {
    public async sendPromotionalEmail(email: string, subject: string, message: string): Promise<void> {
        const user = {
            email,
            name: "Usuario", // Puedes personalizar el nombre si es necesario
            token: "token_placeholder" // Si necesitas un token, puedes generarlo aquí
        };

        // Aquí puedes personalizar el correo según el asunto y el mensaje
        await AuthEmail.sendPromotionalEmail({
            email: user.email,
            subject,
            message
        });
    }
} 