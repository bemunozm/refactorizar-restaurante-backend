import { Request, Response } from 'express';
export declare class IngredientController {
    private readonly ingredientService;
    constructor();
    createIngredient(req: Request, res: Response): Promise<Response>;
    updateIngredient(req: Request, res: Response): Promise<Response>;
    getIngredients(req: Request, res: Response): Promise<Response>;
    getIngredient(req: Request, res: Response): Promise<Response>;
    deleteIngredient(req: Request, res: Response): Promise<Response>;
}
