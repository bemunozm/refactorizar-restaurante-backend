import { Document, Types } from "mongoose";
import { GuestInterface } from "./GuestInterface";


export interface SessionInterface {
  sessionId?: string;
  tableId: Types.ObjectId | string;
  guests: GuestInterface[];
  status: 'Activa' | 'Pagando' | 'Finalizada';
}

export interface SessionDocument extends SessionInterface, Document {}