import { WebpayPlus, Options, Environment, IntegrationApiKeys, IntegrationCommerceCodes } from 'transbank-sdk';
import { Transaction } from '../models/Transaction';
import { Order } from '../models/Order';
import { Session } from '../models/Session';
import { OrderInterface } from '../interfaces/OrderInterface';
import { SocketService } from './SocketService';
import { Table } from '../models/Table';

export class TransbankService {
    public async createTransaction(data: { amount: number; sessionId?: string; onlineOrderId?: string; orders?: string[] }) {
        const { amount, sessionId, onlineOrderId, orders } = data;
        console.log(data);

        // Verificar que al menos uno de los identificadores esté presente
        if (!sessionId && !onlineOrderId) {
            throw new Error('Se requiere sessionId o onlineOrderId');
        }

        // Crear la transacción con el identificador adecuado
        const transactionData: any = {
            token: '',
            amount
        };

        // Asignar session o onlineOrderId si están presentes
        if (sessionId) {
            transactionData.session = sessionId;
        }
        if (onlineOrderId) {
            transactionData.onlineOrderId = onlineOrderId;
        }
        if (orders) {
            transactionData.orders = orders;
        }

        const transaction = new Transaction(transactionData);
        await transaction.save();

        const transactionId = transaction.transactionId;
        console.log(transactionId);

        const transbankTransaction = new WebpayPlus.Transaction(
            new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
        );

        const response = await transbankTransaction.create(
            transactionId,
            sessionId || onlineOrderId, // Usar sessionId o onlineOrderId
            amount,
            `${process.env.VITE_API_URL}/transaction-result`
        );

        await transaction.updateToken(response.token);

        if (sessionId) {
            const session = new Session({ sessionId });
            await session.updateStatus('Pagando');
        }

        return response;
    }

    public async confirmTransaction(token: string) {
        const transbankTransaction = new WebpayPlus.Transaction(
            new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration)
        );

        const response = await transbankTransaction.commit(token);
        console.log(response);

        const transaction = await new Transaction({ token }).findByToken();
        if (!transaction) throw new Error('Transacción no encontrada');
        if (transaction.status === 'CONFIRMADA') throw new Error('Transacción ya confirmada');

        // Actualizar estado de las órdenes
        if (transaction.orders.length > 0) {
            for (const order of transaction.orders) {
                const orderInstance = await new Order({ orderId: order.orderId }).findById();
                if (!orderInstance) throw new Error('Orden no encontrada');
                await orderInstance.updateOrderStatus('Pagado');
            }

            // Manejar la lógica de sesión solo si `session` está presente
            if (transaction.session.sessionId) {
                const sessionOrders = await Order.findBySessionId(transaction.session.sessionId);
                const allOrdersPaid = sessionOrders.every((order) => order.status === 'Pagado');
                console.log(allOrdersPaid);
                const session = new Session({ sessionId: transaction.session.sessionId });
                if (allOrdersPaid) {
                    await session.updateStatus('Finalizada');
                } else {
                    await session.updateStatus('Activa');
                }
            }
        }
        await transaction.updateStatus('CONFIRMADA');

        return response;
    }

    public async updateTransactionStatus(transactionId: string, status: 'ANULADA' | 'CONFIRMADA') {
        const transaction = await new Transaction({ transactionId }).findById();
        if (!transaction) throw new Error('Transacción no encontrada');

        // Manejar la lógica de sesión solo si `session` está presente
        if (status === 'ANULADA' && transaction.session) {
            const session = new Session({ sessionId: transaction.session.sessionId });
            await session.updateStatus('Activa');
        }

        await transaction.updateStatus(status);

        return transaction;
    }

    public async notifyWaitersWithToken({ token, status }: { token: string, status: 'Pago con Tarjeta' | 'Pago en Efectivo' }) {
        const transaction = await new Transaction({ token }).findByToken();
        if (!transaction || !transaction.session) throw new Error('Transacción o sesión no encontrada');

        const tableId = transaction.session.table.tableId;
        // Emitir el token de Transbank a los meseros
        SocketService.to("waiter", "paymentTokenNotification", {
            token,
            tableId,
            status,
        });
    
        // Actualizar el estado de la mesa a "Pago Pendiente"
        const tableInstance = new Table({ tableId });
        const table = await tableInstance.findById();
        if (!table) {
            throw new Error('Mesa no encontrada');
        }
        table.status = status;
        await table.update({ status });
    
        return { message: "Token enviado a los meseros y mesa actualizada" };
    }

    public async getTransactionByToken(token: string) {
        const transaction = await new Transaction({ token }).findByToken();
        return transaction;
    }
    
}
