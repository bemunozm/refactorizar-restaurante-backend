import { Document } from "mongoose";

export interface TableInterface {
    tableId?: string;
    tableNumber: number;
    status: "Disponible" | "Ocupada" | "Reservada";
}

export interface TableDocument extends TableInterface, Document {}