import { Category } from "../models/Category";
import { CategoryInterface } from "../interfaces/CategoryInterface";
export declare class CategoryService {
    createCategory(data: CategoryInterface, file?: Express.Multer.File): Promise<Category>;
    getCategories(): Promise<Category[]>;
    getCategory(id: string): Promise<Category>;
    updateCategory(id: string, updateData: CategoryInterface, file?: Express.Multer.File): Promise<Category>;
    deleteCategory(id: string): Promise<boolean>;
}
