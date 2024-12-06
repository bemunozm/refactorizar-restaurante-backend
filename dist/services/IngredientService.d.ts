import { Ingredient } from "../models/Ingredient";
import { IngredientInterface } from "../interfaces/IngredientInterface";
export declare class IngredientService {
    createIngredient(data: Partial<IngredientInterface>, file?: Express.Multer.File): Promise<Ingredient>;
    updateIngredient(id: string, updateData: Partial<IngredientInterface>, file?: Express.Multer.File): Promise<Ingredient>;
    getIngredients(): Promise<Ingredient[]>;
    getIngredient(id: string): Promise<Ingredient>;
    deleteIngredient(id: string): Promise<boolean>;
}
