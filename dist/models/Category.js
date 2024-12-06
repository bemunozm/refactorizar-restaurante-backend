"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const CategoryRepository_1 = require("../repositories/CategoryRepository");
class Category {
    categoryId;
    name;
    image;
    categoryRepository;
    constructor(data) {
        this.categoryId = data.categoryId;
        this.name = data.name || '';
        this.image = data.image;
        this.categoryRepository = new CategoryRepository_1.CategoryRepository();
    }
    // Transforma el objeto para el repositorio, manteniendo solo valores de propiedades
    toDatabaseObject() {
        return {
            categoryId: this.categoryId,
            name: this.name,
            image: this.image,
        };
    }
    async save() {
        const savedCategory = await this.categoryRepository.save(this.toDatabaseObject());
        this.categoryId = savedCategory.id;
        return this;
    }
    async findByName() {
        const category = await this.categoryRepository.findOne({ name: this.name });
        if (category) {
            this.categoryId = category.id;
            this.name = category.name;
            this.image = category.image;
            return this;
        }
        return null;
    }
    static async getAll() {
        const categoryRepository = new CategoryRepository_1.CategoryRepository();
        const categoryInstances = await categoryRepository.findAll();
        return categoryInstances.map((categoryInstance) => new Category({
            categoryId: categoryInstance.id,
            name: categoryInstance.name,
            image: categoryInstance.image,
        }));
    }
    async findById() {
        const category = await this.categoryRepository.findById(this.categoryId);
        if (category) {
            this.categoryId = category.id;
            this.name = category.name;
            this.image = category.image;
            return this;
        }
        return null;
    }
    async update(updateData) {
        const updatedInstance = await this.categoryRepository.update(this.categoryId, updateData);
        if (updatedInstance) {
            this.categoryId = updatedInstance.id;
            this.name = updatedInstance.name;
            this.image = updatedInstance.image;
            return this;
        }
        return null;
    }
    async delete() {
        return await this.categoryRepository.delete(this.categoryId);
    }
}
exports.Category = Category;
//# sourceMappingURL=Category.js.map