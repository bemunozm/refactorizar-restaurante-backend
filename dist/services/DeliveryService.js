"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const Delivery_1 = require("../models/Delivery");
const Order_1 = require("../models/Order");
const SocketService_1 = require("./SocketService");
class DeliveryService {
    async createDelivery(deliveryData) {
        const delivery = new Delivery_1.Delivery({
            orders: deliveryData.orders.map(orderId => new Order_1.Order({ orderId })),
            address: deliveryData.address ? deliveryData.address : null,
            customerInformation: deliveryData.customerInformation,
            status: 'Recibido'
        });
        await delivery.save();
        SocketService_1.SocketService.to('deliveryRoom', 'newDelivery', delivery);
        return delivery;
    }
    async getDeliveries() {
        return await Delivery_1.Delivery.getAll();
    }
    async getDeliveryByOrderId(orderId) {
        return await Delivery_1.Delivery.getByOrderId(orderId);
    }
    async assignDelivery(deliveryId, userId) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        const updatedDelivery = await delivery.assignUser(userId);
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'newDeliveryToDeliver', updatedDelivery);
            SocketService_1.SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }
    async startDelivery(deliveryId, startPoint) {
        const delivery = new Delivery_1.Delivery({ deliveryId, startPoint });
        const updatedDelivery = await delivery.start();
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }
    async updateDeliveryStatus(deliveryId, status) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        const updatedDelivery = await delivery.updateStatus(status);
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }
    async completeDelivery(deliveryId) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        const updatedDelivery = await delivery.complete();
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'removeDelivery', updatedDelivery);
        }
        return updatedDelivery;
    }
    async inProgressDelivery(deliveryId) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        const updatedDelivery = await delivery.inProgress();
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }
    async pendingDelivery(deliveryId) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        const updatedDelivery = await delivery.pending();
        if (updatedDelivery) {
            SocketService_1.SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }
    async getDeliveryById(deliveryId) {
        const delivery = new Delivery_1.Delivery({ deliveryId });
        return await delivery.findById();
    }
    async getDeliveriesByUserId(userId) {
        const deliveries = await Delivery_1.Delivery.getAll();
        return deliveries.filter(delivery => delivery.deliveryMan?.userId ? delivery.deliveryMan.userId === userId : false);
    }
    async getIncompleteDeliveries() {
        const deliveries = await Delivery_1.Delivery.getAll();
        return deliveries.filter(delivery => delivery.status !== 'Completado');
    }
}
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=DeliveryService.js.map