import { Request, Response } from 'express';
import { IngredientService } from '../services/IngredientService';

export class IngredientController {
    private readonly ingredientService: IngredientService;

    constructor() {
        this.ingredientService = new IngredientService();
    }

    public async createIngredient(req: Request, res: Response): Promise<Response> {
        try {
            const result = await this.ingredientService.createIngredient(req.body, req.file);
            return res.status(201).send('Ingrediente creado exitosamente');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear el ingrediente');
        }
    }

    public async updateIngredient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const updatedIngredient = await this.ingredientService.updateIngredient(id, req.body, req.file);
            return updatedIngredient
                ? res.status(200).send('Ingrediente actualizado exitosamente')
                : res.status(404).send('Ingrediente no encontrado');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar el ingrediente');
        }
    }

    public async getIngredients(req: Request, res: Response): Promise<Response> {
        try {
            const ingredients = await this.ingredientService.getIngredients();
            return res.status(200).send(ingredients);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los ingredientes');
        }
    }

    public async getIngredient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const ingredient = await this.ingredientService.getIngredient(id);
            return ingredient
                ? res.status(200).send(ingredient)
                : res.status(404).send('Ingrediente no encontrado');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el ingrediente');
        }
    }

    public async deleteIngredient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = req.params;
            const result = await this.ingredientService.deleteIngredient(id);
            return result
                ? res.status(200).send('Ingrediente eliminado exitosamente')
                : res.status(404).send('Ingrediente no encontrado');
        } catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar el ingrediente');
        }
    }
}
