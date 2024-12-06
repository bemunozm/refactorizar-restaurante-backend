import { Request, Response } from 'express';
export declare class RoleController {
    private readonly roleService;
    constructor();
    getPermissions(req: Request, res: Response): Response;
    createRole(req: Request, res: Response): Promise<Response>;
    getRoles(req: Request, res: Response): Promise<Response>;
    getRoleById(req: Request, res: Response): Promise<Response>;
    updateRole(req: Request, res: Response): Promise<Response>;
    deleteRole(req: Request, res: Response): Promise<Response>;
}
