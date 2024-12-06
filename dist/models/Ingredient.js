"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ingredient = void 0;
const IngredientRepository_1 = require("../repositories/IngredientRepository");
class Ingredient {
    ingredientId;
    name;
    stockQuantity;
    unit;
    image;
    ingredientRepository;
    constructor(data) {
        this.ingredientId = data.ingredientId;
        this.name = data.name || '';
        this.stockQuantity = data.stockQuantity || 0;
        this.unit = data.unit || '';
        this.image = data.image;
        this.ingredientRepository = new IngredientRepository_1.IngredientRepository();
    }
    // Transforma el objeto en un formato adecuado para el repositorio
    toDatabaseObject() {
        return {
            ingredientId: this.ingredientId,
            name: this.name,
            stockQuantity: this.stockQuantity,
            unit: this.unit,
            image: this.image,
        };
    }
    populateIngredient(ingredientData) {
        this.ingredientId = ingredientData.id;
        this.name = ingredientData.name;
        this.stockQuantity = ingredientData.stockQuantity;
        this.unit = ingredientData.unit;
        this.image = ingredientData.image;
    }
    async save() {
        const savedIngredient = await this.ingredientRepository.save(this.toDatabaseObject());
        this.populateIngredient(savedIngredient);
        return this;
    }
    async update(updateData) {
        const updatedIngredient = await this.ingredientRepository.update(this.ingredientId, { ...this.toDatabaseObject(), ...updateData });
        if (updatedIngredient) {
            this.populateIngredient(updatedIngredient);
            return this;
        }
        return null;
    }
    static async getAll() {
        const ingredientRepository = new IngredientRepository_1.IngredientRepository();
        const ingredients = await ingredientRepository.findAll();
        return ingredients.map(ingredientData => {
            const ingredient = new Ingredient({});
            ingredient.populateIngredient(ingredientData);
            return ingredient;
        });
    }
    async findById() {
        const ingredientData = await this.ingredientRepository.findById(this.ingredientId);
        if (ingredientData) {
            this.populateIngredient(ingredientData);
            return this;
        }
        return null;
    }
    async delete() {
        return await this.ingredientRepository.delete(this.ingredientId);
    }
}
exports.Ingredient = Ingredient;
//# sourceMappingURL=Ingredient.js.map