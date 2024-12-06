import { IngredientInterface } from "../interfaces/IngredientInterface";
export declare class Ingredient implements IngredientInterface {
    ingredientId?: string;
    name: string;
    stockQuantity: number;
    unit: string;
    image?: string;
    private ingredientRepository;
    constructor(data: Partial<IngredientInterface>);
    toDatabaseObject(): {
        ingredientId: string;
        name: string;
        stockQuantity: number;
        unit: string;
        image: string;
    };
    private populateIngredient;
    save(): Promise<this>;
    update(updateData: Partial<IngredientInterface>): Promise<this>;
    static getAll(): Promise<Ingredient[]>;
    findById(): Promise<this>;
    delete(): Promise<boolean>;
}
