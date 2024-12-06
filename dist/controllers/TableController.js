"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableController = void 0;
const TableService_1 = require("../services/TableService");
class TableController {
    tableService;
    constructor() {
        this.tableService = new TableService_1.TableService();
    }
    async createTable(req, res) {
        try {
            await this.tableService.createTable(req.body);
            return res.status(201).send('Mesa creada exitosamente');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear la mesa');
        }
    }
    async updateTable(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const result = await this.tableService.updateTable(id, updateData);
            return result
                ? res.status(200).send('Mesa actualizada exitosamente')
                : res.status(404).send('Mesa no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar la mesa');
        }
    }
    async getTables(req, res) {
        try {
            const tables = await this.tableService.getTables();
            return res.status(200).send(tables);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener las mesas');
        }
    }
    async getTable(req, res) {
        try {
            const { id } = req.params;
            const table = await this.tableService.getTable(id);
            return table
                ? res.status(200).send(table)
                : res.status(404).send('Mesa no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener la mesa');
        }
    }
    async deleteTable(req, res) {
        try {
            const { id } = req.params;
            const result = await this.tableService.deleteTable(id);
            return result
                ? res.status(200).send('Mesa eliminada exitosamente')
                : res.status(404).send('Mesa no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar la mesa');
        }
    }
}
exports.TableController = TableController;
//# sourceMappingURL=TableController.js.map