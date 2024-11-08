import type { Request, Response } from 'express';
import { TableService } from '../services/TableService';

export class TableController {
    private readonly tableService: TableService;

    constructor() {
        this.tableService = new TableService();
    }

    public async createTable(req: Request, res: Response): Promise<Response> {
        try {
            await this.tableService.createTable(req.body);
            return res.status(201).send('Mesa creada exitosamente');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear la mesa');
        }
    }

    public async updateTable(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const result = await this.tableService.updateTable(id, updateData);
            return result
                ? res.status(200).send('Mesa actualizada exitosamente')
                : res.status(404).send('Mesa no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar la mesa');
        }
    }

    public async getTables(req: Request, res: Response): Promise<Response> {
        try {
            const tables = await this.tableService.getTables();
            return res.status(200).send(tables);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener las mesas');
        }
    }

    public async getTable(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const table = await this.tableService.getTable(id);
            return table
                ? res.status(200).send(table)
                : res.status(404).send('Mesa no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener la mesa');
        }
    }

    public async deleteTable(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.tableService.deleteTable(id);
            return result
                ? res.status(200).send('Mesa eliminada exitosamente')
                : res.status(404).send('Mesa no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar la mesa');
        }
    }
}
