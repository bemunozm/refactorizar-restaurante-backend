import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { ProductInterface } from "../interfaces/ProductInterface";

export class ProductService {
    public async createProduct(data: any, file?: Express.Multer.File) {
        console.log(data);
        const productData: ProductInterface = {
            name: data.name,
            price: parseInt(data.price),
            about: data.about,
            category: await new Category({ categoryId: data.categoryId }).findById(),
            ingredients: data.ingredients,
            image: file ? `/uploads/images/${file.filename}` : undefined
        };

        console.log(productData.ingredients);

        const product = new Product(productData);
        return await product.save();
    }

    public async getProducts() {
        return await Product.getAll();
    }

    public async getProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.findById();
    }

    public async updateProduct(id: string, updateData: Product, file?: Express.Multer.File) {
        if (updateData.price) {
            updateData.price = +updateData.price;
        }

        if (file) {
            updateData.image = `/uploads/images/${file.filename}`;
        }


        const product = new Product({ productId: id });
        return await product.update(updateData);
    }

    public async deleteProduct(id: string) {
        const product = new Product({ productId: id });
        return await product.delete();
    }

    public async getProductsByCategory(categoryName?: string) {
        const category = new Category({ name: categoryName });

        const existingCategory = await category.findByName();

        if (!existingCategory) {
            throw new Error("Category not found");
        }

        return await Product.findByCategoryId(category.categoryId);

    }
}
