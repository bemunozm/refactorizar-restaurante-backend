// ProductService.ts
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { ProductInterface } from "../interfaces/ProductInterface";
import { Ingredient } from "../models/Ingredient";

export class ProductService {
    public async createProduct(data: any, file?: Express.Multer.File) {
        const categoryInstance = new Category({ categoryId: data.categoryId });
        await categoryInstance.findById();
        if (!categoryInstance) throw new Error('Categoría no encontrada');

        const ingredients = await Promise.all(data.ingredients.map(async (ingredientData: any) => {
            const ingredientInstance = new Ingredient({ ingredientId: ingredientData.ingredient });
            await ingredientInstance.findById();
            if (!ingredientInstance) throw new Error(`Ingrediente no encontrado: ${ingredientData.ingredient}`);
            return {
                ingredient: ingredientInstance,
                quantityRequired: ingredientData.quantityRequired,
            };
        }));

        const productData: ProductInterface = {
            name: data.name,
            price: parseInt(data.price),
            about: data.about,
            category: categoryInstance,
            ingredients: ingredients,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };

        const product = new Product(productData);
        return await product.save();
    }

    public async getProducts() {
        return await Product.getAll();
    }

    public async getProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.findById();
    }

    public async updateProduct(id: string, updateData: ProductInterface, file?: Express.Multer.File) {
        if (updateData.price) updateData.price = +updateData.price;
        if (file) updateData.image = `/uploads/images/${file.filename}`;
        console.log(updateData);
        const categoryInstance = updateData.category ? new Category({ categoryId: updateData.category.toString()}) : undefined;
        if (categoryInstance) await categoryInstance.findById();

        const ingredients = await Promise.all((updateData.ingredients || []).map(async (ingredientData) => {
            const ingredientInstance = ingredientData.ingredient instanceof Ingredient 
                ? ingredientData.ingredient 
                : new Ingredient({ ingredientId: ingredientData.ingredient });
            await ingredientInstance.findById();
            return { ingredient: ingredientInstance, quantityRequired: ingredientData.quantityRequired };
        }));

        const product = new Product({ productId: id });
        return await product.update({ ...updateData, category: categoryInstance, ingredients });
    }

    public async deleteProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.delete();
    }

    public async getProductsByCategory(categoryName?: string) {
        const category = new Category({ name: categoryName });
        const existingCategory = await category.findByName();
        if (!existingCategory) throw new Error("Categoría no encontrada");

        return await Product.findByCategoryId(existingCategory.categoryId);
    }
}
