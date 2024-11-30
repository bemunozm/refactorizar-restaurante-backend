import { Request, Response } from 'express';
import { AssistanceService } from '../services/AssistanceService';

export class AssistanceController {
    private readonly assistanceService: AssistanceService;

    constructor() {
        this.assistanceService = new AssistanceService();
    }

    /**
     * Crea una nueva asistencia.
     */
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const { sessionId, type, transactionToken } = req.body;
            const assistance = await this.assistanceService.createAssistance({
                sessionId,
                type,
                transactionToken,
            });
            return res.status(201).json(assistance);
        } catch (error) {
            console.error(`Error al crear la asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Asigna un usuario (garzón) a una asistencia.
     */
    public async assign(req: Request, res: Response): Promise<Response> {
        try {
            const { assistanceId, userId } = req.body;
            const assistance = await this.assistanceService.assignAssistance(assistanceId, userId);
            return res.status(200).json(assistance);
        } catch (error) {
            console.error(`Error al asignar asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Completa una asistencia.
     */
    public async complete(req: Request, res: Response): Promise<Response> {
        try {
            const { assistanceId } = req.body;
            const assistance = await this.assistanceService.completeAssistance(assistanceId);
            return res.status(200).json(assistance);
        } catch (error) {
            console.error(`Error al completar asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async updateStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { assistanceId, status } = req.body;
            const assistance = await this.assistanceService.updateStatus(assistanceId, status);
            return res.status(200).json(assistance);
        } catch (error) {
            console.error(`Error al actualizar estado de asistencia: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Confirma una transacción asociada a una asistencia.
     */
    public async confirmTransaction(req: Request, res: Response): Promise<Response> {
        try {
            const { assistanceId, transactionToken } = req.body;
            const assistance = await this.assistanceService.confirmTransaction(assistanceId, transactionToken);
            return res.status(200).json({ message: 'Transacción confirmada', assistance });
        } catch (error) {
            console.error(`Error al confirmar transacción: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async declineTransaction(req: Request, res: Response): Promise<Response> {
        try {
            const { assistanceId, transactionToken } = req.body;
            const assistance = await this.assistanceService.declineTransaction(assistanceId, transactionToken);
            return res.status(200).json({ message: 'Transacción rechazada', assistance });
        } catch (error) {
            console.error(`Error al rechazar transacción: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * Obtiene todas las asistencias.
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const assistances = await this.assistanceService.getAllAssistances();
            return res.status(200).json(assistances);
        } catch (error) {
            console.error(`Error al obtener asistencias: ${error}`);
            return res.status(400).json({ error: error.message });
        }
    }

    public async getAvailableAssistances(req: Request, res: Response) {
        try {
            const {userId} = req.params
            const assistances = await this.assistanceService.getAvailableAssistances(userId);
            return res.status(200).json(assistances);
        } catch (error) {
            console.error(`Error al obtener asistencias disponibles: ${error}`);
            return [];
        }
    }

    // /**
    //  * Obtiene asistencias por sesión.
    //  */
    // public async getBySession(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const { sessionId } = req.params;
    //         const assistances = await this.assistanceService.getAssistancesBySession(sessionId);
    //         return res.status(200).json(assistances);
    //     } catch (error) {
    //         console.error(`Error al obtener asistencias por sesión: ${error}`);
    //         return res.status(400).json({ error: error.message });
    //     }
    // }

    // /**
    //  * Obtiene asistencias por usuario.
    //  */
    // public async getByUser(req: Request, res: Response): Promise<Response> {
    //     try {
    //         const { userId } = req.params;
    //         const assistances = await this.assistanceService.getAssistancesByUser(userId);
    //         return res.status(200).json(assistances);
    //     } catch (error) {
    //         console.error(`Error al obtener asistencias por usuario: ${error}`);
    //         return res.status(400).json({ error: error.message });
    //     }
    // }
}
