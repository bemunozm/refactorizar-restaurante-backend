import { GenericRepository } from './GenericRepository';
import { AssistanceDocument } from '../interfaces/AssistanceInterface';
export declare class AssistanceRepository extends GenericRepository<AssistanceDocument> {
    private static mongooseModel;
    constructor();
    /**
     * Guarda una nueva instancia de Assistance en la base de datos.
     * @param assistance Datos de la asistencia.
     * @returns Documento de Assistance.
     */
    save(assistance: any): Promise<AssistanceDocument>;
    update(id: string, data: any): Promise<AssistanceDocument>;
    /**
     * Encuentra asistencias relacionadas con una sesión específica.
     * @param sessionId ID de la sesión.
     * @returns Lista de asistencias.
     */
    findBySessionId(sessionId: string): Promise<AssistanceDocument[]>;
    findByItemId(itemId: string): Promise<AssistanceDocument>;
    /**
     * Encuentra asistencias asignadas a un usuario específico.
     * @param userId ID del usuario.
     * @returns Lista de asistencias.
     */
    findByUserId(userId: string): Promise<AssistanceDocument[]>;
    /**
     * Encuentra asistencias con un estado específico.
     * @param status Estado de la asistencia ('Pendiente', 'En Progreso', 'Completado').
     * @returns Lista de asistencias.
     */
    findByStatus(status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<AssistanceDocument[]>;
    /**
     * Actualiza el estado de una asistencia.
     * @param assistanceId ID de la asistencia.
     * @param status Nuevo estado de la asistencia.
     * @returns Documento de Assistance actualizado.
     */
    updateStatus(assistanceId: string, status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<AssistanceDocument | null>;
    /**
     * Encuentra todas las asistencias pendientes.
     * @returns Lista de asistencias pendientes.
     */
    findPendingAssistances(): Promise<AssistanceDocument[]>;
    /**
     * Encuentra todas las asistencias completadas.
     * @returns Lista de asistencias completadas.
     */
    findCompletedAssistances(): Promise<AssistanceDocument[]>;
    getAllAssistance(): Promise<AssistanceDocument[]>;
}
