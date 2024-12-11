import { TableRepository } from "../repositories/TableRepository";
import { TableInterface } from "../interfaces/TableInterface";

export class Table implements TableInterface {
    public tableId?: string;
    public tableNumber: number;
    public status: 'Disponible' | 'Ocupada' | 'Reservada' | 'Solicita Asistencia' | 'Pago con Efectivo' | 'Pago con Tarjeta';;
    private tableRepository: TableRepository;

    constructor(data: Partial<TableInterface>) {
        this.tableId = data.tableId;
        this.tableNumber = data.tableNumber || 0;
        this.status = data.status;
        this.tableRepository = new TableRepository();
    }

    public async save() {
        const savedTable = await this.tableRepository.save(this);
        this.tableId = savedTable.tableId;
        return this;
    }

    public async update(updateData: Partial<TableInterface>) {
        const updatedTable = await this.tableRepository.update(this.tableId, updateData);
        if (updatedTable) {
            this.tableNumber = updatedTable.tableNumber;
            this.status = updatedTable.status;
            return this;
        } else {
            return null;
        }
    }

    static async getAll() {
        const tableRepository = new TableRepository();
        const tableInstances = await tableRepository.findAll();

        if (tableInstances) {
            return tableInstances.map((tableInstance) => {
                return new Table({
                    tableId: tableInstance.id,
                    tableNumber: tableInstance.tableNumber,
                    status: tableInstance.status,
                });
            });
        }

        return [];
    }

    public async findById() {
        const table = await this.tableRepository.findById(this.tableId);
        if (table) {
            this.tableId = table.id;
            this.tableNumber = table.tableNumber;
            this.status = table.status;
            return this;
        } else {
            return null;
        }

    }

    public async delete() {
        const deletedTable = await this.tableRepository.delete(this.tableId);
        if (deletedTable) {
            return true;
        } else {
            return null;
        }
    }
}
