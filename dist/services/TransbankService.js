"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransbankService = void 0;
const transbank_sdk_1 = require("transbank-sdk");
const Transaction_1 = require("../models/Transaction");
const Order_1 = require("../models/Order");
const Session_1 = require("../models/Session");
const SocketService_1 = require("./SocketService");
const Table_1 = require("../models/Table");
class TransbankService {
    async createTransaction(data) {
        const { amount, sessionId, onlineOrderId, orders } = data;
        console.log(data);
        // Verificar que al menos uno de los identificadores esté presente
        if (!sessionId && !onlineOrderId) {
            throw new Error('Se requiere sessionId o onlineOrderId');
        }
        // Crear la transacción con el identificador adecuado
        const transactionData = {
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
        const transaction = new Transaction_1.Transaction(transactionData);
        await transaction.save();
        const transactionId = transaction.transactionId;
        console.log(transactionId);
        const transbankTransaction = new transbank_sdk_1.WebpayPlus.Transaction(new transbank_sdk_1.Options(transbank_sdk_1.IntegrationCommerceCodes.WEBPAY_PLUS, transbank_sdk_1.IntegrationApiKeys.WEBPAY, transbank_sdk_1.Environment.Integration));
        const response = await transbankTransaction.create(transactionId, sessionId || onlineOrderId, // Usar sessionId o onlineOrderId
        amount, `${process.env.FRONTEND_URL}/transaction-result`);
        await transaction.updateToken(response.token);
        if (sessionId) {
            const session = new Session_1.Session({ sessionId });
            await session.updateStatus('Pagando');
        }
        return response;
    }
    async confirmTransaction(token) {
        const transbankTransaction = new transbank_sdk_1.WebpayPlus.Transaction(new transbank_sdk_1.Options(transbank_sdk_1.IntegrationCommerceCodes.WEBPAY_PLUS, transbank_sdk_1.IntegrationApiKeys.WEBPAY, transbank_sdk_1.Environment.Integration));
        const response = await transbankTransaction.commit(token);
        console.log(response);
        const transaction = await new Transaction_1.Transaction({ token }).findByToken();
        if (!transaction)
            throw new Error('Transacción no encontrada');
        if (transaction.status === 'CONFIRMADA')
            throw new Error('Transacción ya confirmada');
        // Actualizar estado de las órdenes
        if (transaction.orders.length > 0) {
            for (const order of transaction.orders) {
                const orderInstance = await new Order_1.Order({ orderId: order.orderId }).findById();
                if (!orderInstance)
                    throw new Error('Orden no encontrada');
                await orderInstance.updateOrderStatus('Pagado');
            }
            // Manejar la lógica de sesión solo si `session` está presente
            if (transaction.session.sessionId) {
                const sessionOrders = await Order_1.Order.findBySessionId(transaction.session.sessionId);
                const allOrdersPaid = sessionOrders.every((order) => order.status === 'Pagado');
                console.log(allOrdersPaid);
                const session = new Session_1.Session({ sessionId: transaction.session.sessionId });
                if (allOrdersPaid) {
                    await session.updateStatus('Finalizada');
                }
                else {
                    await session.updateStatus('Activa');
                }
            }
        }
        await transaction.updateStatus('CONFIRMADA');
        return response;
    }
    async updateTransactionStatus(transactionId, status) {
        const transaction = await new Transaction_1.Transaction({ transactionId }).findById();
        if (!transaction)
            throw new Error('Transacción no encontrada');
        // Manejar la lógica de sesión solo si `session` está presente
        if (status === 'ANULADA' && transaction.session) {
            const session = new Session_1.Session({ sessionId: transaction.session.sessionId });
            await session.updateStatus('Activa');
        }
        await transaction.updateStatus(status);
        return transaction;
    }
    async notifyWaitersWithToken({ token, status }) {
        const transaction = await new Transaction_1.Transaction({ token }).findByToken();
        if (!transaction || !transaction.session)
            throw new Error('Transacción o sesión no encontrada');
        const tableId = transaction.session.table.tableId;
        // Emitir el token de Transbank a los meseros
        SocketService_1.SocketService.to("waiter", "paymentTokenNotification", {
            token,
            tableId,
            status,
        });
        // Actualizar el estado de la mesa a "Pago Pendiente"
        const tableInstance = new Table_1.Table({ tableId });
        const table = await tableInstance.findById();
        if (!table) {
            throw new Error('Mesa no encontrada');
        }
        table.status = status;
        await table.update({ status });
        return { message: "Token enviado a los meseros y mesa actualizada" };
    }
    async getTransactionByToken(token) {
        const transaction = await new Transaction_1.Transaction({ token }).findByToken();
        return transaction;
    }
    async getTransactionByOnlineOrderId(onlineOrderId) {
        const transaction = await Transaction_1.Transaction.findByOnlineOrderId(onlineOrderId);
        if (!transaction)
            throw new Error('Transacción no encontrada');
        return transaction;
    }
}
exports.TransbankService = TransbankService;
//# sourceMappingURL=TransbankService.js.map