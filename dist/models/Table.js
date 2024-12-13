"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
const TableRepository_1 = require("../repositories/TableRepository");
class Table {
    tableId;
    tableNumber;
    status;
    ;
    tableRepository;
    constructor(data) {
        this.tableId = data.tableId;
        this.tableNumber = data.tableNumber || 0;
        this.status = data.status;
        this.tableRepository = new TableRepository_1.TableRepository();
    }
    async save() {
        const savedTable = await this.tableRepository.save(this);
        this.tableId = savedTable.tableId;
        return this;
    }
    async update(updateData) {
        const updatedTable = await this.tableRepository.update(this.tableId, updateData);
        if (updatedTable) {
            this.tableNumber = updatedTable.tableNumber;
            this.status = updatedTable.status;
            return this;
        }
        else {
            return null;
        }
    }
    static async getAll() {
        const tableRepository = new TableRepository_1.TableRepository();
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
    async findById() {
        const table = await this.tableRepository.findById(this.tableId);
        if (table) {
            this.tableId = table.id;
            this.tableNumber = table.tableNumber;
            this.status = table.status;
            return this;
        }
        else {
            return null;
        }
    }
    async delete() {
        const deletedTable = await this.tableRepository.delete(this.tableId);
        if (deletedTable) {
            return true;
        }
        else {
            return null;
        }
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map