import { Document } from "mongoose";

export interface CategoryInterface {
    categoryId?: string;
    name: string;
    image?: string;
}

export interface CategoryDocument extends CategoryInterface, Document {}