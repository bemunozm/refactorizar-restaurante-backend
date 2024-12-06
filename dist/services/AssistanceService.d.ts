import { Assistance } from '../models/Assistance';
export declare class AssistanceService {
    createAssistance(assistanceData: {
        sessionId: string;
        type: 'Pago con Tarjeta' | 'Pago con Efectivo' | 'Solicita Asistencia' | 'Pedido Listo';
        transactionToken?: string;
    }): Promise<Assistance>;
    assignAssistance(assistanceId: string, userId: string): Promise<Assistance>;
    completeAssistance(assistanceId: string): Promise<Assistance>;
    confirmTransaction(assistanceId: string, transactionToken: string): Promise<Assistance>;
    declineTransaction(assistanceId: string, transactionToken: string): Promise<Assistance>;
    getAllAssistances(): Promise<Assistance[]>;
    getAvailableAssistances(userId: string): Promise<Assistance[]>;
    updateStatus(assistanceId: string, status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<Assistance>;
}
