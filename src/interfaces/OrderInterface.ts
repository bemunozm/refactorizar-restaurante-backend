import { Document, Types } from "mongoose";


export interface OrderInterface {
  orderId?: string;
  sessionId: Types.ObjectId | string;
  tableId: Types.ObjectId | string;
  guestId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  items: OrderItemInterface[];
  status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
}

export interface OrderItemInterface {
  productId: string;
  quantity: number;
  status: 'Pendiente'| 'En Preparacion' | 'Listo' | 'Cancelado' | 'Entregado';
}

export interface OrderDocument extends OrderInterface, Document {}