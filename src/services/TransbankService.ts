import { WebpayPlus, Options, Environment, IntegrationApiKeys, IntegrationCommerceCodes } from 'transbank-sdk';
import { Transaction } from '../models/Transaction';
import { Order } from '../models/Order';
import { Session } from '../models/Session';
import { OrderInterface } from '../interfaces/OrderInterface';

export class TransbankService {
    public async createTransaction(data: { amount: number; sessionId: string; orders: string[] }) {
        const { amount, sessionId, orders } = data;
        console.log(data);
        const transaction = new Transaction({ token: '', session: sessionId, orders, amount });
        await transaction.save();

        const transactionId = transaction.transactionId;
        console.log(transactionId);

        const transbankTransaction = new WebpayPlus.Transaction(
            new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
        );

        const response = await transbankTransaction.create(
            transactionId,
            sessionId,
            amount,
            'http://localhost:5173/transaction-result'
        );

        await transaction.updateToken(response.token);

        const session = new Session({ sessionId });
        await session.updateStatus('Pagando');

        return response;
    }

    public async confirmTransaction(token: string) {
        const transbankTransaction = new WebpayPlus.Transaction(
            new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
        );

        const response = await transbankTransaction.commit(token);

        const transaction = await new Transaction({ token }).findByToken();
        if (!transaction) throw new Error('Transacción no encontrada');
        if (transaction.status === 'CONFIRMADA') throw new Error('Transacción ya confirmada');

        //Actualizar estado de las ordenes
        for (const order of transaction.orders) {
            const orderInstance = await new Order({ orderId: order.orderId }).findById();
            if (!order) throw new Error('Orden no encontrada');
            await orderInstance.updateOrderStatus('Pagado');
        }

        const sessionOrders = await Order.findBySessionId(transaction.session.sessionId);
        const allOrdersPaid = sessionOrders.every((order) => order.status === 'Pagado');

        const session = new Session({ sessionId: transaction.session.sessionId });
        if (allOrdersPaid) {
            await session.updateStatus('Finalizada');
        } else {
            await session.updateStatus('Activa');
        }

        await transaction.updateStatus('CONFIRMADA');

        return response;
    }

    public async updateTransactionStatus(transactionId: string, status: 'ANULADA' | 'CONFIRMADA') {
        const transaction = await new Transaction({ transactionId }).findById();
        if (!transaction) throw new Error('Transacción no encontrada');

        if (status === 'ANULADA') {
            const session = new Session({ sessionId: transaction.session.sessionId });
            await session.updateStatus('Activa');
        }

        await transaction.updateStatus(status);

        return transaction;
    }
}
