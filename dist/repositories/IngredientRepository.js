"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientRepository = void 0;
const IngredientSchema_1 = __importDefault(require("../schemas/IngredientSchema"));
const GenericRepository_1 = require("./GenericRepository");
class IngredientRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = IngredientSchema_1.default;
    constructor() {
        super(IngredientRepository.mongooseModel);
    }
    async save(ingredient) {
        const ingredientDocument = new this.model({
            name: ingredient.name,
            stockQuantity: ingredient.stockQuantity,
            unit: ingredient.unit,
            image: ingredient.image,
        });
        return await ingredientDocument.save();
    }
}
exports.IngredientRepository = IngredientRepository;
//# sourceMappingURL=IngredientRepository.js.map