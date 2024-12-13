import type { Request, Response } from 'express';
export declare class ProductController {
    private readonly productService;
    constructor();
    createProduct(req: Request, res: Response): Promise<Response>;
    getAvailableProducts(req: Request, res: Response): Promise<Response>;
    getProducts(req: Request, res: Response): Promise<Response>;
    getProduct(req: Request, res: Response): Promise<Response>;
    updateProduct(req: Request, res: Response): Promise<Response>;
    deleteProduct(req: Request, res: Response): Promise<Response>;
    getProductsByCategory(req: Request, res: Response): Promise<Response>;
}
