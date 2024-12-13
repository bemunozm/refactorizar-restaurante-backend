import { AssistanceInterface } from '../interfaces/AssistanceInterface';
import { Session } from './Session';
import { User } from './User';
import { Product } from './Product';
export declare class Assistance implements AssistanceInterface {
    assistanceId?: string;
    session: Session;
    user: User | null;
    type: 'Pago con Tarjeta' | 'Pago con Efectivo' | 'Solicita Asistencia' | 'Pedido Listo';
    status: 'Pendiente' | 'En Progreso' | 'Completado';
    transactionToken?: string;
    itemId?: string;
    itemDetails?: {
        product: Product;
        quantity: number;
        comment: string;
    };
    createdAt?: Date;
    updatedAt?: Date;
    private assistanceRepository;
    constructor(assistance: Partial<AssistanceInterface>);
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData;
    /**
     * Método populate para cargar los datos completos de los objetos relacionados.
     */
    populate(): Promise<void>;
    /**
     * Método para guardar la asistencia en la base de datos.
     */
    save(): Promise<Assistance>;
    /**
     * Método estático para obtener todas las asistencias.
     */
    static getAll(): Promise<Assistance[]>;
    static getAllAvailable(): Promise<Assistance[]>;
    static isSessionAssignedToOtherWaiter(sessionId: string, userId: string): Promise<boolean>;
    /**
     * Método para buscar una asistencia por ID.
     */
    findById(): Promise<Assistance | null>;
    findByItemId(): Promise<Assistance | null>;
    findBySessionId(): Promise<Assistance[]>;
    /**
     * Método para asignar un usuario a una asistencia.
     */
    assignUser(userId: string): Promise<Assistance | null>;
    /**
     * Método para confirmar una transacción asociada a la asistencia.
     */
    confirmTransaction(transactionToken: string): Promise<Assistance | null>;
    updateStatus(status: 'Pendiente' | 'En Progreso' | 'Completado'): Promise<Assistance | null>;
    /**
     * Método para completar una asistencia.
     */
    complete(): Promise<Assistance | null>;
    static getAssistancesBetweenDates(startDate: Date, endDate: Date): Promise<Assistance[]>;
    /**
     * Método privado para popular los datos de un documento de asistencia.
     */
    private populateAssistance;
}
