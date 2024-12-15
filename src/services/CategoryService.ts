import { Category } from "../models/Category";
import { CategoryInterface } from "../interfaces/CategoryInterface";
import { Product } from "../models/Product";
import fs from 'fs';
import path from 'path';

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
        const category = new Category({ categoryId: id });
        const existingCategory = await category.findById();

        if (existingCategory && existingCategory.image) {
            const imagePath = path.join(__dirname, '..', '..', existingCategory.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen anterior:', err);
                }
            });
        }

        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }

        return await category.update(updateData);
    }

    public async deleteCategory(id: string) {
        const category = new Category({ categoryId: id });
        const existingCategory = await category.findById();

        if (!existingCategory) {
            throw new Error('Categoría no encontrada');
        }

        
        const products = await Product.findByCategoryId(category.categoryId);
        if (products.length > 0) {
            throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }
        
        if (existingCategory.image) {
            const imagePath = path.join(__dirname, '..', '..', existingCategory.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                }
            });
        }
        return await category.delete();
    }
}
