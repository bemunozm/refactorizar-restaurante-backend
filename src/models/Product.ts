import mongoose, { Model } from "mongoose";
import { ProductDocument, ProductInterface } from "../interfaces/ProductInterface";
import { IngredientInterface } from "../interfaces/IngredientInterface";
import { ProductSchema } from "../schemas/ProductSchema";


export class Product implements ProductInterface {
    public productId?: string;
    public name: string;
    public price: number;
    public about: string;
    public image: string;
    public categoryId: string;
    public ingredients: IngredientInterface[];
    private static mongooseModel: Model<ProductDocument>;

    constructor(data: ProductInterface) {
        this.name = data.name;
        this.price = data.price;
        this.about = data.about;
        this.image = data.image;
    }

    public static getModel(): Model<ProductDocument> {
        if (!this.mongooseModel) {
            this.mongooseModel = mongoose.model<ProductDocument>("Product", ProductSchema);
        }
        return this.mongooseModel;
    }
}