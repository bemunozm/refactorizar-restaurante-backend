import { Product } from "../models/Product";
import { ProductInterface } from "../interfaces/ProductInterface";
export declare class ProductService {
    createProduct(data: any, file?: Express.Multer.File): Promise<Product>;
    getProducts(): Promise<Product[]>;
    getProduct(id: string): Promise<Product>;
    updateProduct(id: string, updateData: ProductInterface, file?: Express.Multer.File): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;
    getProductsByCategory(categoryName?: string): Promise<Product[]>;
}
