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
        await category.save();
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
        //Instanciar objeto Category con el id de la categoría
        const category = new Category({ categoryId: id });

        //Buscar la categoría por ID
        await category.findById();

        //Si la categoría no existe, retornar null
        if (!category.categoryId) {
            return new Error('Categoría no encontrada');
        }

        //Verificar si la categoría tiene productos asociados
        const products = await Product.findByCategoryId(category.categoryId);

        //Si la categoría tiene productos asociados, retornar null
        if (products.length > 0) {
            return new Error('No se puede eliminar la categoría porque tiene productos asociados');
        }
        
        //Eliminar la categoría
        return await category.delete();
    }
}
