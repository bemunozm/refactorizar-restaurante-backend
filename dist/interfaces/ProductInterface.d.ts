import { Document } from "mongoose";
import { Category } from "../models/Category";
import { Ingredient } from "../models/Ingredient";
export interface ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image?: string;
    category: Category;
    ingredients: ProductIngredientInterface[];
}
export interface ProductIngredientInterface {
    ingredient: Ingredient;
    quantityRequired: number;
}
export interface ProductDocument extends ProductInterface, Document {
}
