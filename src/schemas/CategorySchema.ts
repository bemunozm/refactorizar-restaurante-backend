import mongoose, { Schema } from "mongoose";
import { CategoryDocument } from "../interfaces/CategoryInterface";

export const CategorySchema = new Schema<CategoryDocument>({
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: false, trim: true },
});

const CategoryModel = mongoose.models.Cateogry || mongoose.model<CategoryDocument>("Category", CategorySchema);
export default CategoryModel;