"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const ProductSchema_1 = __importDefault(require("../schemas/ProductSchema"));
const GenericRepository_1 = require("./GenericRepository");
class ProductRepository extends GenericRepository_1.GenericRepository {
    static mongooseModel = ProductSchema_1.default;
    constructor() {
        super(ProductRepository.mongooseModel);
    }
    update(id, data) {
        const updateData = {
            name: data.name,
            price: data.price,
            about: data.about,
            category: data.category.categoryId,
            image: data.image,
            isAvailable: data.isAvailable,
        };
        return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }
    async save(product) {
        const productDocument = new this.model({
            name: product.name,
            price: product.price,
            about: product.about,
            category: product.category,
            image: product.image,
            isAvailable: product.isAvailable,
        });
        return await productDocument.save();
    }
    async findByCategoryId(categoryId) {
        return await this.model.find({ category: categoryId });
    }
    async getMostSoldProduct(startDate, endDate) {
        return await this.model.find({ createdAt: { $gte: startDate, $lte: endDate } });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=ProductRepository.js.map