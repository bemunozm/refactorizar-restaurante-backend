import { Request, Response } from "express";
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor();
    createAccount(req: Request, res: Response): Promise<Response>;
    login(req: Request, res: Response): Promise<Response>;
    getAllUsers(req: Request, res: Response): Promise<Response>;
    getUserById(req: Request, res: Response): Promise<Response>;
    updateUserById(req: Request, res: Response): Promise<Response>;
    deleteUserById(req: Request, res: Response): Promise<Response>;
    createAccountByAdmin(req: Request, res: Response): Promise<Response>;
    confirmAccount(req: Request, res: Response): Promise<Response>;
    requestConfirmationCode(req: Request, res: Response): Promise<Response>;
    forgotPassword(req: Request, res: Response): Promise<Response>;
    validateToken(req: Request, res: Response): Promise<Response>;
    updatePasswordWithToken(req: Request, res: Response): Promise<Response>;
    checkPassword(req: Request, res: Response): Promise<Response>;
    user(req: Request, res: Response): Promise<Response>;
    updatePassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
