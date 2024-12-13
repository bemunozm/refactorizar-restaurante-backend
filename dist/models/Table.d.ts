import { TableInterface } from "../interfaces/TableInterface";
export declare class Table implements TableInterface {
    tableId?: string;
    tableNumber: number;
    status: 'Disponible' | 'Ocupada' | 'Reservada' | 'Solicita Asistencia' | 'Pago con Efectivo' | 'Pago con Tarjeta';
    private tableRepository;
    constructor(data: Partial<TableInterface>);
    save(): Promise<this>;
    update(updateData: Partial<TableInterface>): Promise<this>;
    static getAll(): Promise<Table[]>;
    findById(): Promise<this>;
    delete(): Promise<boolean>;
}
