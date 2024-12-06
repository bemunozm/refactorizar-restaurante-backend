import { Request, Response } from 'express';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor();
    create(req: Request, res: Response): Promise<Response>;
    get(req: Request, res: Response): Promise<Response>;
    getDeliveryByOrderId(req: Request, res: Response): Promise<Response>;
    assign(req: Request, res: Response): Promise<Response>;
    start(req: Request, res: Response): Promise<Response>;
    updateStatus(req: Request, res: Response): Promise<Response>;
    complete(req: Request, res: Response): Promise<Response>;
    inProgress(req: Request, res: Response): Promise<Response>;
    pending(req: Request, res: Response): Promise<Response>;
    getById(req: Request, res: Response): Promise<Response>;
    getDeliveriesByUserId(req: Request, res: Response): Promise<Response>;
    getIncompleteDeliveries(req: Request, res: Response): Promise<Response>;
}
