"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const ProductSchema_1 = __importDefault(require("../schemas/ProductSchema"));
const GenericRepository_1 = require("./GenericRepository");
const Ingredient_1 = require("../models/Ingredient");
class ProductRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = ProductSchema_1.default;
    constructor() {
        super(ProductRepository.mongooseModel);
    }
    update(id, data) {
        const ingredients = data.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient instanceof Ingredient_1.Ingredient ? ingredient.ingredient.ingredientId : ingredient.ingredient,
            quantityRequired: ingredient.quantityRequired
        }));
        const updateData = {
            name: data.name,
            price: data.price,
            about: data.about,
            category: data.category.categoryId,
            ingredients: ingredients,
            image: data.image,
        };
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async save(product) {
        const productDocument = new this.model({
            name: product.name,
            price: product.price,
            about: product.about,
            category: product.category,
            ingredients: product.ingredients,
            image: product.image,
        });
        return await productDocument.save();
    }
    async findByCategoryId(categoryId) {
        return await this.model.find({ category: categoryId });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map