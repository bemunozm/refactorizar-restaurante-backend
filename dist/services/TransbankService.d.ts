import { Transaction } from '../models/Transaction';
export declare class TransbankService {
    createTransaction(data: {
        amount: number;
        sessionId?: string;
        onlineOrderId?: string;
        orders?: string[];
    }): Promise<any>;
    confirmTransaction(token: string): Promise<any>;
    updateTransactionStatus(transactionId: string, status: 'ANULADA' | 'CONFIRMADA'): Promise<Transaction>;
    notifyWaitersWithToken({ token, status }: {
        token: string;
        status: 'Pago con Tarjeta' | 'Pago con Efectivo';
    }): Promise<{
        message: string;
    }>;
    getTransactionByToken(token: string): Promise<Transaction>;
    getTransactionByOnlineOrderId(onlineOrderId: string): Promise<Transaction>;
}
