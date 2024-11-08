import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';

export class OrderController {
    private readonly orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public async orderProducts(req: Request, res: Response): Promise<Response> {
        try {
            
            const order = await this.orderService.orderProducts(req.body);
            return res.status(201).json({ message: 'Pedido realizado con éxito', order });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al realizar el pedido' });
        }
    }

    public async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await this.orderService.getOrders();
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }

    public async getOrdersBySessionId(req: Request, res: Response): Promise<Response> {
        const { sessionId } = req.params;
        try {
            const orders = await this.orderService.getOrdersBySessionId(sessionId);
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }

    public async updateOrderItemStatus(req: Request, res: Response): Promise<Response> {
        const { itemId } = req.params;
        const { status } = req.body;

        try {
            const updatedOrder = await this.orderService.updateOrderItemStatus(itemId, status);
            return res.status(200).json({ message: 'Estado del ítem actualizado con éxito', updatedOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al actualizar el estado del ítem' });
        }
    }

    public async getOrderById(req: Request, res: Response): Promise<Response> {
        const { orderId } = req.params;

        try {
            const order = await this.orderService.getOrderById(orderId);
            return res.status(200).json(order);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener la orden' });
        }
    }

    public async getOrdersForKitchen(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await this.orderService.getOrdersForKitchen();
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al obtener los pedidos para la cocina' });
        }
    }

    public async getOrdersByUserId(req: Request, res: Response): Promise<Response> {
        const { userId } = req.params;

        try {
            const orders = await this.orderService.getOrdersByUserId(userId);
            return res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }

    public async updateOrderStatus(req: Request, res: Response): Promise<Response> {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            const updatedOrder = await this.orderService.updateOrderStatus(orderId, status);
            return res.status(200).json({ message: 'Estado de la orden actualizado con éxito', updatedOrder });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al actualizar el estado de la orden' });
        }
    }
}
