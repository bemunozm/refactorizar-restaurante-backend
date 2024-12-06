"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientController = void 0;
const IngredientService_1 = require("../services/IngredientService");
class IngredientController {
    ingredientService;
    constructor() {
        this.ingredientService = new IngredientService_1.IngredientService();
    }
    async createIngredient(req, res) {
        try {
            const result = await this.ingredientService.createIngredient(req.body, req.file);
            return res.status(201).send('Ingrediente creado exitosamente');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear el ingrediente');
        }
    }
    async updateIngredient(req, res) {
        try {
            const { id } = req.params;
            const updatedIngredient = await this.ingredientService.updateIngredient(id, req.body, req.file);
            return updatedIngredient
                ? res.status(200).send('Ingrediente actualizado exitosamente')
                : res.status(404).send('Ingrediente no encontrado');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar el ingrediente');
        }
    }
    async getIngredients(req, res) {
        try {
            const ingredients = await this.ingredientService.getIngredients();
            return res.status(200).send(ingredients);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener los ingredientes');
        }
    }
    async getIngredient(req, res) {
        try {
            const { id } = req.params;
            const ingredient = await this.ingredientService.getIngredient(id);
            return ingredient
                ? res.status(200).send(ingredient)
                : res.status(404).send('Ingrediente no encontrado');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener el ingrediente');
        }
    }
    async deleteIngredient(req, res) {
        try {
            const { id } = req.params;
            const result = await this.ingredientService.deleteIngredient(id);
            return result
                ? res.status(200).send('Ingrediente eliminado exitosamente')
                : res.status(404).send('Ingrediente no encontrado');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar el ingrediente');
        }
    }
}
exports.IngredientController = IngredientController;
//# sourceMappingURL=IngredientController.js.map