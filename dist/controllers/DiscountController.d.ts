import { Request, Response } from 'express';
export declare class DiscountController {
    private readonly discountService;
    constructor();
    createDiscount(req: Request, res: Response): Promise<Response>;
    getDiscountById(req: Request, res: Response): Promise<Response>;
    updateDiscount(req: Request, res: Response): Promise<Response>;
    deleteDiscount(req: Request, res: Response): Promise<Response>;
    getDiscounts(req: Request, res: Response): Promise<Response>;
    validateDiscountByPromotionCode(req: Request, res: Response): Promise<Response>;
    validateDiscountByPromotionCodeOnline(req: Request, res: Response): Promise<Response>;
}
