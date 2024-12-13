"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const CategorySchema_1 = __importDefault(require("../schemas/CategorySchema"));
const GenericRepository_1 = require("./GenericRepository");
class CategoryRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = CategorySchema_1.default;
    constructor() {
        super(CategoryRepository.mongooseModel);
    }
    async save(category) {
        const categoryDocument = new this.model({
            name: category.name,
            image: category.image,
        });
        return await categoryDocument.save();
    }
}
exports.CategoryRepository = CategoryRepository;
//# sourceMappingURL=CategoryRepository.js.map