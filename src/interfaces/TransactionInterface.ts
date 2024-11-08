
import { Document, Types } from "mongoose";
import { OrderInterface } from "./OrderInterface";


export interface TransactionInterface {
    transactionId?: string;
    token: string;
    orders: OrderInterface[];
    sessionId: string | Types.ObjectId;
    amount: number;
    status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
}

export interface TransactionDocument extends TransactionInterface, Document {}
