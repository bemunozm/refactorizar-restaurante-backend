import { Document, Types } from "mongoose";
import { Session } from "../models/Session";
import { Table } from "../models/Table";
import { User } from "../models/User";
import { Product } from "../models/Product";
import { GuestDocument, GuestInterface } from "./GuestInterface";


export interface OrderInterface {
  orderId?: string;
  session?: Session ;
  table?: Table ;
  guest?: GuestInterface ;
  user?: User ;
  type: 'Retiro en Tienda' | 'Delivery' | 'Presencial';
  items: OrderItemInterface[];
  status: 'Sin Pagar' | 'Pagado' | 'Pendiente' | 'Cancelado' | 'Entregado' | 'Listo' | 'En Preparacion';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItemInterface {
  itemId?: string;
  product: Product ;
  quantity: number;
  status: 'Pendiente'| 'En Preparacion' | 'Listo' | 'Cancelado' | 'Entregado';
  comment?: string;
}

export interface OrderDocument extends OrderInterface, Document {}
export interface OrderItemDocument extends OrderItemInterface, Document {}