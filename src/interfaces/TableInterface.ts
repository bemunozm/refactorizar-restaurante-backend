import { Document } from "mongoose";

export interface TableInterface {
    tableId?: string;
    tableNumber: number;
    status: 'Disponible' | 'Ocupada' | 'Reservada' | 'Solicita Asistencia' | 'Pago con Efectivo' | 'Pago con Tarjeta';
}

export interface TableDocument extends TableInterface, Document {}