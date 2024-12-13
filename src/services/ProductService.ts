// ProductService.ts
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { ProductInterface } from "../interfaces/ProductInterface";


export class ProductService {
    public async createProduct(data: any, file?: Express.Multer.File) {
        const categoryInstance = new Category({ categoryId: data.categoryId });
        await categoryInstance.findById();
        if (!categoryInstance) throw new Error('Categoría no encontrada');

        const productData: ProductInterface = {
            name: data.name,
            price: parseInt(data.price),
            about: data.about,
            category: categoryInstance,
            isAvailable: data.isAvailable,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };

        const product = new Product(productData);
        return await product.save();
    }

    public async getAvailableProducts() {
        const products = await Product.getAll();
        return products.filter((product) => product.isAvailable);
    }

    public async getProducts() {
        return await Product.getAll();
    }

    public async getProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.findById();
    }

    public async updateProduct(id: string, updateData: ProductInterface, file?: Express.Multer.File) {
        if (updateData.price) updateData.price = +updateData.price;
        if (file) updateData.image = `/uploads/images/${file.filename}`;
        console.log(updateData);
        const categoryInstance = updateData.category ? new Category({ categoryId: updateData.category.toString()}) : undefined;
        if (categoryInstance) await categoryInstance.findById();

       
        const product = new Product({ productId: id });
        return await product.update({ ...updateData, category: categoryInstance });
    }

    public async deleteProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.delete();
    }

    public async getProductsByCategory(categoryName?: string) {
        const category = new Category({ name: categoryName });
        const existingCategory = await category.findByName();
        if (!existingCategory) throw new Error("Categoría no encontrada");

        return await Product.findByCategoryId(existingCategory.categoryId);
    }
}
