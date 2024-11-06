import { Document, Types } from "mongoose";
import { GuestInterface } from "./GuestInterface";


export interface SessionInterface {
  sessionId?: string;
  tableId: string | Types.ObjectId;
  guests: GuestInterface[];
  status: 'Activa' | 'Pagando' | 'Finalizada';
}

export interface SessionDocument extends SessionInterface, Document {}