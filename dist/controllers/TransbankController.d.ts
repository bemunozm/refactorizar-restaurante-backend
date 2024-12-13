import { Request, Response } from 'express';
export declare class TransbankController {
    private readonly transbankService;
    constructor();
    createTransaction(req: Request, res: Response): Promise<Response>;
    confirmTransaction(req: Request, res: Response): Promise<Response>;
    updateTransactionStatus(req: Request, res: Response): Promise<Response>;
    getTransactionByToken(req: Request, res: Response): Promise<Response>;
    notifyWaitersWithToken(req: Request, res: Response): Promise<Response>;
    getTransactionByOnlineOrderId(req: Request, res: Response): Promise<Response>;
}
