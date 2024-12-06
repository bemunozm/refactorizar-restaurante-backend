import { Request, Response } from 'express';
import { DeliveryService } from '../services/DeliveryService';

export class DeliveryController {
    private readonly deliveryService: DeliveryService;

    constructor() {
        this.deliveryService = new DeliveryService();
    }

    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { orders, address, customerInformation } = req.body;
            const delivery = await this.deliveryService.createDelivery({ orders, address, customerInformation });
            return res.status(201).json(delivery);
        } catch (error) {
            console.error(`Error al crear la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async get(req: Request, res: Response): Promise<Response> {
        try {
            const deliveries = await this.deliveryService.getDeliveries();
            return res.status(200).json(deliveries);
        } catch (error) {
            console.error(`Error al obtener las entregas: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async getDeliveryByOrderId(req: Request, res: Response): Promise<Response> {
        try {
            const { orderId } = req.params;
            const delivery = await this.deliveryService.getDeliveryByOrderId(orderId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al obtener la entrega por orderId: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async assign(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId, userId } = req.body;
            const delivery = await this.deliveryService.assignDelivery(deliveryId, userId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al asignar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async start(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId, startPoint } = req.body;
            const delivery = await this.deliveryService.startDelivery(deliveryId, startPoint);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al iniciar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId, status } = req.body;
            const delivery = await this.deliveryService.updateDeliveryStatus(deliveryId, status);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async complete(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.completeDelivery(deliveryId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al completar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async inProgress(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.inProgressDelivery(deliveryId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async pending(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.pendingDelivery(deliveryId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.getDeliveryById(deliveryId);
            return res.status(200).json(delivery);
        } catch (error) {
            console.error(`Error al obtener la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async getDeliveriesByUserId(req: Request, res: Response): Promise<Response> {
        try {
            const { userId } = req.params;
            const deliveries = await this.deliveryService.getDeliveriesByUserId(userId);
            return res.status(200).json(deliveries);
        } catch (error) {
            console.error(`Error al obtener las entregas del usuario: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async getIncompleteDeliveries(req: Request, res: Response): Promise<Response> {
        try {
            const deliveries = await this.deliveryService.getIncompleteDeliveries();
            return res.status(200).json(deliveries);
        } catch (error) {
            console.error(`Error al obtener las entregas incompletas: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
} 