import { IngredientRepository } from "../repositories/IngredientRepository";
import { IngredientDocument, IngredientInterface } from "../interfaces/IngredientInterface";

export class Ingredient implements IngredientInterface {
    public ingredientId?: string;
    public name: string;
    public stockQuantity: number;
    public unit: string;
    public image?: string;
    private ingredientRepository: IngredientRepository;

    constructor(data: Partial<IngredientInterface>) {
        this.ingredientId = data.ingredientId;
        this.name = data.name || '';
        this.stockQuantity = data.stockQuantity || 0;
        this.unit = data.unit || '';
        this.image = data.image;
        this.ingredientRepository = new IngredientRepository();
    }

    private populateIngredient(ingredientData: IngredientDocument): void {
        this.ingredientId = ingredientData.id;
        this.name = ingredientData.name;
        this.stockQuantity = ingredientData.stockQuantity;
        this.unit = ingredientData.unit;
        this.image = ingredientData.image;
    }

    public async save() {
        const savedIngredient = await this.ingredientRepository.save(this);
        this.populateIngredient(savedIngredient);
        return this;
    }

    public async update(updateData: Partial<IngredientInterface>) {
        const updatedIngredient = await this.ingredientRepository.update(this.ingredientId, updateData);
        if (updatedIngredient) {
            this.populateIngredient(updatedIngredient);
            return this;
        }
        return null;
    }

    static async getAll() {
        const ingredientRepository = new IngredientRepository();
        const ingredients = await ingredientRepository.findAll();
        if (ingredients) {
            return ingredients.map(ingredientData => {
                const ingredient = new Ingredient({});
                ingredient.populateIngredient(ingredientData);
                return ingredient;
            });
        }
        else{
            return []
        }
    }

    public async findById() {
        const ingredientData = await this.ingredientRepository.findById(this.ingredientId);
        if (ingredientData) {
            this.populateIngredient(ingredientData);
            return this;
        }
        return null;
    }

    public async delete() {
        return await this.ingredientRepository.delete(this.ingredientId);
    }
}
