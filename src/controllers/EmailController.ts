import { Request, Response } from "express";
import { EmailService } from "../services/EmailService";


export class EmailController {
    private readonly emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    public async sendPromotionalEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { emails, subject, message, templateType, discount } = req.body;
            await this.emailService.sendPromotionalEmail(emails, subject, message, templateType, discount);
            return res.status(200).json({ message: "Correo promocional enviado correctamente." });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
} 