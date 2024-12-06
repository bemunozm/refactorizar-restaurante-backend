import { DeliveryInterface } from '../interfaces/DeliveryInterface';
import { Order } from './Order';
import { User } from './User';
export declare class Delivery implements DeliveryInterface {
    deliveryId?: string;
    orders: Order[];
    status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado';
    customerInformation: {
        name: string;
        lastName: string;
        phone: string;
        email?: string;
        instructions?: string | null;
    };
    address: {
        lat: number;
        lng: number;
    };
    startPoint: {
        lat: number;
        lng: number;
    };
    user?: User;
    deliveryMan?: User;
    createdAt?: Date;
    updatedAt?: Date;
    private deliveryRepository;
    constructor(delivery: Partial<DeliveryInterface>);
    private sanitizeData;
    save(): Promise<Delivery>;
    static getAll(): Promise<Delivery[]>;
    static getByOrderId(orderId: string): Promise<Delivery | null>;
    assignUser(userId: string): Promise<Delivery | null>;
    start(): Promise<Delivery | null>;
    updateStatus(status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado'): Promise<Delivery | null>;
    complete(): Promise<Delivery | null>;
    inProgress(): Promise<Delivery | null>;
    pending(): Promise<Delivery | null>;
    findById(): Promise<Delivery | null>;
    private populateDelivery;
}
