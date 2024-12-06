import { IngredientDocument, IngredientInterface } from "../interfaces/IngredientInterface";
import { GenericRepository } from "./GenericRepository";
export declare class IngredientRepository extends GenericRepository<IngredientDocument> {
    private static mongooseModel;
    constructor();
    save(ingredient: IngredientInterface): Promise<import("mongoose").Document<unknown, {}, IngredientDocument> & IngredientDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
