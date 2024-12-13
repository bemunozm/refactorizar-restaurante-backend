import { TransactionInterface } from "../interfaces/TransactionInterface";
import { Session } from "./Session";
import { Order } from "./Order";
export declare class Transaction implements TransactionInterface {
    transactionId?: string;
    token: string;
    orders?: Order[];
    session?: Session;
    onlineOrderId?: string;
    amount: number;
    status: 'CREADA' | 'CONFIRMADA' | 'ANULADA';
    private transactionRepository;
    constructor(data: Partial<TransactionInterface>);
    /**
     * Método para sanear y crear instancias mínimas de los datos relacionados.
     */
    private sanitizeData;
    /**
     * Método para cargar completamente `session` y `orders`.
     */
    populate(): Promise<void>;
    /**
     * Guarda la transacción en la base de datos.
     */
    save(): Promise<Transaction>;
    /**
     * Encuentra la transacción por token y carga sus datos completos.
     */
    findByToken(): Promise<Transaction | null>;
    /**
     * Encuentra la transacción por ID y carga sus datos completos.
     */
    findById(): Promise<Transaction | null>;
    /**
     * Actualiza el token de la transacción.
     */
    updateToken(token: string): Promise<void>;
    /**
     * Actualiza el estado de la transacción.
     */
    updateStatus(status: 'CREADA' | 'CONFIRMADA' | 'ANULADA'): Promise<void>;
    static findByOnlineOrderId(onlineOrderId: string): Promise<Transaction | null>;
    static getTransactionsBetweenDates(startDate: Date, endDate: Date): Promise<Transaction[]>;
}
