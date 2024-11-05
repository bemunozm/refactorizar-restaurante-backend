import { Document } from "mongoose";

export interface IngredientInterface {
    ingredientId?: string;
    name: string;
    image?: string;
    stockQuantity: number;
    unit: string;
}

export interface IngredientDocument extends IngredientInterface, Document {}