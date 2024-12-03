import { Delivery } from '../models/Delivery';
import { Order } from '../models/Order';
import { SocketService } from './SocketService';

export class DeliveryService {
    public async createDelivery(deliveryData: { orders: string[], address: { lat: number, lng: number } }) {
        const delivery = new Delivery({
            orders: deliveryData.orders.map(orderId => new Order({ orderId })),
            address: deliveryData.address,
            status: 'Pendiente'
        });
        await delivery.save();
            SocketService.to('deliveryRoom', 'newDelivery', delivery);
        return delivery;
    }

    public async getDeliveries() {
        return await Delivery.getAll();
    }

    public async assignDelivery(deliveryId: string, userId: string) {
        const delivery = new Delivery({ deliveryId });
        const updatedDelivery = await delivery.assignUser(userId);
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'newDeliveryToDeliver', updatedDelivery);
            SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async startDelivery(deliveryId: string, startPoint: { lat: number, lng: number }	) {
        const delivery = new Delivery({ deliveryId, startPoint });
        const updatedDelivery = await delivery.start();
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async updateDeliveryStatus(deliveryId: string, status: 'Pendiente' | 'En Progreso' | 'Completado') {
        const delivery = new Delivery({ deliveryId });
        const updatedDelivery = await delivery.updateStatus(status);
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async completeDelivery(deliveryId: string) {
        const delivery = new Delivery({ deliveryId });
        const updatedDelivery = await delivery.complete();
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'removeDelivery', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async inProgressDelivery(deliveryId: string) {
        const delivery = new Delivery({ deliveryId });
        const updatedDelivery = await delivery.inProgress();
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async pendingDelivery(deliveryId: string) {
        const delivery = new Delivery({ deliveryId });
        const updatedDelivery = await delivery.pending();
        if (updatedDelivery) {
            SocketService.to('deliveryRoom', 'deliveryUpdated', updatedDelivery);
        }
        return updatedDelivery;
    }

    public async getDeliveryById(deliveryId: string) {
        const delivery = new Delivery({ deliveryId });
        return await delivery.findById();
    }

    public async getDeliveriesByUserId(userId: string) {
        const deliveries = await Delivery.getAll();
        return deliveries.filter(delivery => delivery.user?.userId ? delivery.user.userId === userId : false);
    }

    public async getIncompleteDeliveries() {
        const deliveries = await Delivery.getAll();
        return deliveries.filter(delivery => delivery.status !== 'Completado');
    }
} 