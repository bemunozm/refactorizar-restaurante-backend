import { Document, Types } from "mongoose";
import { IngredientInterface } from "./IngredientInterface";
import { Category } from "../models/Category";
import { CategoryInterface } from "./CategoryInterface";
import { Product } from "../models/Product";
import { Ingredient } from "../models/Ingredient";

export interface ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image?: string;
    category: Category | string;
    ingredients: ProductIngredientInterface[];
}

export interface ProductIngredientInterface {
    ingredient: Ingredient | string;
    quantityRequired: number;
}

export interface ProductDocument extends ProductInterface, Document {}
