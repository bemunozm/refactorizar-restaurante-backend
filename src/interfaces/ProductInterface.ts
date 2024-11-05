import { Document, Types } from "mongoose";
import { IngredientInterface } from "./IngredientInterface";

export interface ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image?: string;
    categoryId: Types.ObjectId | string;
    ingredients: IngredientInterface[];
}

export interface ProductDocument extends ProductInterface, Document {}
