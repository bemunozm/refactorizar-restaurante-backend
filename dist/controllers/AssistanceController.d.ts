import { Request, Response } from 'express';
export declare class AssistanceController {
    private readonly assistanceService;
    constructor();
    /**
     * Crea una nueva asistencia.
     */
    create(req: Request, res: Response): Promise<Response>;
    /**
     * Asigna un usuario (garzón) a una asistencia.
     */
    assign(req: Request, res: Response): Promise<Response>;
    /**
     * Completa una asistencia.
     */
    complete(req: Request, res: Response): Promise<Response>;
    updateStatus(req: Request, res: Response): Promise<Response>;
    /**
     * Confirma una transacción asociada a una asistencia.
     */
    confirmTransaction(req: Request, res: Response): Promise<Response>;
    declineTransaction(req: Request, res: Response): Promise<Response>;
    /**
     * Obtiene todas las asistencias.
     */
    getAll(req: Request, res: Response): Promise<Response>;
    getAvailableAssistances(req: Request, res: Response): Promise<any[] | Response<any, Record<string, any>>>;
}
