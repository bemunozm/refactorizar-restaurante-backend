import { Document } from 'mongoose';
import { Session } from '../models/Session';
import { User } from '../models/User';
import { Product } from '../models/Product';

export interface AssistanceInterface {
    assistanceId?: string;
    session: Session;
    user: User | null;
    type: 'Pago con Tarjeta' | 'Pago con Efectivo' | 'Solicita Asistencia' | 'Pedido Listo';
    status: 'Pendiente' | 'En Progreso' | 'Completado';
    transactionToken?: string;
    itemId?: string;
    itemDetails?: {
        product: Product;
        quantity: number;
        comment: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AssistanceDocument extends AssistanceInterface, Document {}