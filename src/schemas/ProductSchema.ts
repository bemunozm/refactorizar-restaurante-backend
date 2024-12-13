import mongoose, { Schema, Types } from "mongoose";
import { ProductDocument } from "../interfaces/ProductInterface";

export const ProductSchema = new Schema<ProductDocument>({
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, trim: true },
    image: { type: String, required: false, trim: true },
    about: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    isAvailable: { type: Boolean, required: true, default: true },
}, { timestamps: true });

const ProductModel = mongoose.models.Product || mongoose.model<ProductDocument>("Product", ProductSchema);
export default ProductModel;