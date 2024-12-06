"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableService = void 0;
const Table_1 = require("../models/Table");
class TableService {
    async createTable(data) {
        const table = new Table_1.Table({ tableId: '', tableNumber: data.tableNumber, status: "Disponible" });
        return await table.save();
    }
    async updateTable(id, updateData) {
        const table = new Table_1.Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.update(updateData);
    }
    async getTables() {
        return await Table_1.Table.getAll();
    }
    async getTable(id) {
        const table = new Table_1.Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.findById();
    }
    async deleteTable(id) {
        const table = new Table_1.Table({ tableId: id, tableNumber: 0, status: "Disponible" });
        return await table.delete();
    }
}
exports.TableService = TableService;
//# sourceMappingURL=TableService.js.map