"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransbankController = void 0;
const TransbankService_1 = require("../services/TransbankService");
class TransbankController {
    transbankService;
    constructor() {
        this.transbankService = new TransbankService_1.TransbankService();
    }
    async createTransaction(req, res) {
        try {
            const { amount, sessionId, onlineOrderId, orders } = req.body;
            if (!sessionId && !onlineOrderId) {
                return res.status(400).json({ error: 'Se requiere sessionId o onlineOrderId' });
            }
            const response = await this.transbankService.createTransaction({
                amount,
                sessionId,
                onlineOrderId,
                orders
            });
            return res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear la transacción' });
        }
    }
    async confirmTransaction(req, res) {
        try {
            const { token } = req.body;
            const response = await this.transbankService.confirmTransaction(token);
            return res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error confirmando la transacción' });
        }
    }
    async updateTransactionStatus(req, res) {
        try {
            const { transactionId, status } = req.body;
            const transaction = await this.transbankService.updateTransactionStatus(transactionId, status);
            return transaction
                ? res.status(200).json(transaction)
                : res.status(404).json({ error: 'Transacción no encontrada' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error actualizando la transacción' });
        }
    }
    async getTransactionByToken(req, res) {
        try {
            const { token } = req.params;
            const transaction = await this.transbankService.getTransactionByToken(token);
            return transaction
                ? res.status(200).json(transaction)
                : res.status(404).json({ error: 'Transacción no encontrada' });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error buscando la transacción' });
        }
    }
    async notifyWaitersWithToken(req, res) {
        try {
            const { token, status } = req.body;
            const response = await this.transbankService.notifyWaitersWithToken({ token, status });
            return res.status(200).json(response);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error notificando a los garzones' });
        }
    }
}
exports.TransbankController = TransbankController;
//# sourceMappingURL=TransbankController.js.map