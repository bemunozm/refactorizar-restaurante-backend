"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const Category_1 = require("../models/Category");
const Product_1 = require("../models/Product");
class CategoryService {
    async createCategory(data, file) {
        const categoryData = {
            name: data.name,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };
        const category = new Category_1.Category(categoryData);
        return await category.save();
    }
    async getCategories() {
        return await Category_1.Category.getAll();
    }
    async getCategory(id) {
        const category = new Category_1.Category({ categoryId: id });
        return await category.findById();
    }
    async updateCategory(id, updateData, file) {
        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }
        const category = new Category_1.Category({ categoryId: id });
        return await category.update(updateData);
    }
    async deleteCategory(id) {
        const category = new Category_1.Category({ categoryId: id });
        await category.findById();
        if (!category.categoryId) {
            throw new Error('Categoría no encontrada');
        }
        const products = await Product_1.Product.findByCategoryId(category.categoryId);
        if (products.length > 0) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }
        return await category.delete();
    }
}
exports.CategoryService = CategoryService;
//# sourceMappingURL=CategoryService.js.map