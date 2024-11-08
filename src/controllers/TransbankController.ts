import { Request, Response } from 'express';
import { TransbankService } from '../services/TransbankService';

export class TransbankController {
    private readonly transbankService: TransbankService;

    constructor() {
        this.transbankService = new TransbankService();
    }

    public async createTransaction(req: Request, res: Response): Promise<Response> {
        try {
            const { amount, sessionId, orders } = req.body;
            const response = await this.transbankService.createTransaction({ amount, sessionId, orders });
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
}
