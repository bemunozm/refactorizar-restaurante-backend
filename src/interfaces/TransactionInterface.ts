
import { Document, Types } from "mongoose";
import { OrderInterface } from "./OrderInterface";
import { Session } from "../models/Session";
import { Order } from "../models/Order";


export interface TransactionInterface {
    transactionId?: string;
    token: string;
    orders: string[];
    sessionId: string;
    amount: number;
    status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
}

export interface TransactionDocument extends TransactionInterface, Document {}
