import { Document, Types } from "mongoose";
import { GuestInterface } from "./GuestInterface";
import { Table } from "../models/Table";


export interface SessionInterface {
  sessionId?: string;
  table: Table;
  guests: GuestInterface[] ;
  status: 'Activa' | 'Pagando' | 'Finalizada';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SessionDocument extends SessionInterface, Document {}