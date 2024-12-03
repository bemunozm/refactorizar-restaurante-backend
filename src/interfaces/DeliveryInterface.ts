import { Document } from 'mongoose';
import { Order } from '../models/Order';
import { User } from '../models/User';

export interface DeliveryInterface {
    deliveryId?: string;
    orders: Order[] | string[];
    status: 'Pendiente' | 'En Progreso' | 'Completado';
    address: {
        lat: number;
        lng: number;
    };
    startPoint: {
        lat: number;
        lng: number;
    };
    user?: User | string;
    createdAt?: Date;
    updatedAt?: Date;
} 

export interface DeliveryDocument extends DeliveryInterface, Document {};
