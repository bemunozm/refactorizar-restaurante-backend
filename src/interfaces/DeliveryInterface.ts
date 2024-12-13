import { Document } from 'mongoose';
import { Order } from '../models/Order';
import { User } from '../models/User';

export interface DeliveryInterface {
    deliveryId?: string;
    orders: Order[] | string[];
    status: 'Recibido' | 'En Preparación' | 'En Camino' | 'Completado' | 'Listo para Entregar';
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
    user?: User | string;
    deliveryMan?: User | string;
    createdAt?: Date;
    updatedAt?: Date;
} 

export interface DeliveryDocument extends DeliveryInterface, Document {};
