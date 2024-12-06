import { Delivery } from '../models/Delivery';
export declare class DeliveryService {
    createDelivery(deliveryData: {
        orders: string[];
        address: {
            lat: number;
            lng: number;
        };
        customerInformation: Delivery['customerInformation'];
    }): Promise<Delivery>;
    getDeliveries(): Promise<Delivery[]>;
    getDeliveryByOrderId(orderId: string): Promise<Delivery>;
    assignDelivery(deliveryId: string, userId: string): Promise<Delivery>;
    startDelivery(deliveryId: string, startPoint: {
        lat: number;
        lng: number;
    }): Promise<Delivery>;
    updateDeliveryStatus(deliveryId: string, status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado'): Promise<Delivery>;
    completeDelivery(deliveryId: string): Promise<Delivery>;
    inProgressDelivery(deliveryId: string): Promise<Delivery>;
    pendingDelivery(deliveryId: string): Promise<Delivery>;
    getDeliveryById(deliveryId: string): Promise<Delivery>;
    getDeliveriesByUserId(userId: string): Promise<Delivery[]>;
    getIncompleteDeliveries(): Promise<Delivery[]>;
}
