import { ProductInterface } from "../interfaces/ProductInterface";
import { Category } from "./Category";
export declare class Product implements ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image: string;
    category: Category;
    isAvailable: boolean;
    private productRepository;
    constructor(data: Partial<ProductInterface>);
    private sanitizeData;
    populate(): Promise<void>;
    save(): Promise<this>;
    static getAll(): Promise<Product[]>;
    findById(): Promise<this>;
    update(updateData: Partial<ProductInterface>): Promise<this>;
    delete(): Promise<boolean>;
    static findByCategoryId(categoryId: string): Promise<Product[]>;
    static getMostSoldProduct(startDate: Date, endDate: Date): Promise<Product[]>;
    private populateProduct;
}
