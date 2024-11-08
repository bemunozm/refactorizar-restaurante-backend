import IngredientModel from "../schemas/IngredientSchema";
import { IngredientDocument, IngredientInterface } from "../interfaces/IngredientInterface";
import { GenericRepository } from "./GenericRepository";

export class IngredientRepository extends GenericRepository<IngredientDocument> {
    private static mongooseModel = IngredientModel;

    constructor() {
        super(IngredientRepository.mongooseModel);
    }

    public async save(ingredient: IngredientInterface) {
        const ingredientDocument = new IngredientModel({
            name: ingredient.name,
            stockQuantity: ingredient.stockQuantity,
            unit: ingredient.unit,
            image: ingredient.image
        });
        return await ingredientDocument.save();
    }

}
