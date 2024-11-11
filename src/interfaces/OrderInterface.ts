import { Document, Types } from "mongoose";
import { Session } from "../models/Session";
import { Table } from "../models/Table";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { GuestDocument, GuestInterface } from "./GuestInterface";


export interface OrderInterface {
  orderId?: string;
  sessionId:  Session | string;
  tableId: Table | string;
  guestId: GuestInterface;
  userId: User | string;
  items: OrderItemInterface[];
  status: 'Sin Pagar' | 'Pagado' | 'Pendiente';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemInterface {
  itemId?: string;
  productId: Product | string;
  quantity: number;
  status: 'Pendiente'| 'En Preparacion' | 'Listo' | 'Cancelado' | 'Entregado';
  comment?: string;
}

export interface OrderDocument extends OrderInterface, Document {}
export interface OrderItemDocument extends OrderItemInterface, Document {}