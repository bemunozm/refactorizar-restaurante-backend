import type { Request, Response } from 'express';
export declare class TableController {
    private readonly tableService;
    constructor();
    createTable(req: Request, res: Response): Promise<Response>;
    updateTable(req: Request, res: Response): Promise<Response>;
    getTables(req: Request, res: Response): Promise<Response>;
    getTable(req: Request, res: Response): Promise<Response>;
    deleteTable(req: Request, res: Response): Promise<Response>;
}
