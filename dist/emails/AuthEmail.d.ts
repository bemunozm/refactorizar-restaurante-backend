type EmailType = {
    email: string;
    name: string;
    token: string;
};
export declare class AuthEmail {
    static sendConfirmationEmail: (user: EmailType) => Promise<void>;
    static sendPasswordResetToken: (user: EmailType) => Promise<void>;
    static sendWelcomeEmail: (user: EmailType) => Promise<void>;
}
export {};