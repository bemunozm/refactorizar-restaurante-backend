import type { Request, Response } from 'express';
import { CategoryService } from '../services/CategoryService';

export class CategoryController {
    private readonly categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    public async createCategory(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.categoryService.createCategory(req.body, req.file);
            return res.status(201).send('Categoría creada exitosamente');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear la categoría');
        }
    }

    public async getCategories(req: Request, res: Response): Promise<Response> {
        try {
            const categories = await this.categoryService.getCategories();
            return res.status(200).send(categories);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener las categorías');
        }
    }

    public async getCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategory(id);
            return category
                ? res.status(200).send(category)
                : res.status(404).send('Categoría no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener la categoría');
        }
    }

    public async updateCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updatedCategory = await this.categoryService.updateCategory(id, req.body, req.file);
            return updatedCategory
                ? res.status(200).send('Categoría actualizada exitosamente')
                : res.status(404).send('Categoría no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar la categoría');
        }
    }

    public async deleteCategory(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.categoryService.deleteCategory(id);
            return result
                ? res.status(200).send('Categoría eliminada exitosamente')
                : res.status(404).send('Categoría no encontrada');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar la categoría');
        }
    }
}
