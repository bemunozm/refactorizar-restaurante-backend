import { Session } from "../models/Session";
export declare class AuthService {
    createAccount(data: any): Promise<{
        token: string;
        session?: Session;
    }>;
    login(data: any): Promise<{
        token: any;
        session: Session;
    }>;
    createAccountByAdmin(data: any): Promise<void>;
    confirmAccount(token: string): Promise<boolean>;
    resendConfirmationEmail(email: string): Promise<void>;
    resetPassword(email: string): Promise<void>;
    changePassword(token: string, password: string): Promise<boolean>;
    requestConfirmationCode(email: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    validateToken(token: string): Promise<boolean>;
    updatePasswordWithToken(token: string, password: string): Promise<boolean>;
    checkPassword(password: string, userId: string): Promise<boolean>;
    updatePassword(data: any, userId: any): Promise<boolean>;
}
