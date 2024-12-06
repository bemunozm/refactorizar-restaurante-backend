import { Request, Response, NextFunction } from "express";
declare class ValidationMiddleware {
    static handleInputErrors(req: Request, res: Response, next: NextFunction): void;
}
export default ValidationMiddleware;
