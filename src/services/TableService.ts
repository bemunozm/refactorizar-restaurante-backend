import { Table } from "../models/Table";

export class TableService {
    public async createTable(data: any) {
        const table = new Table({ tableId: '', tableNumber: data.tableNumber, status: "Disponible" });
        return await table.save();
    }

    public async updateTable(id: string, updateData: any) {
        const table = new Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.update(updateData);
    }

    public async getTables() {
        return await Table.getAll();
    }

    public async getTable(id: string) {
        const table = new Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.findById();
    }

    public async deleteTable(id: string) {
        const table = new Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.delete();
    }
}
