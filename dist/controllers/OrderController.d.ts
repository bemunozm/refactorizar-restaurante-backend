import { Request, Response } from 'express';
export declare class OrderController {
    private readonly orderService;
    constructor();
    orderProducts(req: Request, res: Response): Promise<Response>;
    getOrders(req: Request, res: Response): Promise<Response>;
    getOrdersBySessionId(req: Request, res: Response): Promise<Response>;
    updateOrderItemStatus(req: Request, res: Response): Promise<Response>;
    getOrderById(req: Request, res: Response): Promise<Response>;
    getOrdersForKitchen(req: Request, res: Response): Promise<Response>;
    getOrdersByUserId(req: Request, res: Response): Promise<Response>;
    updateOrderStatus(req: Request, res: Response): Promise<Response>;
}
