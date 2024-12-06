"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const CategoryService_1 = require("../services/CategoryService");
class CategoryController {
    categoryService;
    constructor() {
        this.categoryService = new CategoryService_1.CategoryService();
    }
    async createCategory(req, res) {
        try {
            const result = await this.categoryService.createCategory(req.body, req.file);
            return res.status(201).send('Categoría creada exitosamente');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al crear la categoría');
        }
    }
    async getCategories(req, res) {
        try {
            const categories = await this.categoryService.getCategories();
            return res.status(200).send(categories);
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener las categorías');
        }
    }
    async getCategory(req, res) {
        try {
            const { id } = req.params;
            const category = await this.categoryService.getCategory(id);
            return category
                ? res.status(200).send(category)
                : res.status(404).send('Categoría no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al obtener la categoría');
        }
    }
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const updatedCategory = await this.categoryService.updateCategory(id, req.body, req.file);
            return updatedCategory
                ? res.status(200).send('Categoría actualizada exitosamente')
                : res.status(404).send('Categoría no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al actualizar la categoría');
        }
    }
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const result = await this.categoryService.deleteCategory(id);
            return result
                ? res.status(200).send('Categoría eliminada exitosamente')
                : res.status(404).send('Categoría no encontrada');
        }
        catch (error) {
            console.error(error);
            return res.status(500).send('Error al eliminar la categoría');
        }
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=CategoryController.js.map