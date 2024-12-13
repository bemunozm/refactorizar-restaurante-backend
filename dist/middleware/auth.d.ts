import { Request, Response, NextFunction } from "express";
import { UserInterface } from "../interfaces/UserInterface";
import { Session } from "../models/Session";
import { GuestInterface } from "../interfaces/GuestInterface";
import { Table } from "../models/Table";
declare global {
    namespace Express {
        interface Request {
            user?: UserInterface;
            guest?: GuestInterface;
            sessionId?: Session;
            tableId?: Table;
            role: string;
        }
    }
}
declare class AuthMiddleware {
    static authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default AuthMiddleware;
