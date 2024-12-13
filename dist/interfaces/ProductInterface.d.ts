import { Document } from "mongoose";
import { Category } from "../models/Category";
export interface ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image?: string;
    category: Category;
    isAvailable: boolean;
}
export interface ProductDocument extends ProductInterface, Document {
}
