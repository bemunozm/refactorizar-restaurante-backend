import { ProductInterface, ProductIngredientInterface } from "../interfaces/ProductInterface";
import { Category } from "./Category";
export declare class Product implements ProductInterface {
    productId?: string;
    name: string;
    price: number;
    about: string;
    image: string;
    category: Category;
    ingredients: ProductIngredientInterface[];
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
    private populateProduct;
}
