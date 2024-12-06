"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
class OrderController {
    orderService;
    constructor() {
        this.orderService = new OrderService_1.OrderService();
    }
    async orderProducts(req, res) {
        try {
            console.log(req.body);
            const order = await this.orderService.orderProducts(req.body);
            return res.status(201).json(order);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al realizar el pedido' });
        }
    }
    async getOrders(req, res) {
        try {
            const orders = await this.orderService.getOrders();
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }
    async getOrdersBySessionId(req, res) {
        const { sessionId } = req.params;
        try {
            const orders = await this.orderService.getOrdersBySessionId(sessionId);
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }
    async updateOrderItemStatus(req, res) {
        const { itemId } = req.params;
        const { status } = req.body;
        try {
            const updatedOrder = await this.orderService.updateOrderItemStatus(itemId, status);
            return res.status(200).json({ message: 'Estado del ítem actualizado con éxito', updatedOrder });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al actualizar el estado del ítem' });
        }
    }
    async getOrderById(req, res) {
        const { orderId } = req.params;
        try {
            const order = await this.orderService.getOrderById(orderId);
            return res.status(200).json(order);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener la orden' });
        }
    }
    async getOrdersForKitchen(req, res) {
        try {
            const orders = await this.orderService.getOrdersForKitchen();
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al obtener los pedidos para la cocina' });
        }
    }
    async getOrdersByUserId(req, res) {
        const { userId } = req.params;
        try {
            const orders = await this.orderService.getOrdersByUserId(userId);
            console.log('Orders', orders);
            return res.status(200).json(orders);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }
    async updateOrderStatus(req, res) {
        const { orderId } = req.params;
        const { status } = req.body;
        try {
            const updatedOrder = await this.orderService.updateOrderStatus(orderId, status);
            return res.status(200).json({ message: 'Estado de la orden actualizado con éxito', updatedOrder });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Hubo un error al actualizar el estado de la orden' });
        }
    }
}
exports.OrderController = OrderController;
//# sourceMappingURL=OrderController.js.map