import { Document, Types } from "mongoose";
import { IngredientInterface } from "./IngredientInterface";
import { Category } from "../models/Category";
import { CategoryInterface } from "./CategoryInterface";
import { Product } from "../models/Product";

export interface ProductInterface {
    productId?: Product | string;
    name: string;
    price: number;
    about: string;
    image?: string;
    categoryId: Category ;
    ingredients: IngredientInterface[];
}

export interface ProductDocument extends ProductInterface, Document {}
