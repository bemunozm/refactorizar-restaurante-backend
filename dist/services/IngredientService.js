"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientService = void 0;
const Ingredient_1 = require("../models/Ingredient");
class IngredientService {
    async createIngredient(data, file) {
        const ingredientData = {
            name: data.name,
            stockQuantity: data.stockQuantity,
            unit: data.unit,
            image: file ? `/uploads/images/${file.filename}` : '/uploads/images/default.jpg',
        };
        const ingredient = new Ingredient_1.Ingredient(ingredientData);
        return await ingredient.save();
    }
    async updateIngredient(id, updateData, file) {
        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }
        const ingredient = new Ingredient_1.Ingredient({ ingredientId: id });
        return await ingredient.update(updateData);
    }
    async getIngredients() {
        return await Ingredient_1.Ingredient.getAll();
    }
    async getIngredient(id) {
        const ingredient = new Ingredient_1.Ingredient({ ingredientId: id });
        return await ingredient.findById();
    }
    async deleteIngredient(id) {
        const ingredient = new Ingredient_1.Ingredient({ ingredientId: id });
        return await ingredient.delete();
    }
}
exports.IngredientService = IngredientService;
//# sourceMappingURL=IngredientService.js.map