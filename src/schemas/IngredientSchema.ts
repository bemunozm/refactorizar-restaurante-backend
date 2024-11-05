import mongoose, { Schema } from "mongoose";
import { IngredientDocument } from "../interfaces/IngredientInterface";

export const IngredientSchema = new Schema<IngredientDocument>({
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: false, trim: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },  // Ejemplo: "gramos", "litros", "trozos"
}, { timestamps: true });

const IngredientModel = mongoose.models.Ingredient || mongoose.model<IngredientDocument>("Ingredient", IngredientSchema);
export default IngredientModel;