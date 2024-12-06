"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
// ProductService.ts
const Product_1 = require("../models/Product");
const Category_1 = require("../models/Category");
const Ingredient_1 = require("../models/Ingredient");
class ProductService {
    async createProduct(data, file) {
        const categoryInstance = new Category_1.Category({ categoryId: data.categoryId });
        await categoryInstance.findById();
        if (!categoryInstance)
            throw new Error('Categoría no encontrada');
        const ingredients = await Promise.all(data.ingredients.map(async (ingredientData) => {
            const ingredientInstance = new Ingredient_1.Ingredient({ ingredientId: ingredientData.ingredient });
            await ingredientInstance.findById();
            if (!ingredientInstance)
                throw new Error(`Ingrediente no encontrado: ${ingredientData.ingredient}`);
            return {
                ingredient: ingredientInstance,
                quantityRequired: ingredientData.quantityRequired,
            };
        }));
        const productData = {
            name: data.name,
            price: parseInt(data.price),
            about: data.about,
            category: categoryInstance,
            ingredients: ingredients,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };
        const product = new Product_1.Product(productData);
        return await product.save();
    }
    async getProducts() {
        return await Product_1.Product.getAll();
    }
    async getProduct(id) {
        const product = new Product_1.Product({ productId: id });
        return await product.findById();
    }
    async updateProduct(id, updateData, file) {
        if (updateData.price)
            updateData.price = +updateData.price;
        if (file)
            updateData.image = `/uploads/images/${file.filename}`;
        console.log(updateData);
        const categoryInstance = updateData.category ? new Category_1.Category({ categoryId: updateData.category.toString() }) : undefined;
        if (categoryInstance)
            await categoryInstance.findById();
        const ingredients = await Promise.all((updateData.ingredients || []).map(async (ingredientData) => {
            const ingredientInstance = ingredientData.ingredient instanceof Ingredient_1.Ingredient
                ? ingredientData.ingredient
                : new Ingredient_1.Ingredient({ ingredientId: ingredientData.ingredient });
            await ingredientInstance.findById();
            return { ingredient: ingredientInstance, quantityRequired: ingredientData.quantityRequired };
        }));
        const product = new Product_1.Product({ productId: id });
        return await product.update({ ...updateData, category: categoryInstance, ingredients });
    }
    async deleteProduct(id) {
        const product = new Product_1.Product({ productId: id });
        return await product.delete();
    }
    async getProductsByCategory(categoryName) {
        const category = new Category_1.Category({ name: categoryName });
        const existingCategory = await category.findByName();
        if (!existingCategory)
            throw new Error("Categoría no encontrada");
        return await Product_1.Product.findByCategoryId(existingCategory.categoryId);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map