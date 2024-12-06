import { Document } from "mongoose";
import { Session } from "../models/Session";
import { Order } from "../models/Order";
export interface TransactionInterface {
    transactionId?: string;
    token: string;
    orders?: Order[];
    session?: Session | string;
    onlineOrderId?: string;
    amount: number;
    status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
}
export interface TransactionDocument extends TransactionInterface, Document {
}
