import { Request, Response, NextFunction } from "express";
declare class PermissionMiddleware {
    static checkPermission(permission: string): (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default PermissionMiddleware;
