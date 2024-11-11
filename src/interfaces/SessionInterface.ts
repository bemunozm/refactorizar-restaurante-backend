import { Document, Types } from "mongoose";
import { GuestInterface } from "./GuestInterface";
import { Table } from "../models/Table";


export interface SessionInterface {
  sessionId?: string;
  tableId: Table | string;
  guests: GuestInterface[];
  status: 'Activa' | 'Pagando' | 'Finalizada';
}

export interface SessionDocument extends SessionInterface, Document {}