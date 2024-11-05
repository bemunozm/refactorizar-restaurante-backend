import mongoose, { Model } from "mongoose";
import { CategoryDocument, CategoryInterface } from "../interfaces/CategoryInterface";
import { CategorySchema } from "../schemas/CategorySchema";


export class Category implements CategoryInterface {
    public categoryId?: string;
    public name: string;
    public image: string;

    private static mongooseModel: Model<CategoryDocument>;

    constructor(data: CategoryInterface) {
        this.name = data.name;
        this.image = data.image;
    }

    public static getModel(): Model<CategoryDocument> {
        if (!this.mongooseModel) {
            this.mongooseModel = mongoose.model<CategoryDocument>("Category", CategorySchema);
        }
        return this.mongooseModel;
    }
}