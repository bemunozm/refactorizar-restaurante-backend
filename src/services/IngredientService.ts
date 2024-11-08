import { Ingredient } from "../models/Ingredient";
import { IngredientInterface } from "../interfaces/IngredientInterface";

export class IngredientService {
    public async createIngredient(data: Partial<IngredientInterface>, file: Express.Multer.File) {
        const ingredientData: IngredientInterface = {
            name: data.name,
            stockQuantity: data.stockQuantity,
            unit: data.unit,
            image: file ? `/uploads/images/${file.fieldname}` : '/uploads/images/default.jpg',
        };

        const ingredient = new Ingredient(ingredientData);
        await ingredient.save();
    }

    public async updateIngredient(id: string, updateData: Partial<IngredientInterface>, file?: Express.Multer.File) {
        console.log
        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }

        const ingredient = new Ingredient({ ingredientId: id });
        return await ingredient.update(updateData);
    }

    public async getIngredients() {
        return await Ingredient.getAll();
    }

    public async getIngredient(id: string) {
        const ingredient = new Ingredient({ ingredientId: id });
        return await ingredient.findById();
    }

    public async deleteIngredient(id: string) {
        const ingredient = new Ingredient({ ingredientId: id });
        return await ingredient.delete();
    }
}
