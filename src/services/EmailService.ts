import { AuthEmail } from "../emails/AuthEmail";
import { MasiveEmail } from "../emails/MasiveEmail";
import { Discount } from "../models/Discount";

export class EmailService {
    public async sendPromotionalEmail(emails: string[], subject: string, message: string, templateType: string, discount: string): Promise<void> {
        

        if (templateType === 'masive') {
            for (const email of emails) {
                const discountInstance = new Discount({discountId: discount});
                const discountFound = await discountInstance.findById();
                await MasiveEmail.sendPromotionalEmail({
                    email,
                    subject,
                    message,
                    discount: discountFound
                });
            }
        } else {
            console.log('No se ha seleccionado un template valido');
        }
    }
} 