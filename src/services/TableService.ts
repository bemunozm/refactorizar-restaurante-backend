
import { Order } from "../models/Order";
import { Session } from "../models/Session";
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

        //Verificar si la mesa tiene sessiones activas
        const sessions = await Session.getAllSessions();

        const activeSession = sessions.find(session => session.table.tableId === id && session.status === 'Activa');

        if (activeSession) {
            throw new Error('No se puede eliminar la mesa porque tiene una sesión activa');
        }

        //Verificar si la mesa tiene sessiones o pedidos asociados

        const orders = await Order.getAll();

        const associatedOrders = orders.find(order => order.table.tableId === id);
        const associatedSessions = sessions.find(session => session.table.tableId === id);

        if (associatedOrders || associatedSessions) {
            throw new Error('No se puede eliminar la mesa porque tiene pedidos asociados');
        }
        
        return await table.delete();
    }
}
