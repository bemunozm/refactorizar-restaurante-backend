import type { Request, Response } from 'express';
export declare class CategoryController {
    private readonly categoryService;
    constructor();
    createCategory(req: Request, res: Response): Promise<Response>;
    getCategories(req: Request, res: Response): Promise<Response>;
    getCategory(req: Request, res: Response): Promise<Response>;
    updateCategory(req: Request, res: Response): Promise<Response>;
    deleteCategory(req: Request, res: Response): Promise<Response>;
}
