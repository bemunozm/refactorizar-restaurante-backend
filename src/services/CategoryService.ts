import { Category } from "../models/Category";
import { CategoryInterface } from "../interfaces/CategoryInterface";
import { Product } from "../models/Product";

export class CategoryService {
    public async createCategory(data: CategoryInterface, file?: Express.Multer.File) {
        const categoryData: CategoryInterface = {
            name: data.name,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };

        const category = new Category(categoryData);
        return await category.save();
    }

    public async getCategories() {
        return await Category.getAll();
    }

    public async getCategory(id: string) {
        const category = new Category({ categoryId: id });
        return await category.findById();
    }

    public async updateCategory(id: string, updateData: CategoryInterface, file?: Express.Multer.File) {
        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }

        const category = new Category({ categoryId: id });
        return await category.update(updateData);
    }

    public async deleteCategory(id: string) {
        const category = new Category({ categoryId: id });

        await category.findById();
        if (!category.categoryId) {
            throw new Error('Categoría no encontrada');
        }

        const products = await Product.findByCategoryId(category.categoryId);
        if (products.length > 0) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }

        return await category.delete();
    }
}
