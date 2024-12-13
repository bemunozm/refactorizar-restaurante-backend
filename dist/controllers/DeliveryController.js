"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryController = void 0;
const DeliveryService_1 = require("../services/DeliveryService");
class DeliveryController {
    deliveryService;
    constructor() {
        this.deliveryService = new DeliveryService_1.DeliveryService();
    }
    async create(req, res) {
        try {
            const { orders, address, customerInformation } = req.body;
            const delivery = await this.deliveryService.createDelivery({ orders, address, customerInformation });
            return res.status(201).json(delivery);
        }
        catch (error) {
            console.error(`Error al crear la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async get(req, res) {
        try {
            const deliveries = await this.deliveryService.getDeliveries();
            return res.status(200).json(deliveries);
        }
        catch (error) {
            console.error(`Error al obtener las entregas: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async getDeliveryByOrderId(req, res) {
        try {
            const { orderId } = req.params;
            const delivery = await this.deliveryService.getDeliveryByOrderId(orderId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al obtener la entrega por orderId: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async assign(req, res) {
        try {
            const { deliveryId, userId } = req.body;
            const delivery = await this.deliveryService.assignDelivery(deliveryId, userId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al asignar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async start(req, res) {
        try {
            const { deliveryId, startPoint } = req.body;
            const delivery = await this.deliveryService.startDelivery(deliveryId, startPoint);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al iniciar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { deliveryId, status } = req.body;
            const delivery = await this.deliveryService.updateDeliveryStatus(deliveryId, status);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async complete(req, res) {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.completeDelivery(deliveryId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al completar la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async inProgress(req, res) {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.inProgressDelivery(deliveryId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async pending(req, res) {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.pendingDelivery(deliveryId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al actualizar el estado de la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async getById(req, res) {
        try {
            const { deliveryId } = req.params;
            const delivery = await this.deliveryService.getDeliveryById(deliveryId);
            return res.status(200).json(delivery);
        }
        catch (error) {
            console.error(`Error al obtener la entrega: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async getDeliveriesByUserId(req, res) {
        try {
            const { userId } = req.params;
            const deliveries = await this.deliveryService.getDeliveriesByUserId(userId);
            return res.status(200).json(deliveries);
        }
        catch (error) {
            console.error(`Error al obtener las entregas del usuario: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
    async getIncompleteDeliveries(req, res) {
        try {
            const deliveries = await this.deliveryService.getIncompleteDeliveries();
            return res.status(200).json(deliveries);
        }
        catch (error) {
            console.error(`Error al obtener las entregas incompletas: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }
}
exports.DeliveryController = DeliveryController;
//# sourceMappingURL=DeliveryController.js.map