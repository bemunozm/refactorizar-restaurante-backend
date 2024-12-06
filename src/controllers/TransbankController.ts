import { Request, Response } from 'express';
import { TransbankService } from '../services/TransbankService';

export class TransbankController {
    private readonly transbankService: TransbankService;

    constructor() {
        this.transbankService = new TransbankService();
    }

    public async createTransaction(req: Request, res: Response): Promise<Response> {
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
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al crear la transacción' });
        }
    }

    public async confirmTransaction(req: Request, res: Response): Promise<Response> {
        try {
            const { token } = req.body;
            const response = await this.transbankService.confirmTransaction(token);
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error confirmando la transacción' });
        }
    }

    public async updateTransactionStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { transactionId, status } = req.body;
            const transaction = await this.transbankService.updateTransactionStatus(transactionId, status);
            return transaction
                ? res.status(200).json(transaction)
                : res.status(404).json({ error: 'Transacción no encontrada' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error actualizando la transacción' });
        }
    }

    public async getTransactionByToken(req: Request, res: Response): Promise<Response> {
        try {
            const { token } = req.params;
            const transaction = await this.transbankService.getTransactionByToken(token);
            return transaction
                ? res.status(200).json(transaction)
                : res.status(404).json({ error: 'Transacción no encontrada' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error buscando la transacción' });
        }
    }

    public async notifyWaitersWithToken(req: Request, res: Response): Promise<Response> {
        try {
            const { token, status } = req.body;
            const response = await this.transbankService.notifyWaitersWithToken({ token, status });
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error notificando a los garzones' });
        }
    }
}
