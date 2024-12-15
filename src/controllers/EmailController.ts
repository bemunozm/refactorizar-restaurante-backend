import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";


export class EmailController {
    private readonly emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public async sendPromotionalEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email, subject, message } = req.body;
            await this.emailService.sendPromotionalEmail(email, subject, message);
            return res.status(200).json({ message: "Correo promocional enviado correctamente." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
} 