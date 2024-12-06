"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
// Product.ts
const ProductRepository_1 = require("../repositories/ProductRepository");
const Category_1 = require("./Category");
const Ingredient_1 = require("./Ingredient");
class Product {
    productId;
    name;
    price;
    about;
    image;
    category;
    ingredients;
    productRepository;
    constructor(data) {
        this.productId = data.productId?.toString();
        this.name = data.name || '';
        this.price = data.price || 0;
        this.about = data.about || '';
        this.image = data.image || '';
        this.sanitizeData(data);
        this.productRepository = new ProductRepository_1.ProductRepository();
    }
    sanitizeData(data) {
        this.category = data.category instanceof Category_1.Category
            ? data.category
            : new Category_1.Category({ categoryId: data.category });
        this.ingredients = (data.ingredients || []).map(ingredient => ingredient.ingredient instanceof Ingredient_1.Ingredient
            ? ingredient
            : { ingredient: new Ingredient_1.Ingredient({ ingredientId: ingredient.ingredient }), quantityRequired: ingredient.quantityRequired });
    }
    async populate() {
        if (this.category && !this.category.name)
            this.category = await this.category.findById();
        this.ingredients = await Promise.all(this.ingredients.map(async (ingredientRef) => {
            if (ingredientRef.ingredient instanceof Ingredient_1.Ingredient && !ingredientRef.ingredient.name) {
                ingredientRef.ingredient = await ingredientRef.ingredient.findById();
            }
            return ingredientRef;
        }));
    }
    async save() {
        const ingredients = this.ingredients.map(ingredient => ({
            ingredient: ingredient.ingredient instanceof Ingredient_1.Ingredient ? ingredient.ingredient.ingredientId : ingredient.ingredient,
            quantityRequired: ingredient.quantityRequired
        }));
        const dataToSave = {
            name: this.name,
            price: this.price,
            about: this.about,
            category: this.category.categoryId,
            ingredients: ingredients,
            image: this.image,
        };
        const savedProduct = await this.productRepository.save(dataToSave);
        this.productId = savedProduct.id;
        return this;
    }
    static async getAll() {
        const productRepository = new ProductRepository_1.ProductRepository();
        const productInstances = await productRepository.findAll();
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate();
            return product;
        }));
    }
    async findById() {
        const product = await this.productRepository.findById(this.productId);
        if (product) {
            await this.populateProduct(product);
            await this.populate();
            return this;
        }
        return null;
    }
    async update(updateData) {
        // Actualizamos `updateData.ingredients` con los objetos `Ingredient`
        const updatedInstance = await this.productRepository.update(this.productId, { ...updateData });
        if (updatedInstance) {
            await this.populateProduct(updatedInstance);
            await this.populate(); // Cargar datos completos después de la actualización
            return this;
        }
        return null;
    }
    async delete() {
        return await this.productRepository.delete(this.productId);
    }
    static async findByCategoryId(categoryId) {
        const productRepository = new ProductRepository_1.ProductRepository();
        const productInstances = await productRepository.findByCategoryId(categoryId);
        return Promise.all(productInstances.map(async (productInstance) => {
            const product = new Product({});
            await product.populateProduct(productInstance);
            await product.populate();
            return product;
        }));
    }
    async populateProduct(productDoc) {
        this.productId = productDoc.id;
        this.name = productDoc.name;
        this.price = productDoc.price;
        this.about = productDoc.about;
        this.image = productDoc.image;
        this.category = new Category_1.Category({ categoryId: productDoc.category });
        this.ingredients = productDoc.ingredients.map((ingredientDoc) => ({
            ingredient: ingredientDoc.ingredient instanceof Ingredient_1.Ingredient
                ? ingredientDoc.ingredient
                : new Ingredient_1.Ingredient({ ingredientId: ingredientDoc.ingredient }),
            quantityRequired: ingredientDoc.quantityRequired,
        }));
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map