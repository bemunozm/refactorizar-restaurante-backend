import mongoose, { Model } from "mongoose";
import { IngredientDocument, IngredientInterface } from "../interfaces/IngredientInterface";
import { IngredientSchema } from "../schemas/IngredientSchema";


export class Ingredient implements IngredientInterface {
    public ingredientId?: string;
    public name: string;
    public image: string;
    public stockQuantity: number;
    public unit: string;

    private static mongooseModel: Model<IngredientDocument>;

    constructor(data: IngredientInterface) {
        this.name = data.name;
        this.image = data.image;
        this.stockQuantity = data.stockQuantity;
        this.unit = data.unit;
    }

    public static getModel(): Model<IngredientDocument> {
        if (!this.mongooseModel) {
            this.mongooseModel = mongoose.model<IngredientDocument>("Ingredient", IngredientSchema);
        }
        return this.mongooseModel;
    }
}