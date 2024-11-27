import ProductModel from "../schemas/ProductSchema";
import { ProductDocument, ProductInterface } from "../interfaces/ProductInterface";
import { GenericRepository } from "./GenericRepository";
import { Ingredient } from "../models/Ingredient";

export class ProductRepository extends GenericRepository<ProductDocument> {

    private static mongooseModel = ProductModel;

    constructor() {
        super(ProductRepository.mongooseModel);
    }

    public update(id: string, data: Partial<ProductDocument>): Promise<ProductDocument> {

        const ingredients = data.ingredients.map(ingredient => ({

            ingredient: ingredient.ingredient instanceof Ingredient ? ingredient.ingredient.ingredientId : ingredient.ingredient,
            quantityRequired: ingredient.quantityRequired
        }));
        

        const updateData = {
            name: data.name,
            price: data.price,
            about: data.about,
            category: data.category.categoryId,
            ingredients: ingredients,
            image: data.image,
        }
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    public async save(product) {
        
    
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

    public async findByCategoryId(categoryId: string) {
        return await this.model.find({ category: categoryId });
    }
}
